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
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('tour_id')->constrained()->cascadeOnDelete();
            $table->foreignId('booking_id')->constrained()->cascadeOnDelete();
            $table->tinyInteger('rating')->unsigned()->comment('1-5 stars');
            $table->text('comment')->nullable();
            $table->boolean('is_approved')->default(true);
            $table->timestamps();
            
            // Ensure one review per booking
            $table->unique('booking_id');
            
            // Index for faster queries
            $table->index(['tour_id', 'is_approved']);
            $table->index('rating');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
