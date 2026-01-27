<?php

namespace App\Filament\Widgets;

use App\Models\Booking;
use App\Models\Category;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Facades\DB;

class RevenueByCategoryChart extends ChartWidget
{
    protected static ?string $heading = 'Revenue by Category';
    
    protected static ?int $sort = 3;
    
    protected int | string | array $columnSpan = 'full';

    protected function getData(): array
    {
        // Get revenue by category
        $data = Booking::where('status', 'paid')
            ->join('tours', 'bookings.tour_id', '=', 'tours.id')
            ->join('categories', 'tours.category_id', '=', 'categories.id')
            ->select('categories.name', DB::raw('SUM(bookings.total_price) as revenue'))
            ->groupBy('categories.id', 'categories.name')
            ->orderBy('revenue', 'desc')
            ->limit(10)
            ->get();

        return [
            'datasets' => [
                [
                    'label' => 'Revenue (IDR)',
                    'data' => $data->pluck('revenue')->toArray(),
                    'backgroundColor' => [
                        '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
                        '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#84cc16',
                    ],
                ],
            ],
            'labels' => $data->pluck('name')->toArray(),
        ];
    }

    protected function getType(): string
    {
        return 'bar';
    }
}
