<?php

use App\Http\Controllers\Web\HomeController;
use App\Http\Controllers\SitemapController;
use Illuminate\Support\Facades\Route;

// Sitemap
Route::get('/sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');

// Robots.txt
Route::get('/robots.txt', function() {
    $robots = "User-agent: *\n";
    $robots .= "Allow: /\n";
    $robots .= "Disallow: /admin\n";
    $robots .= "Disallow: /api/\n\n";
    $robots .= "Sitemap: " . url('/sitemap.xml') . "\n";
    
    return response($robots, 200)->header('Content-Type', 'text/plain');
})->name('robots');

// SPA - catch all routes
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');
