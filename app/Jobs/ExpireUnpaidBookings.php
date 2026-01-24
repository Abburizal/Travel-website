<?php

namespace App\Jobs;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ExpireUnpaidBookings implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 1;
    public $timeout = 300;

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $expiryMinutes = config('booking.expiry_minutes', 30);
        $expiryTime = now()->subMinutes($expiryMinutes);

        try {
            $expiredBookings = Booking::where('status', 'pending')
                ->where('created_at', '<=', $expiryTime)
                ->get();

            $expiredCount = 0;

            foreach ($expiredBookings as $booking) {
                DB::transaction(function () use ($booking, &$expiredCount) {
                    // Lock the booking for update
                    $booking = Booking::where('id', $booking->id)
                        ->lockForUpdate()
                        ->first();

                    // Double check status hasn't changed
                    if ($booking && $booking->status === 'pending') {
                        // Restore tour quota
                        $tour = $booking->tour;
                        $tour->increment('quota', $booking->quantity);

                        // Update booking status
                        $booking->update(['status' => 'expired']);

                        $expiredCount++;

                        Log::info('Booking expired and quota restored', [
                            'booking_id' => $booking->id,
                            'tour_id' => $tour->id,
                            'quantity' => $booking->quantity,
                            'restored_quota' => $tour->fresh()->quota,
                        ]);
                    }
                });
            }

            if ($expiredCount > 0) {
                Log::info('Expired bookings processed', [
                    'total_expired' => $expiredCount,
                    'expiry_time' => $expiryTime->toDateTimeString(),
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Failed to expire bookings', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            throw $e;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('Expire unpaid bookings job failed', [
            'error' => $exception->getMessage(),
        ]);
    }
}
