<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Mail\ReviewSubmitted;

class ReviewController extends Controller
{
    /**
     * Get reviews for a specific tour
     */
    public function index($tourId)
    {
        $reviews = Review::with(['user'])
            ->forTour($tourId)
            ->approved()
            ->latest()
            ->get()
            ->map(function($review) {
                return [
                    'id' => $review->id,
                    'user_name' => $review->user->name,
                    'rating' => $review->rating,
                    'comment' => $review->comment,
                    'created_at' => $review->created_at->format('M d, Y'),
                    'created_at_human' => $review->created_at->diffForHumans(),
                ];
            });

        // Get rating statistics
        $allReviews = Review::forTour($tourId)->approved()->get();
        $stats = [
            'total_reviews' => $allReviews->count(),
            'average_rating' => round($allReviews->avg('rating'), 1),
            'rating_breakdown' => [
                5 => $allReviews->where('rating', 5)->count(),
                4 => $allReviews->where('rating', 4)->count(),
                3 => $allReviews->where('rating', 3)->count(),
                2 => $allReviews->where('rating', 2)->count(),
                1 => $allReviews->where('rating', 1)->count(),
            ],
        ];

        return response()->json([
            'reviews' => $reviews,
            'stats' => $stats,
        ]);
    }

    /**
     * Submit a new review
     */
    public function store(Request $request, $tourId)
    {
        // Validate request
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|min:10|max:1000',
            'booking_id' => 'required|exists:bookings,id',
        ]);

        // Check if user is authenticated
        if (!Auth::check()) {
            return response()->json([
                'message' => 'You must be logged in to submit a review'
            ], 401);
        }

        $userId = Auth::id();

        // Verify booking belongs to user and is for this tour
        $booking = Booking::where('id', $validated['booking_id'])
            ->where('user_id', $userId)
            ->where('tour_id', $tourId)
            ->where('status', 'confirmed')
            ->first();

        if (!$booking) {
            return response()->json([
                'message' => 'You can only review tours you have booked and completed'
            ], 403);
        }

        // Check if user already reviewed this booking
        $existingReview = Review::where('booking_id', $validated['booking_id'])
            ->where('user_id', $userId)
            ->first();

        if ($existingReview) {
            return response()->json([
                'message' => 'You have already reviewed this booking'
            ], 422);
        }

        // Create review
        $review = Review::create([
            'user_id' => $userId,
            'tour_id' => $tourId,
            'booking_id' => $validated['booking_id'],
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
            'is_approved' => false, // Requires admin approval
        ]);
        
        // Load relationships for email
        $review->load(['user', 'tour']);
        
        // Send review submitted notification email
        Mail::to($review->user->email)->queue(new ReviewSubmitted($review));

        return response()->json([
            'message' => 'Review submitted successfully! It will be published after approval.',
            'review' => $review,
        ], 201);
    }

    /**
     * Check if user can review a tour
     */
    public function canReview($tourId)
    {
        if (!Auth::check()) {
            return response()->json([
                'can_review' => false,
                'message' => 'You must be logged in',
            ]);
        }

        $userId = Auth::id();

        // Get user's confirmed bookings for this tour
        $bookings = Booking::where('user_id', $userId)
            ->where('tour_id', $tourId)
            ->where('status', 'confirmed')
            ->get();

        // Filter out bookings that already have reviews
        $reviewableBookings = $bookings->filter(function($booking) use ($userId) {
            return !Review::where('booking_id', $booking->id)
                ->where('user_id', $userId)
                ->exists();
        });

        return response()->json([
            'can_review' => $reviewableBookings->count() > 0,
            'bookings' => $reviewableBookings->map(function($booking) {
                return [
                    'id' => $booking->id,
                    'booking_date' => $booking->booking_date->format('M d, Y'),
                ];
            }),
        ]);
    }
}
