<?php

namespace App\Filament\Widgets;

use Filament\Widgets\ChartWidget;
use App\Models\Booking;

class RevenueChart extends ChartWidget
{
    protected static ?string $heading = 'Revenue by Status';
    
    protected static ?int $sort = 3;

    protected function getData(): array
    {
        $paid = Booking::where('status', 'paid')->sum('total_price');
        $pending = Booking::where('status', 'pending')->sum('total_price');
        $expired = Booking::where('status', 'expired')->sum('total_price');
        $cancelled = Booking::where('status', 'cancelled')->sum('total_price');

        return [
            'datasets' => [
                [
                    'label' => 'Revenue',
                    'data' => [$paid, $pending, $expired, $cancelled],
                    'backgroundColor' => [
                        'rgba(34, 197, 94, 0.5)',
                        'rgba(234, 179, 8, 0.5)',
                        'rgba(239, 68, 68, 0.5)',
                        'rgba(156, 163, 175, 0.5)',
                    ],
                ],
            ],
            'labels' => ['Paid', 'Pending', 'Expired', 'Cancelled'],
        ];
    }

    protected function getType(): string
    {
        return 'doughnut';
    }
}
