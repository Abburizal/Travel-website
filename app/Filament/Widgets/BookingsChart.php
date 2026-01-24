<?php

namespace App\Filament\Widgets;

use Filament\Widgets\ChartWidget;
use App\Models\Booking;
use Illuminate\Support\Facades\DB;

class BookingsChart extends ChartWidget
{
    protected static ?string $heading = 'Bookings Trend (Last 7 Days)';
    
    protected static ?int $sort = 2;

    protected function getData(): array
    {
        $data = Booking::where('created_at', '>=', now()->subDays(7))
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as count'))
            ->groupBy('date')
            ->orderBy('date')
            ->get();
        
        // Generate labels for last 7 days
        $labels = [];
        $counts = [];
        
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $labels[] = now()->subDays($i)->format('M d');
            
            $booking = $data->firstWhere('date', $date);
            $counts[] = $booking ? $booking->count : 0;
        }

        return [
            'datasets' => [
                [
                    'label' => 'Bookings',
                    'data' => $counts,
                    'backgroundColor' => 'rgba(59, 130, 246, 0.5)',
                    'borderColor' => 'rgb(59, 130, 246)',
                ],
            ],
            'labels' => $labels,
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
