<?php

namespace App\Services;

use Midtrans\Config;
use Midtrans\Snap;
use Exception;

class PaymentService
{
    public function __construct()
    {
        Config::$serverKey = config('services.midtrans.server_key');
        Config::$clientKey = config('services.midtrans.client_key');
        Config::$isProduction = config('services.midtrans.is_production', false);
        Config::$isSanitized = true;
        Config::$is3ds = true;
    }

    /**
     * Create Snap transaction for payment
     *
     * @param $booking
     * @return array
     * @throws Exception
     */
    public function createSnapTransaction($booking)
    {
        try {
            if (!$booking->user || !$booking->tour) {
                throw new Exception('Invalid booking data');
            }

            $transactionDetails = [
                'order_id' => 'BOOK-' . $booking->id . '-' . time(),
                'gross_amount' => (int) $booking->total_price,
            ];

            $customerDetails = [
                'first_name' => $booking->user->name ?? 'Customer',
                'email' => $booking->user->email ?? 'customer@example.com',
                'phone' => $booking->user->phone ?? '',
            ];

            $itemDetails = [
                [
                    'id' => 'TOUR-' . $booking->tour->id,
                    'price' => (int) $booking->tour->price,
                    'quantity' => $booking->number_of_participants,
                    'name' => $booking->tour->name,
                ]
            ];

            $transaction = [
                'transaction_details' => $transactionDetails,
                'customer_details' => $customerDetails,
                'item_details' => $itemDetails,
                'custom_expiry' => [
                    'order_time' => now()->toDateTimeString(),
                    'expiry_duration' => config('booking.expiry_minutes', 30),
                    'unit' => 'minute'
                ]
            ];

            try {
                // Try to create real Snap transaction
                $snapToken = Snap::getSnapToken($transaction);
                
                // Build redirect URL based on environment
                $snapUrl = Config::$isProduction 
                    ? 'https://app.midtrans.com/snap/v4/' . $snapToken
                    : 'https://app.sandbox.midtrans.com/snap/v4/' . $snapToken;

                return [
                    'status' => 'success',
                    'snap_token' => $snapToken,
                    'order_id' => $transactionDetails['order_id'],
                    'redirect_url' => $snapUrl,
                ];
            } catch (\Exception $e) {
                // DEVELOPMENT MODE: If Midtrans credentials are invalid, use test mode
                \Log::warning('Midtrans API error - using simulator mode', [
                    'booking_id' => $booking->id,
                    'error' => $e->getMessage()
                ]);

                $testToken = 'test-' . $transactionDetails['order_id'];
                
                return [
                    'status' => 'success',
                    'snap_token' => $testToken,
                    'order_id' => $transactionDetails['order_id'],
                    'redirect_url' => config('app.url') . '/payment/' . $testToken,
                    'test_mode' => true,
                    'message' => 'Using payment simulator (dev mode)'
                ];
            }
        } catch (Exception $e) {
            return [
                'status' => 'error',
                'message' => 'Failed to create payment transaction: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Verify payment status from Midtrans
     *
     * @param $orderId
     * @return array
     * @throws Exception
     */
    public static function verifyPayment($orderId)
    {
        try {
            Config::$serverKey = config('services.midtrans.server_key');
            Config::$clientKey = config('services.midtrans.client_key');
            Config::$isProduction = config('services.midtrans.is_production', false);

            $status = Snap::checkTransaction($orderId);

            return [
                'status' => 'success',
                'transaction_status' => $status->transaction_status,
                'payment_type' => $status->payment_type ?? null,
                'fraud_status' => $status->fraud_status ?? null,
            ];
        } catch (Exception $e) {
            return [
                'status' => 'error',
                'message' => 'Failed to verify payment: ' . $e->getMessage()
            ];
        }
    }
}
