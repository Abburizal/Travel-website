<?php

namespace App\Filament\Pages;

use Filament\Pages\Dashboard as BaseDashboard;

class Dashboard extends BaseDashboard
{
    protected static string $view = 'filament.pages.dashboard';
    
    protected static ?string $title = 'Dashboard';
    
    protected static ?string $navigationIcon = 'heroicon-o-home';
    
    protected static ?int $navigationSort = -2;
    
    public function getColumns(): int | string | array
    {
        return [
            'md' => 2,
            'xl' => 3,
        ];
    }
    
    public function getWidgets(): array
    {
        return [
            \App\Filament\Widgets\StatsOverview::class,
            \App\Filament\Widgets\BookingsChart::class,
            \App\Filament\Widgets\RevenueChart::class,
            \App\Filament\Widgets\RecentBookingsWidget::class,
            \App\Filament\Widgets\PopularToursWidget::class,
        ];
    }
}
