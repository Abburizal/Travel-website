<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Tour extends Model implements HasMedia
{
    use InteractsWithMedia, LogsActivity, SoftDeletes;
    
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['name', 'price', 'duration', 'category_id', 'max_participants', 'destination'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    protected $fillable = [
        'name',
        'description',
        'price',
        'duration',
        'destination',
        'image',
        'images', // Multiple images support
        'category_id',
        'max_participants',
        'booked_participants',
        'start_date',
        'end_date',
        'highlights',
        'included',
        'excluded',
        'departure_location',
        'available_from',
        'available_until',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'available_from' => 'date',
        'available_until' => 'date',
        'images' => 'array', // Cast JSON to array
        'highlights' => 'array',
        'included' => 'array',
        'excluded' => 'array',
    ];

    /**
     * Register media collections
     */
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('images')
            ->useDisk('public');
        
        $this->addMediaCollection('itinerary')
            ->useDisk('public')
            ->singleFile() // Only one itinerary PDF per tour
            ->acceptsMimeTypes(['application/pdf']);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function approvedReviews()
    {
        return $this->hasMany(Review::class)->where('is_approved', true);
    }

    // Calculate average rating
    public function getAverageRatingAttribute()
    {
        return $this->approvedReviews()->avg('rating') ?? 0;
    }

    // Get total review count
    public function getReviewCountAttribute()
    {
        return $this->approvedReviews()->count();
    }

    /**
     * Get available seats count
     */
    public function getAvailableSeatsAttribute()
    {
        return $this->max_participants - $this->booked_participants;
    }
    
    /**
     * Get all images (both old 'image' field and new 'images' array)
     */
    public function getAllImagesAttribute()
    {
        $allImages = [];
        
        // Add old single image if exists
        if ($this->image) {
            $allImages[] = $this->image;
        }
        
        // Add new multiple images if exists
        if ($this->images && is_array($this->images)) {
            $allImages = array_merge($allImages, $this->images);
        }
        
        return array_unique($allImages);
    }
    
    /**
     * Get first image for thumbnail
     */
    public function getFirstImageAttribute()
    {
        $images = $this->getAllImagesAttribute();
        return !empty($images) ? $images[0] : null;
    }
}
