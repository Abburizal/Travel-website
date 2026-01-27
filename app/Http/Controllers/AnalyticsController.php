<?php

namespace App\Http\Controllers;

use App\Models\Tour;
use App\Models\Booking;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    /**
     * Get most popular tours (by booking count)
     */
    public function popularTours(Request $request)
    {
        $limit = $request->get('limit', 10);
        
        $tours = Tour::withCount('bookings')
            ->orderBy('bookings_count', 'desc')
            ->limit($limit)
            ->get(['id', 'name', 'price', 'bookings_count']);

        return response()->json([
            'success' => true,
            'data' => $tours
        ]);
    }

    /**
     * Get conversion rate statistics
     */
    public function conversionRates()
    {
        $totalUsers = User::count();
        $usersWithBookings = User::has('bookings')->count();
        $totalBookings = Booking::count();
        $paidBookings = Booking::where('status', 'paid')->count();
        
        $conversionRate = $totalUsers > 0 ? ($usersWithBookings / $totalUsers) * 100 : 0;
        $paymentSuccessRate = $totalBookings > 0 ? ($paidBookings / $totalBookings) * 100 : 0;

        return response()->json([
            'success' => true,
            'data' => [
                'total_users' => $totalUsers,
                'users_with_bookings' => $usersWithBookings,
                'conversion_rate' => round($conversionRate, 2),
                'total_bookings' => $totalBookings,
                'paid_bookings' => $paidBookings,
                'payment_success_rate' => round($paymentSuccessRate, 2)
            ]
        ]);
    }

    /**
     * Get revenue statistics
     */
    public function revenueStats(Request $request)
    {
        $period = $request->get('period', 'month'); // day, week, month, year
        
        $query = Booking::where('status', 'paid');
        
        switch ($period) {
            case 'day':
                $query->whereDate('created_at', today());
                break;
            case 'week':
                $query->where('created_at', '>=', now()->subWeek());
                break;
            case 'month':
                $query->where('created_at', '>=', now()->subMonth());
                break;
            case 'year':
                $query->where('created_at', '>=', now()->subYear());
                break;
        }
        
        $totalRevenue = $query->sum('total_price');
        $bookingsCount = $query->count();
        $avgBookingValue = $bookingsCount > 0 ? $totalRevenue / $bookingsCount : 0;

        return response()->json([
            'success' => true,
            'data' => [
                'period' => $period,
                'total_revenue' => $totalRevenue,
                'bookings_count' => $bookingsCount,
                'average_booking_value' => round($avgBookingValue, 2)
            ]
        ]);
    }

    /**
     * Get booking trends (daily/monthly)
     */
    public function bookingTrends(Request $request)
    {
        $period = $request->get('period', 'month'); // day, month
        $limit = $request->get('limit', 30);
        
        if ($period === 'day') {
            // Last N days
            $trends = DB::table('bookings')
                ->select(
                    DB::raw('DATE(created_at) as date'),
                    DB::raw('COUNT(*) as bookings_count'),
                    DB::raw('SUM(CASE WHEN status = "paid" THEN total_price ELSE 0 END) as revenue')
                )
                ->where('created_at', '>=', now()->subDays($limit))
                ->groupBy('date')
                ->orderBy('date', 'asc')
                ->get();
        } else {
            // Last N months
            $trends = DB::table('bookings')
                ->select(
                    DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'),
                    DB::raw('COUNT(*) as bookings_count'),
                    DB::raw('SUM(CASE WHEN status = "paid" THEN total_price ELSE 0 END) as revenue')
                )
                ->where('created_at', '>=', now()->subMonths($limit))
                ->groupBy('month')
                ->orderBy('month', 'asc')
                ->get();
        }

        return response()->json([
            'success' => true,
            'data' => $trends
        ]);
    }

    /**
     * Get user engagement metrics
     */
    public function userEngagement()
    {
        $totalUsers = User::count();
        $activeUsers = User::has('bookings')->count();
        $avgBookingsPerUser = $totalUsers > 0 ? Booking::count() / $totalUsers : 0;
        
        // Users by registration date (last 6 months)
        $newUsers = User::where('created_at', '>=', now()->subMonths(6))
            ->selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, COUNT(*) as count')
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'total_users' => $totalUsers,
                'active_users' => $activeUsers,
                'average_bookings_per_user' => round($avgBookingsPerUser, 2),
                'new_users_by_month' => $newUsers
            ]
        ]);
    }

    /**
     * Get dashboard overview
     */
    public function dashboardOverview()
    {
        $totalBookings = Booking::count();
        $pendingBookings = Booking::where('status', 'pending')->count();
        $paidBookings = Booking::where('status', 'paid')->count();
        $totalRevenue = Booking::where('status', 'paid')->sum('total_price');
        
        $todayBookings = Booking::whereDate('created_at', today())->count();
        $todayRevenue = Booking::whereDate('created_at', today())
            ->where('status', 'paid')
            ->sum('total_price');
        
        $popularTour = Tour::withCount('bookings')
            ->orderBy('bookings_count', 'desc')
            ->first();

        return response()->json([
            'success' => true,
            'data' => [
                'total_bookings' => $totalBookings,
                'pending_bookings' => $pendingBookings,
                'paid_bookings' => $paidBookings,
                'total_revenue' => $totalRevenue,
                'today_bookings' => $todayBookings,
                'today_revenue' => $todayRevenue,
                'most_popular_tour' => $popularTour ? [
                    'id' => $popularTour->id,
                    'name' => $popularTour->name,
                    'bookings' => $popularTour->bookings_count
                ] : null
            ]
        ]);
    }
}
