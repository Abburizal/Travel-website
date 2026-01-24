<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Booking;
use App\Models\Tour;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Get reviews for a specific tour
     */
    public function index(Request $request, $tourId)
    {
        $perPage = $request->get('per_page', 10);
        
        $reviews = Review::with('user')
            ->forTour($tourId)
            ->approved()
            ->latest()
            ->paginate($perPage);

        $tour = Tour::findOrFail($tourId);

        return response()->json([
            'success' => true,
            'data' => $reviews,
            'stats' => [
                'average_rating' => round($tour->average_rating, 1),
                'total_reviews' => $tour->review_count,
                'rating_distribution' => [
                    5 => Review::forTour($tourId)->approved()->where('rating', 5)->count(),
                    4 => Review::forTour($tourId)->approved()->where('rating', 4)->count(),
                    3 => Review::forTour($tourId)->approved()->where('rating', 3)->count(),
                    2 => Review::forTour($tourId)->approved()->where('rating', 2)->count(),
                    1 => Review::forTour($tourId)->approved()->where('rating', 1)->count(),
                ],
            ],
        ]);
    }

    /**
     * Store a new review
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'booking_id' => 'required|exists:bookings,id',
                'rating' => 'required|integer|min:1|max:5',
                'comment' => 'nullable|string|max:1000',
            ]);

            $booking = Booking::with(['tour', 'user'])->findOrFail($validated['booking_id']);

            // Security: Check if user owns this booking
            if ($booking->user_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }

            // Check if booking is paid
            if ($booking->status !== 'paid' && $booking->status !== 'completed') {
                return response()->json([
                    'success' => false,
                    'message' => 'You can only review completed bookings'
                ], 422);
            }

            // Check if already reviewed
            $existingReview = Review::where('booking_id', $booking->id)->first();
            if ($existingReview) {
                return response()->json([
                    'success' => false,
                    'message' => 'You have already reviewed this tour'
                ], 422);
            }

            // Create review
            $review = Review::create([
                'user_id' => $request->user()->id,
                'tour_id' => $booking->tour_id,
                'booking_id' => $booking->id,
                'rating' => $validated['rating'],
                'comment' => $validated['comment'] ?? null,
                'is_approved' => true, // Auto-approve (change to false if manual moderation needed)
            ]);

            $review->load('user');

            return response()->json([
                'success' => true,
                'data' => $review,
                'message' => 'Review submitted successfully!'
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
                'message' => 'Failed to submit review: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Check if user can review a booking
     */
    public function canReview(Request $request, $bookingId)
    {
        try {
            $booking = Booking::findOrFail($bookingId);

            // Check ownership
            if ($booking->user_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'can_review' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }

            // Check if paid/completed
            if ($booking->status !== 'paid' && $booking->status !== 'completed') {
                return response()->json([
                    'success' => true,
                    'can_review' => false,
                    'message' => 'Booking must be completed first'
                ]);
            }

            // Check if already reviewed
            $existingReview = Review::where('booking_id', $bookingId)->exists();
            if ($existingReview) {
                return response()->json([
                    'success' => true,
                    'can_review' => false,
                    'message' => 'Already reviewed'
                ]);
            }

            return response()->json([
                'success' => true,
                'can_review' => true,
                'message' => 'You can review this tour'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
