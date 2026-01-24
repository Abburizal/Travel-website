<?php

namespace App\Filament\Widgets;

use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Total Tours', \App\Models\Tour::count())
                ->description('Total tour packages')
                ->descriptionIcon('heroicon-m-map')
                ->color('success'),
            Stat::make('Total Bookings', \App\Models\Booking::count())
                ->description('All time bookings')
                ->descriptionIcon('heroicon-m-ticket')
                ->color('info'),
            Stat::make('Pending Payments', \App\Models\Booking::where('status', 'pending')->count())
                ->description('Awaiting payment')
                ->descriptionIcon('heroicon-m-clock')
                ->color('warning'),
            Stat::make('Total Revenue', 'Rp ' . number_format(\App\Models\Booking::where('status', 'paid')->sum('total_price'), 0, ',', '.'))
                ->description('From paid bookings')
                ->descriptionIcon('heroicon-m-banknotes')
                ->color('success'),
        ];
    }
}
