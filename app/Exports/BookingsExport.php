<?php

namespace App\Exports;

use App\Models\Booking;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class BookingsExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    protected $filters;

    public function __construct($filters = [])
    {
        $this->filters = $filters;
    }

    /**
     * Get bookings collection with filters
     */
    public function collection()
    {
        $query = Booking::with(['user', 'tour']);

        // Apply date range filters
        if (isset($this->filters['from'])) {
            $query->whereDate('created_at', '>=', $this->filters['from']);
        }

        if (isset($this->filters['to'])) {
            $query->whereDate('created_at', '<=', $this->filters['to']);
        }

        // Filter by status
        if (isset($this->filters['status'])) {
            $query->where('status', $this->filters['status']);
        }

        // Filter by tour
        if (isset($this->filters['tour_id'])) {
            $query->where('tour_id', $this->filters['tour_id']);
        }

        return $query->latest()->get();
    }

    /**
     * Define table headers
     */
    public function headings(): array
    {
        return [
            'Booking ID',
            'User Name',
            'User Email',
            'Tour Name',
            'Booking Date',
            'Number of Participants',
            'Total Price (IDR)',
            'Status',
            'Payment Status',
            'Payment Method',
            'Created At',
        ];
    }

    /**
     * Map booking data to export format
     */
    public function map($booking): array
    {
        return [
            $booking->id,
            $booking->user?->name ?? 'N/A',
            $booking->user?->email ?? 'N/A',
            $booking->tour?->name ?? 'N/A',
            $booking->booking_date?->format('Y-m-d'),
            $booking->number_of_participants,
            $booking->total_price,
            ucfirst($booking->status),
            $booking->payment_status ?? 'N/A',
            $booking->payment_method ?? 'N/A',
            $booking->created_at->format('Y-m-d H:i:s'),
        ];
    }

    /**
     * Style the spreadsheet
     */
    public function styles(Worksheet $sheet)
    {
        return [
            // Style the first row (header)
            1 => [
                'font' => ['bold' => true, 'size' => 12],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'startColor' => ['rgb' => '10B981']
                ],
                'font' => ['color' => ['rgb' => 'FFFFFF']],
            ],
        ];
    }
}
