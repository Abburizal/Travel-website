<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Spatie\Activitylog\Models\Activity;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    /**
     * Get all activity logs with filters
     * 
     * GET /api/admin/activity-logs
     * Query params: ?page=1&per_page=20&action=created&model=Tour&user_id=1&from=2024-01-01&to=2024-12-31
     */
    public function index(Request $request)
    {
        $query = Activity::with(['causer', 'subject'])
            ->latest('created_at');

        // Filter by action/event
        if ($request->has('action') && $request->action !== 'all') {
            $query->where('description', $request->action);
        }

        // Filter by model type
        if ($request->has('model') && $request->model !== 'all') {
            $query->where('subject_type', 'like', '%' . $request->model . '%');
        }

        // Filter by user (causer)
        if ($request->has('user_id')) {
            $query->where('causer_id', $request->user_id);
        }

        // Filter by date range
        if ($request->has('from')) {
            $query->whereDate('created_at', '>=', $request->from);
        }
        if ($request->has('to')) {
            $query->whereDate('created_at', '<=', $request->to);
        }

        // Pagination
        $perPage = $request->get('per_page', 20);
        $activities = $query->paginate($perPage);

        // Format response
        $activities->getCollection()->transform(function ($activity) {
            return [
                'id' => $activity->id,
                'log_name' => $activity->log_name,
                'description' => $activity->description,
                'subject_type' => class_basename($activity->subject_type),
                'subject_id' => $activity->subject_id,
                'subject_name' => $this->getSubjectName($activity),
                'causer_name' => $activity->causer?->name ?? 'System',
                'causer_email' => $activity->causer?->email ?? null,
                'properties' => $activity->properties,
                'created_at' => $activity->created_at->format('Y-m-d H:i:s'),
                'created_at_human' => $activity->created_at->diffForHumans(),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $activities->items(),
            'pagination' => [
                'current_page' => $activities->currentPage(),
                'last_page' => $activities->lastPage(),
                'per_page' => $activities->perPage(),
                'total' => $activities->total(),
                'from' => $activities->firstItem(),
                'to' => $activities->lastItem(),
            ]
        ]);
    }

    /**
     * Get single activity log detail
     * 
     * GET /api/admin/activity-logs/{id}
     */
    public function show($id)
    {
        $activity = Activity::with(['causer', 'subject'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $activity->id,
                'log_name' => $activity->log_name,
                'description' => $activity->description,
                'subject_type' => $activity->subject_type,
                'subject_id' => $activity->subject_id,
                'subject_name' => $this->getSubjectName($activity),
                'causer' => $activity->causer ? [
                    'id' => $activity->causer->id,
                    'name' => $activity->causer->name,
                    'email' => $activity->causer->email,
                ] : null,
                'properties' => $activity->properties,
                'created_at' => $activity->created_at->format('Y-m-d H:i:s'),
                'created_at_human' => $activity->created_at->diffForHumans(),
            ]
        ]);
    }

    /**
     * Get activity statistics
     * 
     * GET /api/admin/activity-logs/stats
     */
    public function stats()
    {
        $stats = [
            'total_activities' => Activity::count(),
            'today' => Activity::whereDate('created_at', today())->count(),
            'this_week' => Activity::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count(),
            'this_month' => Activity::whereMonth('created_at', now()->month)->count(),
            'by_action' => Activity::selectRaw('description, count(*) as count')
                ->groupBy('description')
                ->get()
                ->pluck('count', 'description'),
            'by_model' => Activity::selectRaw('subject_type, count(*) as count')
                ->groupBy('subject_type')
                ->get()
                ->mapWithKeys(function ($item) {
                    return [class_basename($item->subject_type) => $item->count];
                }),
            'top_users' => Activity::with('causer')
                ->selectRaw('causer_id, count(*) as count')
                ->whereNotNull('causer_id')
                ->groupBy('causer_id')
                ->orderByDesc('count')
                ->limit(5)
                ->get()
                ->map(function ($item) {
                    return [
                        'name' => $item->causer->name ?? 'Unknown',
                        'email' => $item->causer->email ?? null,
                        'count' => $item->count,
                    ];
                }),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    /**
     * Helper to get subject name
     */
    private function getSubjectName($activity)
    {
        if (!$activity->subject) {
            return 'Deleted';
        }

        // Try to get name attribute
        if (isset($activity->subject->name)) {
            return $activity->subject->name;
        }

        // Fallback to ID
        return class_basename($activity->subject_type) . ' #' . $activity->subject_id;
    }
}
