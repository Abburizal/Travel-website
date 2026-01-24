<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Mail\BookingETicket;
use Illuminate\Support\Facades\Mail;

class PaymentSimulatorController extends Controller
{
    /**
     * Simulate payment page (Development only)
     */
    public function show($snapToken)
    {
        // Extract order_id from snap token (format: test-BOOK-{id}-{timestamp})
        $orderId = str_replace('test-', '', $snapToken);
        $parts = explode('-', $orderId);
        
        if (count($parts) < 2) {
            return response()->json(['error' => 'Invalid snap token'], 400);
        }
        
        $bookingId = $parts[1];
        $booking = Booking::with(['tour', 'user'])->find($bookingId);
        
        if (!$booking) {
            return response()->json(['error' => 'Booking not found'], 404);
        }

        return response()->json([
            'snap_token' => $snapToken,
            'order_id' => $orderId,
            'booking' => [
                'id' => $booking->id,
                'tour_name' => $booking->tour->name,
                'customer_name' => $booking->user->name,
                'customer_email' => $booking->user->email,
                'total_price' => $booking->total_price,
                'participants' => $booking->number_of_participants,
            ],
            'message' => 'Development Mode: Use /api/payment-simulator/complete endpoint to simulate payment'
        ]);
    }

    /**
     * Simulate successful payment (Development only)
     */
    public function complete(Request $request)
    {
        try {
            $validated = $request->validate([
                'snap_token' => 'required|string',
                'payment_method' => 'nullable|string',
            ]);

            $snapToken = $validated['snap_token'];
            $orderId = str_replace('test-', '', $snapToken);
            $parts = explode('-', $orderId);
            
            if (count($parts) < 2) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid snap token format'
                ], 400);
            }
            
            $bookingId = $parts[1];
            $booking = Booking::find($bookingId);
            
            if (!$booking) {
                return response()->json([
                    'success' => false,
                    'message' => 'Booking not found'
                ], 404);
            }

            $payment = Payment::where('booking_id', $booking->id)->first();
            
            if (!$payment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Payment record not found'
                ], 404);
            }

            // Prevent double payment
            if ($booking->status === 'paid') {
                return response()->json([
                    'success' => false,
                    'message' => 'Booking already paid'
                ], 400);
            }

            // Simulate Midtrans webhook payload
            $payload = [
                'transaction_status' => 'settlement',
                'order_id' => $orderId,
                'transaction_id' => 'SIM-' . time(),
                'payment_type' => $validated['payment_method'] ?? 'credit_card',
                'fraud_status' => 'accept',
                'gross_amount' => (string) $booking->total_price,
                'simulated' => true,
            ];

            // CRITICAL: Lock & increment quota in transaction
            DB::transaction(function () use ($booking, $payment, $payload) {
                // Lock tour row for update
                $tour = $booking->tour()->lockForUpdate()->first();

                // Check available seats
                $available = $tour->max_participants - $tour->booked_participants;
                if ($available < $booking->number_of_participants) {
                    throw new \Exception('Quota exceeded - not enough seats available');
                }

                // Lock seats
                $tour->increment('booked_participants', $booking->number_of_participants);

                // Update booking status
                $booking->update(['status' => 'paid']);

                // Update payment record
                $payment->update([
                    'status' => 'paid',
                    'payment_method' => $payload['payment_type'],
                    'transaction_id' => $payload['transaction_id'],
                    'payload' => $payload,
                ]);
            });

            // Send e-ticket email
            $booking->load(['user', 'tour']);
            Mail::to($booking->user->email)
                ->send(new BookingETicket($booking));

            \Log::info('Payment simulated successfully', [
                'booking_id' => $booking->id,
                'order_id' => $orderId,
                'mode' => 'simulator'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Payment simulation successful',
                'booking' => [
                    'id' => $booking->id,
                    'status' => $booking->status,
                    'tour_name' => $booking->tour->name,
                    'total_price' => $booking->total_price,
                ],
                'transaction_id' => $payload['transaction_id'],
            ], 200);

        } catch (\Exception $e) {
            \Log::error('Payment simulation failed: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Payment simulation failed: ' . $e->getMessage()
            ], 500);
        }
    }
}
