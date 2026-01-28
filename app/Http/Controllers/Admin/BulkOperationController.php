<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tour;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class BulkOperationController extends Controller
{
    /**
     * Bulk delete tours (soft delete)
     * 
     * POST /api/admin/tours/bulk-delete
     * Body: { "tour_ids": [1, 2, 3] }
     */
    public function bulkDelete(Request $request)
    {
        $request->validate([
            'tour_ids' => 'required|array|min:1',
            'tour_ids.*' => 'required|integer|exists:tours,id'
        ]);

        try {
            $tourIds = $request->tour_ids;
            
            // Get tour names for logging
            $tours = Tour::whereIn('id', $tourIds)->get(['id', 'name']);
            
            // Soft delete tours
            $deletedCount = Tour::whereIn('id', $tourIds)->delete();
            
            // Log activity
            Log::info('Bulk delete tours', [
                'user_id' => auth()->id(),
                'user_email' => auth()->user()->email,
                'tour_ids' => $tourIds,
                'tour_names' => $tours->pluck('name')->toArray(),
                'deleted_count' => $deletedCount,
                'timestamp' => now(),
            ]);
            
            return response()->json([
                'success' => true,
                'message' => "Successfully deleted {$deletedCount} tours",
                'deleted_count' => $deletedCount,
                'tour_ids' => $tourIds
            ]);
            
        } catch (\Exception $e) {
            Log::error('Bulk delete failed', [
                'error' => $e->getMessage(),
                'user_id' => auth()->id(),
                'tour_ids' => $request->tour_ids ?? []
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete tours: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Bulk update tours
     * 
     * POST /api/admin/tours/bulk-update
     * Body: { 
     *   "tour_ids": [1, 2, 3],
     *   "updates": {
     *     "category_id": 5
     *   }
     * }
     */
    public function bulkUpdate(Request $request)
    {
        $request->validate([
            'tour_ids' => 'required|array|min:1',
            'tour_ids.*' => 'required|integer|exists:tours,id',
            'updates' => 'required|array',
        ]);

        try {
            $tourIds = $request->tour_ids;
            $updates = $request->updates;
            
            // Validate allowed fields
            $allowedFields = ['category_id', 'max_participants', 'booked_participants'];
            $filteredUpdates = array_intersect_key($updates, array_flip($allowedFields));
            
            if (empty($filteredUpdates)) {
                return response()->json([
                    'success' => false,
                    'message' => 'No valid fields to update. Allowed fields: ' . implode(', ', $allowedFields)
                ], 400);
            }
            
            // Get tour names for logging
            $tours = Tour::whereIn('id', $tourIds)->get(['id', 'name']);
            
            // Perform bulk update
            $updatedCount = Tour::whereIn('id', $tourIds)->update($filteredUpdates);
            
            // Log activity
            Log::info('Bulk update tours', [
                'user_id' => auth()->id(),
                'user_email' => auth()->user()->email,
                'tour_ids' => $tourIds,
                'tour_names' => $tours->pluck('name')->toArray(),
                'updates' => $filteredUpdates,
                'updated_count' => $updatedCount,
                'timestamp' => now(),
            ]);
            
            return response()->json([
                'success' => true,
                'message' => "Successfully updated {$updatedCount} tours",
                'updated_count' => $updatedCount,
                'tour_ids' => $tourIds,
                'updates' => $filteredUpdates
            ]);
            
        } catch (\Exception $e) {
            Log::error('Bulk update failed', [
                'error' => $e->getMessage(),
                'user_id' => auth()->id(),
                'tour_ids' => $request->tour_ids ?? [],
                'updates' => $request->updates ?? []
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to update tours: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Restore soft-deleted tours
     * 
     * POST /api/admin/tours/bulk-restore
     * Body: { "tour_ids": [1, 2, 3] }
     */
    public function bulkRestore(Request $request)
    {
        $request->validate([
            'tour_ids' => 'required|array|min:1',
            'tour_ids.*' => 'required|integer'
        ]);

        try {
            $tourIds = $request->tour_ids;
            
            // Restore soft-deleted tours
            $restoredCount = Tour::onlyTrashed()
                ->whereIn('id', $tourIds)
                ->restore();
            
            // Get restored tour names
            $tours = Tour::whereIn('id', $tourIds)->get(['id', 'name']);
            
            // Log activity
            Log::info('Bulk restore tours', [
                'user_id' => auth()->id(),
                'user_email' => auth()->user()->email,
                'tour_ids' => $tourIds,
                'tour_names' => $tours->pluck('name')->toArray(),
                'restored_count' => $restoredCount,
                'timestamp' => now(),
            ]);
            
            return response()->json([
                'success' => true,
                'message' => "Successfully restored {$restoredCount} tours",
                'restored_count' => $restoredCount,
                'tour_ids' => $tourIds
            ]);
            
        } catch (\Exception $e) {
            Log::error('Bulk restore failed', [
                'error' => $e->getMessage(),
                'user_id' => auth()->id(),
                'tour_ids' => $request->tour_ids ?? []
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to restore tours: ' . $e->getMessage()
            ], 500);
        }
    }
}
