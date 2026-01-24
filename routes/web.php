<?php

use App\Http\Controllers\Web\HomeController;
use Illuminate\Support\Facades\Route;

// SPA - catch all routes
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');
