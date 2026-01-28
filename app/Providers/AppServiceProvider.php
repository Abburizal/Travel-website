<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\Tour;
use App\Observers\TourObserver;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register Tour Observer for cache invalidation
        Tour::observe(TourObserver::class);
    }
}
