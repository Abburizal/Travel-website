<?php

namespace App\Filament\Widgets;

use Filament\Widgets\ChartWidget;
use App\Models\Booking;

class RevenueChart extends ChartWidget
{
    protected static ?string $heading = 'Revenue Overview by Status';
    
    protected static ?int $sort = 3;
    
    protected static ?string $maxHeight = '300px';

    protected function getData(): array
    {
        $paid = Booking::where('status', 'paid')->sum('total_price');
        $pending = Booking::where('status', 'pending')->sum('total_price');
        $expired = Booking::where('status', 'expired')->sum('total_price');
        $cancelled = Booking::where('status', 'cancelled')->sum('total_price');

        return [
            'datasets' => [
                [
                    'label' => 'Revenue (IDR)',
                    'data' => [$paid, $pending, $expired, $cancelled],
                    'backgroundColor' => [
                        'rgba(34, 197, 94, 0.8)',   // Green for paid
                        'rgba(234, 179, 8, 0.8)',   // Yellow for pending
                        'rgba(239, 68, 68, 0.8)',   // Red for expired
                        'rgba(156, 163, 175, 0.8)', // Gray for cancelled
                    ],
                    'borderColor' => [
                        'rgb(34, 197, 94)',
                        'rgb(234, 179, 8)',
                        'rgb(239, 68, 68)',
                        'rgb(156, 163, 175)',
                    ],
                    'borderWidth' => 2,
                ],
            ],
            'labels' => [
                'Paid (Rp ' . number_format($paid / 1000000, 1) . 'M)', 
                'Pending (Rp ' . number_format($pending / 1000000, 1) . 'M)', 
                'Expired (Rp ' . number_format($expired / 1000000, 1) . 'M)', 
                'Cancelled (Rp ' . number_format($cancelled / 1000000, 1) . 'M)'
            ],
        ];
    }

    protected function getType(): string
    {
        return 'doughnut';
    }
    
    protected function getOptions(): array
    {
        return [
            'plugins' => [
                'legend' => [
                    'display' => true,
                    'position' => 'bottom',
                ],
            ],
        ];
    }
}
