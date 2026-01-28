<?php

namespace App\Exports;

use App\Models\Tour;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ToursExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    protected $filters;

    public function __construct($filters = [])
    {
        $this->filters = $filters;
    }

    /**
     * Get tours collection with filters
     */
    public function collection()
    {
        $query = Tour::with(['category'])
            ->withTrashed(); // Include soft-deleted tours

        // Apply filters if provided
        if (isset($this->filters['category_id'])) {
            $query->where('category_id', $this->filters['category_id']);
        }

        if (isset($this->filters['from'])) {
            $query->whereDate('created_at', '>=', $this->filters['from']);
        }

        if (isset($this->filters['to'])) {
            $query->whereDate('created_at', '<=', $this->filters['to']);
        }

        return $query->get();
    }

    /**
     * Define table headers
     */
    public function headings(): array
    {
        return [
            'ID',
            'Name',
            'Category',
            'Destination',
            'Duration',
            'Price (IDR)',
            'Max Participants',
            'Booked Participants',
            'Available Seats',
            'Start Date',
            'End Date',
            'Status',
            'Created At',
            'Updated At',
        ];
    }

    /**
     * Map tour data to export format
     */
    public function map($tour): array
    {
        return [
            $tour->id,
            $tour->name,
            $tour->category?->name ?? 'N/A',
            $tour->destination,
            $tour->duration,
            $tour->price,
            $tour->max_participants,
            $tour->booked_participants,
            $tour->available_seats,
            $tour->start_date?->format('Y-m-d'),
            $tour->end_date?->format('Y-m-d'),
            $tour->deleted_at ? 'Deleted' : 'Active',
            $tour->created_at->format('Y-m-d H:i:s'),
            $tour->updated_at->format('Y-m-d H:i:s'),
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
                    'startColor' => ['rgb' => '4299E1']
                ],
                'font' => ['color' => ['rgb' => 'FFFFFF']],
            ],
        ];
    }
}
