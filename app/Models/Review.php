<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $fillable = [
        'user_id',
        'tour_id',
        'booking_id',
        'rating',
        'comment',
        'is_approved',
    ];

    protected $casts = [
        'rating' => 'integer',
        'is_approved' => 'boolean',
    ];

    protected $with = ['user'];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function tour()
    {
        return $this->belongsTo(Tour::class);
    }

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    // Scopes
    public function scopeApproved($query)
    {
        return $query->where('is_approved', true);
    }

    public function scopeForTour($query, $tourId)
    {
        return $query->where('tour_id', $tourId);
    }
}
