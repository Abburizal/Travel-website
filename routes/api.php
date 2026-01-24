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

// Public routes
Route::get('/tours', [TourController::class, 'index']);
Route::get('/tours/{id}', [TourController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);

// Public reviews (no auth required to view)
Route::get('/tours/{tour}/reviews', [ReviewController::class, 'index']);

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
    Route::post('/reviews', [ReviewController::class, 'store']);
    Route::get('/bookings/{booking}/can-review', [ReviewController::class, 'canReview']);
});
