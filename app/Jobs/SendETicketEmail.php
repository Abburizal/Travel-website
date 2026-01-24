<?php

namespace App\Jobs;

use App\Mail\BookingETicket;
use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendETicketEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $timeout = 120;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public Booking $booking
    ) {
        $this->onQueue('emails');
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            Mail::to($this->booking->email)
                ->send(new BookingETicket($this->booking));

            Log::info('E-Ticket email sent successfully', [
                'booking_id' => $this->booking->id,
                'email' => $this->booking->email,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to send e-ticket email', [
                'booking_id' => $this->booking->id,
                'email' => $this->booking->email,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('E-Ticket email job failed permanently', [
            'booking_id' => $this->booking->id,
            'email' => $this->booking->email,
            'error' => $exception->getMessage(),
        ]);
    }
}
