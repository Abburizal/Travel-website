<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Configure API authentication to return JSON instead of redirecting
        $middleware->redirectGuestsTo(function ($request) {
            if ($request->is('api/*')) {
                // For API routes, don't redirect - let Sanctum handle it
                return null;
            }
            return route('login');
        });
    })
    ->withSchedule(function (\Illuminate\Console\Scheduling\Schedule $schedule): void {
        // Auto-expire pending bookings every minute
        $schedule->command('bookings:expire')->everyMinute();
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Handle unauthenticated users for API routes
        $exceptions->shouldRenderJsonWhen(function ($request, $exception) {
            return $request->is('api/*');
        });
    })->create();
