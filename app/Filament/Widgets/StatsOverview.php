<?php

namespace App\Filament\Widgets;

use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use App\Models\Tour;
use App\Models\Booking;
use App\Models\User;

class StatsOverview extends BaseWidget
{
    protected static ?int $sort = 1;
    
    protected function getStats(): array
    {
        // Calculate trends
        $toursCount = Tour::count();
        $toursLastMonth = Tour::where('created_at', '>=', now()->subMonth())->count();
        
        $bookingsCount = Booking::count();
        $bookingsLastWeek = Booking::where('created_at', '>=', now()->subWeek())->count();
        $bookingsLastMonth = Booking::where('created_at', '>=', now()->subMonth())->count();
        
        $pendingPayments = Booking::where('status', 'pending')->count();
        $expiringSoon = Booking::where('status', 'pending')
            ->where('created_at', '<=', now()->subHours(22))
            ->where('created_at', '>=', now()->subHours(24))
            ->count();
        
        $totalRevenue = Booking::where('status', 'paid')->sum('total_price');
        $revenueThisMonth = Booking::where('status', 'paid')
            ->whereMonth('created_at', now()->month)
            ->sum('total_price');
        $revenueLastMonth = Booking::where('status', 'paid')
            ->whereMonth('created_at', now()->subMonth()->month)
            ->sum('total_price');
        $revenueGrowth = $revenueLastMonth > 0 
            ? round((($revenueThisMonth - $revenueLastMonth) / $revenueLastMonth) * 100, 1)
            : 0;
        
        $customersCount = User::count();
        $newCustomers = User::where('created_at', '>=', now()->subMonth())->count();

        return [
            Stat::make('Total Tours', number_format($toursCount))
                ->description($toursLastMonth > 0 ? "+{$toursLastMonth} new this month" : 'Total packages available')
                ->descriptionIcon($toursLastMonth > 0 ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-map')
                ->chart([7, 3, 4, 5, 6, 3, 5, 6, $toursLastMonth])
                ->color('primary'),
                
            Stat::make('Total Bookings', number_format($bookingsCount))
                ->description("+{$bookingsLastWeek} this week")
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->chart([3, 5, 2, 8, 6, 7, $bookingsLastWeek])
                ->color('success'),
                
            Stat::make('Pending Payments', number_format($pendingPayments))
                ->description($expiringSoon > 0 ? "{$expiringSoon} expiring soon" : 'Awaiting payment')
                ->descriptionIcon($expiringSoon > 0 ? 'heroicon-m-exclamation-triangle' : 'heroicon-m-clock')
                ->color($expiringSoon > 0 ? 'danger' : 'warning'),
                
            Stat::make('Revenue This Month', 'Rp ' . number_format($revenueThisMonth, 0, ',', '.'))
                ->description($revenueGrowth > 0 ? "+{$revenueGrowth}% from last month" : ($revenueGrowth < 0 ? "{$revenueGrowth}% from last month" : "Same as last month"))
                ->descriptionIcon($revenueGrowth > 0 ? 'heroicon-m-arrow-trending-up' : ($revenueGrowth < 0 ? 'heroicon-m-arrow-trending-down' : 'heroicon-m-minus'))
                ->chart([65, 59, 80, 81, 56, 55, 70, $revenueThisMonth / 1000000])
                ->color($revenueGrowth >= 0 ? 'success' : 'danger'),
                
            Stat::make('Total Customers', number_format($customersCount))
                ->description("+{$newCustomers} new customers")
                ->descriptionIcon('heroicon-m-user-group')
                ->chart([12, 15, 18, 22, 25, $newCustomers])
                ->color('info'),
                
            Stat::make('Total Revenue', 'Rp ' . number_format($totalRevenue, 0, ',', '.'))
                ->description('All time earnings')
                ->descriptionIcon('heroicon-m-banknotes')
                ->color('success'),
        ];
    }
}
