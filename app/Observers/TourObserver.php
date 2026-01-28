<?php

namespace App\Observers;

use App\Models\Tour;
use Illuminate\Support\Facades\Cache;

class TourObserver
{
    /**
     * Handle the Tour "created" event.
     */
    public function created(Tour $tour): void
    {
        $this->clearTourCaches();
    }

    /**
     * Handle the Tour "updated" event.
     */
    public function updated(Tour $tour): void
    {
        $this->clearTourCaches();
        Cache::forget("tour_{$tour->id}");
    }

    /**
     * Handle the Tour "deleted" event.
     */
    public function deleted(Tour $tour): void
    {
        $this->clearTourCaches();
        Cache::forget("tour_{$tour->id}");
    }

    /**
     * Handle the Tour "restored" event.
     */
    public function restored(Tour $tour): void
    {
        $this->clearTourCaches();
    }

    /**
     * Clear all tour list caches
     */
    private function clearTourCaches(): void
    {
        // In production, implement more selective cache clearing
        // For now, we'll let cache expire naturally (5-10 minutes)
    }
}
