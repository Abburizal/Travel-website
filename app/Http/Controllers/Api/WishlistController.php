<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WishlistController extends Controller
{
    /**
     * Get user's wishlist
     */
    public function index()
    {
        $user = Auth::user();
        
        // Debug logging
        \Log::info('📋 Wishlist Index Called', [
            'user_id' => $user->id,
            'user_email' => $user->email,
        ]);
        
        $wishlists = $user->wishlists()
            ->with('tour.category')
            ->latest()
            ->get()
            ->map(function($wishlist) {
                // Add image_url to tour (same logic as TourController)
                if ($wishlist->tour) {
                    // Add full image URL (old field)
                    if ($wishlist->tour->image) {
                        $wishlist->tour->image_url = asset('storage/' . $wishlist->tour->image);
                    } else {
                        $wishlist->tour->image_url = null;
                    }
                    
                    // Add media library gallery images
                    $wishlist->tour->gallery_images = $wishlist->tour->getMedia('images')->map(function($media) {
                        return [
                            'id' => $media->id,
                            'url' => $media->getUrl(),
                            'name' => $media->file_name,
                        ];
                    });
                    
                    // Use first gallery image as thumbnail if no old image
                    if (!$wishlist->tour->image_url && $wishlist->tour->gallery_images->count() > 0) {
                        $wishlist->tour->image_url = $wishlist->tour->gallery_images->first()['url'];
                    }
                    
                    // Add rating data
                    $wishlist->tour->average_rating = round($wishlist->tour->average_rating, 1);
                    $wishlist->tour->review_count = $wishlist->tour->review_count;
                }
                
                return $wishlist;
            });
        
        \Log::info('✅ Wishlist Retrieved', [
            'count' => $wishlists->count(),
            'wishlist_ids' => $wishlists->pluck('id')->toArray(),
        ]);

        return response()->json([
            'success' => true,
            'data' => $wishlists
        ]);
    }

    /**
     * Add tour to wishlist
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        
        // Debug logging
        \Log::info('💖 Adding to Wishlist', [
            'user_id' => $user->id,
            'user_email' => $user->email,
            'tour_id' => $request->tour_id,
        ]);
        
        $request->validate([
            'tour_id' => 'required|exists:tours,id'
        ]);

        // Check if already in wishlist
        $exists = $user->hasInWishlist($request->tour_id);
        
        if ($exists) {
            \Log::warning('⚠️ Tour already in wishlist', [
                'user_id' => $user->id,
                'tour_id' => $request->tour_id,
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Tour already in wishlist'
            ], 400);
        }

        $wishlist = Wishlist::create([
            'user_id' => $user->id,
            'tour_id' => $request->tour_id
        ]);

        $wishlist->load('tour.category');
        
        // Add image_url to tour (same logic as TourController)
        if ($wishlist->tour) {
            // Add full image URL (old field)
            if ($wishlist->tour->image) {
                $wishlist->tour->image_url = asset('storage/' . $wishlist->tour->image);
            } else {
                $wishlist->tour->image_url = null;
            }
            
            // Add media library gallery images
            $wishlist->tour->gallery_images = $wishlist->tour->getMedia('images')->map(function($media) {
                return [
                    'id' => $media->id,
                    'url' => $media->getUrl(),
                    'name' => $media->file_name,
                ];
            });
            
            // Use first gallery image as thumbnail if no old image
            if (!$wishlist->tour->image_url && $wishlist->tour->gallery_images->count() > 0) {
                $wishlist->tour->image_url = $wishlist->tour->gallery_images->first()['url'];
            }
            
            // Add rating data
            $wishlist->tour->average_rating = round($wishlist->tour->average_rating, 1);
            $wishlist->tour->review_count = $wishlist->tour->review_count;
        }
        
        \Log::info('✅ Wishlist Created', [
            'wishlist_id' => $wishlist->id,
            'user_id' => $user->id,
            'tour_id' => $request->tour_id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Tour added to wishlist',
            'data' => $wishlist
        ], 201);
    }

    /**
     * Remove tour from wishlist
     */
    public function destroy($tourId)
    {
        $wishlist = Auth::user()->wishlists()
            ->where('tour_id', $tourId)
            ->first();

        if (!$wishlist) {
            return response()->json([
                'success' => false,
                'message' => 'Tour not found in wishlist'
            ], 404);
        }

        $wishlist->delete();

        return response()->json([
            'success' => true,
            'message' => 'Tour removed from wishlist'
        ]);
    }

    /**
     * Check if tour is in wishlist
     */
    public function check($tourId)
    {
        $inWishlist = Auth::user()->hasInWishlist($tourId);

        return response()->json([
            'success' => true,
            'in_wishlist' => $inWishlist
        ]);
    }
}
