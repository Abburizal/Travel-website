<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Exports\ToursExport;
use App\Exports\BookingsExport;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class ExportController extends Controller
{
    /**
     * Export tours to Excel or CSV
     * 
     * GET /api/admin/export/tours?format=xlsx&category_id=1&from=2024-01-01&to=2024-12-31
     */
    public function tours(Request $request)
    {
        $request->validate([
            'format' => 'in:xlsx,csv',
            'category_id' => 'nullable|exists:categories,id',
            'from' => 'nullable|date',
            'to' => 'nullable|date|after_or_equal:from',
        ]);

        $format = $request->get('format', 'xlsx');
        $filters = $request->only(['category_id', 'from', 'to']);

        $filename = 'tours_' . now()->format('Y-m-d_His') . '.' . $format;

        try {
            return Excel::download(
                new ToursExport($filters),
                $filename,
                $format === 'csv' ? \Maatwebsite\Excel\Excel::CSV : \Maatwebsite\Excel\Excel::XLSX
            );
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to export tours: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Export bookings to Excel or CSV
     * 
     * GET /api/admin/export/bookings?format=xlsx&from=2024-01-01&to=2024-12-31&status=confirmed
     */
    public function bookings(Request $request)
    {
        $request->validate([
            'format' => 'in:xlsx,csv',
            'from' => 'nullable|date',
            'to' => 'nullable|date|after_or_equal:from',
            'status' => 'nullable|in:pending,confirmed,cancelled,completed',
            'tour_id' => 'nullable|exists:tours,id',
        ]);

        $format = $request->get('format', 'xlsx');
        $filters = $request->only(['from', 'to', 'status', 'tour_id']);

        $filename = 'bookings_' . now()->format('Y-m-d_His') . '.' . $format;

        try {
            return Excel::download(
                new BookingsExport($filters),
                $filename,
                $format === 'csv' ? \Maatwebsite\Excel\Excel::CSV : \Maatwebsite\Excel\Excel::XLSX
            );
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to export bookings: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get export statistics
     * 
     * GET /api/admin/export/stats
     */
    public function stats()
    {
        $stats = [
            'total_tours' => \App\Models\Tour::count(),
            'active_tours' => \App\Models\Tour::whereNull('deleted_at')->count(),
            'deleted_tours' => \App\Models\Tour::onlyTrashed()->count(),
            'total_bookings' => \App\Models\Booking::count(),
            'confirmed_bookings' => \App\Models\Booking::where('status', 'confirmed')->count(),
            'pending_bookings' => \App\Models\Booking::where('status', 'pending')->count(),
            'total_revenue' => \App\Models\Booking::where('status', 'confirmed')->sum('total_price'),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}
