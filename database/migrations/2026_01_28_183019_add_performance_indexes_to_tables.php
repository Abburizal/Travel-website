<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Tours table indexes
        Schema::table('tours', function (Blueprint $table) {
            $table->index('category_id', 'idx_tours_category');
            $table->index('price', 'idx_tours_price');
            $table->index('start_date', 'idx_tours_start_date');
            $table->index('created_at', 'idx_tours_created_at');
            $table->index(['category_id', 'price'], 'idx_tours_category_price');
            $table->index('deleted_at', 'idx_tours_deleted_at');
        });

        // Bookings table indexes
        Schema::table('bookings', function (Blueprint $table) {
            $table->index('user_id', 'idx_bookings_user');
            $table->index('tour_id', 'idx_bookings_tour');
            $table->index('status', 'idx_bookings_status');
            $table->index('booking_date', 'idx_bookings_date');
            $table->index(['user_id', 'status'], 'idx_bookings_user_status');
            $table->index(['tour_id', 'status'], 'idx_bookings_tour_status');
        });

        // Reviews table indexes
        Schema::table('reviews', function (Blueprint $table) {
            $table->index('tour_id', 'idx_reviews_tour');
            $table->index('user_id', 'idx_reviews_user');
            $table->index('rating', 'idx_reviews_rating');
            $table->index('created_at', 'idx_reviews_created_at');
        });

        // Wishlist table indexes
        Schema::table('wishlists', function (Blueprint $table) {
            $table->index('user_id', 'idx_wishlists_user');
            $table->index('tour_id', 'idx_wishlists_tour');
            $table->index(['user_id', 'tour_id'], 'idx_wishlists_user_tour');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tours', function (Blueprint $table) {
            $table->dropIndex('idx_tours_category');
            $table->dropIndex('idx_tours_price');
            $table->dropIndex('idx_tours_start_date');
            $table->dropIndex('idx_tours_created_at');
            $table->dropIndex('idx_tours_category_price');
            $table->dropIndex('idx_tours_deleted_at');
        });

        Schema::table('bookings', function (Blueprint $table) {
            $table->dropIndex('idx_bookings_user');
            $table->dropIndex('idx_bookings_tour');
            $table->dropIndex('idx_bookings_status');
            $table->dropIndex('idx_bookings_date');
            $table->dropIndex('idx_bookings_user_status');
            $table->dropIndex('idx_bookings_tour_status');
        });

        Schema::table('reviews', function (Blueprint $table) {
            $table->dropIndex('idx_reviews_tour');
            $table->dropIndex('idx_reviews_user');
            $table->dropIndex('idx_reviews_rating');
            $table->dropIndex('idx_reviews_created_at');
        });

        Schema::table('wishlists', function (Blueprint $table) {
            $table->dropIndex('idx_wishlists_user');
            $table->dropIndex('idx_wishlists_tour');
            $table->dropIndex('idx_wishlists_user_tour');
        });
    }
};
