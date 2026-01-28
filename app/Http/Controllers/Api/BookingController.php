<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Booking;
use App\Jobs\SendInvoiceEmail;
use App\Mail\BookingConfirmation;
use Illuminate\Support\Facades\Mail;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        // Only return bookings for authenticated user
        $bookings = Booking::with('tour')
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $bookings
        ], 200);
    }

    public function store(Request $request)
    {
        try {
            // Security: Ensure user is authenticated  
            if (!$request->user()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated'
                ], 401);
            }

            $validated = $request->validate([
                'tour_id' => 'required|exists:tours,id',
                'booking_date' => 'required|date',
                'number_of_participants' => 'required|integer|min:1',
            ]);

            // Use authenticated user ID instead of user input (SECURITY FIX)
            $userId = $request->user()->id;
            $expiryMinutes = (int) config('booking.expiry_minutes', 30);

            // CONCURRENCY FIX: Use database transaction with row locking
            $result = \Illuminate\Support\Facades\DB::transaction(function () use ($validated, $userId, $expiryMinutes) {
                // Lock the tour row to prevent race condition
                $tour = \App\Models\Tour::where('id', $validated['tour_id'])
                    ->lockForUpdate()
                    ->first();

                if (!$tour) {
                    throw new \Exception('Tour not found');
                }

                // Calculate available seats
                $available = $tour->max_participants - $tour->booked_participants;

                // Check if enough seats available
                if ($available < $validated['number_of_participants']) {
                    throw new \Exception(
                        'Not enough seats available. Available: ' . $available . 
                        ', Requested: ' . $validated['number_of_participants']
                    );
                }

                // Calculate total price
                $total_price = $tour->price * $validated['number_of_participants'];

                // Set expiry time
                $expiredAt = now()->addMinutes($expiryMinutes);

                // Create booking
                $booking = Booking::create([
                    'tour_id' => $validated['tour_id'],
                    'user_id' => $userId,
                    'booking_date' => $validated['booking_date'],
                    'number_of_participants' => $validated['number_of_participants'],
                    'total_price' => $total_price,
                    'status' => 'pending',
                    'expired_at' => $expiredAt,
                ]);

                return [
                    'booking' => $booking,
                    'expired_at' => $expiredAt,
                    'available' => $available,
                    'total_price' => $total_price,
                ];
            }, 5); // 5 attempts for deadlock retry

            // Load relationships for email
            $booking = Booking::with(['user', 'tour'])->find($result['booking']->id);

            // Queue invoice email to send in background
            SendInvoiceEmail::dispatch($booking);
            
            // Send booking confirmation email
            Mail::to($booking->user->email)->queue(new BookingConfirmation($booking));

            return response()->json([
                'success' => true,
                'data' => $result['booking'],
                'expired_at' => $result['expired_at'],
                'remaining_seconds' => $expiryMinutes * 60,
                'available_seats' => $result['available'] - $validated['number_of_participants'],
                'message' => 'Booking created successfully. Invoice email sent. Payment required within ' . $expiryMinutes . ' minutes.'
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}