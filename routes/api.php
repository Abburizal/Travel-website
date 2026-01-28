<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TourController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\MidtransCallbackController;
use App\Http\Controllers\Api\PaymentSimulatorController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\ItineraryController;
use App\Http\Controllers\Api\WishlistController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\Admin\BulkOperationController;
use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\Admin\ExportController;

// Public routes
Route::get('/tours', [TourController::class, 'index']);
Route::get('/tours/{id}', [TourController::class, 'show']);
Route::get('/tours/{id}/itinerary/download', [ItineraryController::class, 'download']);
Route::get('/categories', [CategoryController::class, 'index']);

// Public reviews (no auth required to view)
Route::get('/tours/{tour}/reviews', [ReviewController::class, 'index']);

// Contact form submission
Route::post('/contact', [ContactController::class, 'submit']);

// Authentication routes (Public)
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Midtrans callback - NO AUTH REQUIRED
Route::post('/midtrans/callback', [MidtransCallbackController::class, 'handle'])->withoutMiddleware('api');

// Payment Simulator (Development Only) - NO AUTH REQUIRED
Route::get('/payment-simulator/{snapToken}', [PaymentSimulatorController::class, 'show']);
Route::post('/payment-simulator/complete', [PaymentSimulatorController::class, 'complete']);

// Protected routes - Requires Authentication
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/refresh-token', [AuthController::class, 'refreshToken']);

    // Booking routes
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::post('/bookings', [BookingController::class, 'store']);

    // Payment routes
    Route::post('/payments/{booking}', [PaymentController::class, 'create']);
    Route::post('/payments', [PaymentController::class, 'pay']);

    // Review routes
    Route::post('/tours/{tour}/reviews', [ReviewController::class, 'store']);
    Route::get('/tours/{tour}/can-review', [ReviewController::class, 'canReview']);

    // Wishlist routes
    Route::get('/wishlist', [WishlistController::class, 'index']);
    Route::post('/wishlist', [WishlistController::class, 'store']);
    Route::delete('/wishlist/{tourId}', [WishlistController::class, 'destroy']);
    Route::get('/wishlist/check/{tourId}', [WishlistController::class, 'check']);
    
    // Analytics routes (admin only - add middleware in future)
    Route::get('/analytics/popular-tours', [AnalyticsController::class, 'popularTours']);
    Route::get('/analytics/conversion-rates', [AnalyticsController::class, 'conversionRates']);
    Route::get('/analytics/revenue-stats', [AnalyticsController::class, 'revenueStats']);
    Route::get('/analytics/booking-trends', [AnalyticsController::class, 'bookingTrends']);
    Route::get('/analytics/user-engagement', [AnalyticsController::class, 'userEngagement']);
    Route::get('/analytics/dashboard-overview', [AnalyticsController::class, 'dashboardOverview']);
    
    // Admin bulk operations routes
    Route::prefix('admin/tours')->group(function () {
        Route::post('/bulk-delete', [BulkOperationController::class, 'bulkDelete']);
        Route::post('/bulk-update', [BulkOperationController::class, 'bulkUpdate']);
        Route::post('/bulk-restore', [BulkOperationController::class, 'bulkRestore']);
    });
    
    // Admin activity logs routes
    Route::prefix('admin/activity-logs')->group(function () {
        Route::get('/', [ActivityLogController::class, 'index']);
        Route::get('/stats', [ActivityLogController::class, 'stats']);
        Route::get('/{id}', [ActivityLogController::class, 'show']);
    });
    
    // Admin export routes
    Route::prefix('admin/export')->group(function () {
        Route::get('/tours', [ExportController::class, 'tours']);
        Route::get('/bookings', [ExportController::class, 'bookings']);
        Route::get('/stats', [ExportController::class, 'stats']);
    });
});
