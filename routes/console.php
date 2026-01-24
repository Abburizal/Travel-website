<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use App\Jobs\ExpireUnpaidBookings;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Schedule automated booking expiry check
Schedule::job(new ExpireUnpaidBookings)
    ->everyFiveMinutes()
    ->name('expire-unpaid-bookings')
    ->withoutOverlapping()
    ->onOneServer();
