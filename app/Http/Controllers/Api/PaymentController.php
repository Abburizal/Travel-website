<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Payment;
use App\Services\PaymentService;

class PaymentController extends Controller
{
    protected $paymentService;

    public function __construct(PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    public function create(Request $request, $bookingId)
    {
        try {
            $booking = Booking::with(['tour', 'user'])->findOrFail($bookingId);

            // Debug logging
            \Log::info('Payment request', [
                'booking_id' => $bookingId,
                'booking_user_id' => $booking->user_id,
                'auth_user_id' => $request->user()->id,
            ]);

            // Security: Ensure user owns this booking
            if ($booking->user_id !== $request->user()->id) {
                \Log::warning('Unauthorized payment access attempt', [
                    'booking_id' => $bookingId,
                    'booking_user_id' => $booking->user_id,
                    'requesting_user_id' => $request->user()->id,
                ]);
                
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to this booking'
                ], 403);
            }

            // Check if booking is expired
            if ($booking->expired_at && now()->greaterThan($booking->expired_at)) {
                $booking->update(['status' => 'cancelled']);
                return response()->json([
                    'success' => false,
                    'message' => 'Booking expired. Please create a new booking.'
                ], 410);
            }

            if ($booking->status !== 'pending') {
                return response()->json([
                    'success' => false,
                    'message' => 'Booking already processed'
                ], 422);
            }

            // Use PaymentService to create Snap transaction
            $result = $this->paymentService->createSnapTransaction($booking);

            if ($result['status'] === 'error') {
                return response()->json([
                    'success' => false,
                    'message' => $result['message']
                ], 500);
            }

            // Save payment record
            Payment::updateOrCreate(
                ['booking_id' => $booking->id],
                [
                    'status' => 'pending',
                    'payload' => [
                        'order_id' => $result['order_id'],
                        'snap_token' => $result['snap_token'],
                    ],
                ]
            );

            return response()->json([
                'success' => true,
                'snap_token' => $result['snap_token'],
                'booking_id' => $booking->id,
                'order_id' => $result['order_id'],
                'redirect_url' => $result['redirect_url'],
                'gross_amount' => (int) $booking->total_price,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create payment token: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function pay(Request $request)
    {
        try {
            $validated = $request->validate([
                'booking_id' => 'required|exists:bookings,id',
                'amount' => 'required|numeric|min:0',
                'payment_method' => 'required|in:card,bank_transfer,e_wallet',
            ]);

            $payment = Payment::create($validated + ['status' => 'pending']);

            return response()->json([
                'success' => true,
                'data' => $payment,
                'message' => 'Payment initiated'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
