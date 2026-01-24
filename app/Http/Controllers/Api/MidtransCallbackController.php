<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Payment;
use App\Jobs\SendETicketEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Midtrans\Config;

class MidtransCallbackController extends Controller
{
    public function handle(Request $request)
    {
        try {
            Config::$serverKey = config('services.midtrans.server_key');
            Config::$isProduction = config('services.midtrans.is_production');

            // Get payload from request
            $payload = $request->all();

            $transactionStatus = $payload['transaction_status'] ?? null;
            $paymentType = $payload['payment_type'] ?? null;
            $orderId = $payload['order_id'] ?? null;
            $transactionId = $payload['transaction_id'] ?? null;
            $fraudStatus = $payload['fraud_status'] ?? 'accept';

            if (!$orderId || !$transactionStatus) {
                return response()->json(['message' => 'Missing required fields'], 400);
            }

            // Extract booking ID from order_id (format: BOOKING-{id}-{timestamp})
            $parts = explode('-', $orderId);
            if (count($parts) < 2) {
                return response()->json(['message' => 'Invalid order_id format'], 400);
            }

            $bookingId = $parts[1];
            $booking = Booking::find($bookingId);

            if (!$booking) {
                return response()->json(['message' => 'Booking not found'], 404);
            }

            $payment = Payment::where('booking_id', $booking->id)->first();

            if (!$payment) {
                return response()->json(['message' => 'Payment not found'], 404);
            }

            // Prevent status downgrade (security: status immutable setelah paid)
            if ($booking->status === 'paid') {
                return response()->json(['message' => 'Booking already paid'], 200);
            }

            // STATUS MAPPING MIDTRANS
            if ($transactionStatus == 'capture' || $transactionStatus == 'settlement') {
                // Verify fraud status
                if ($fraudStatus != 'deny') {
                    // CRITICAL: Lock & increment quota in transaction
                    DB::transaction(function () use ($booking, $payment, $payload, $paymentType, $transactionId) {
                        // Lock tour row for update (prevents race condition)
                        $tour = $booking->tour()->lockForUpdate()->first();

                        // Check available seats AGAIN (final check)
                        $available = $tour->max_participants - $tour->booked_participants;
                        if ($available < $booking->number_of_participants) {
                            throw new \Exception('Quota exceeded - not enough seats available');
                        }

                        // LOCK SEATS - increment booked_participants
                        $tour->increment('booked_participants', $booking->number_of_participants);

                        // Update booking status
                        $booking->update(['status' => 'paid']);

                        // Update payment record
                        $payment->update([
                            'status' => 'paid',
                            'payment_method' => $paymentType,
                            'transaction_id' => $transactionId,
                            'payload' => $payload,
                        ]);
                    });
                    
                    // Queue e-ticket email to send in background
                    $booking->load(['user', 'tour']);
                    SendETicketEmail::dispatch($booking);
                    
                    \Log::info('Payment successful for booking ' . $booking->id, [
                        'transaction_id' => $transactionId,
                        'payment_type' => $paymentType,
                        'participants' => $booking->number_of_participants,
                    ]);
                }
            } elseif ($transactionStatus == 'pending') {
                // Pending: do nothing to quota
                $booking->update(['status' => 'pending']);
                $payment->update([
                    'status' => 'pending',
                    'transaction_id' => $transactionId,
                    'payload' => $payload,
                ]);
                
                \Log::info('Payment pending for booking ' . $booking->id);
            } elseif (in_array($transactionStatus, ['deny', 'cancel', 'expire'])) {
                // Cancelled/Denied/Expired: do nothing to quota
                $booking->update(['status' => 'cancelled']);
                $payment->update([
                    'status' => $transactionStatus,
                    'transaction_id' => $transactionId,
                    'payload' => $payload,
                ]);
                
                \Log::warning('Payment ' . $transactionStatus . ' for booking ' . $booking->id);
            }

            return response()->json(['message' => 'Callback processed successfully'], 200);
        } catch (\Exception $e) {
            \Log::error('Midtrans callback error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json(['message' => 'Callback processing failed'], 500);
        }
    }
}
