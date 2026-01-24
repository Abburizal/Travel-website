<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tour;

class TourController extends Controller
{
    public function index()
    {
        $query = Tour::with('category');

        // Search by name or destination
        if (request()->has('search')) {
            $search = request('search');
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('destination', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filter by category
        if (request()->has('category_id') && request('category_id') != '') {
            $query->where('category_id', request('category_id'));
        }

        // Filter by price range
        if (request()->has('min_price')) {
            $query->where('price', '>=', request('min_price'));
        }
        if (request()->has('max_price')) {
            $query->where('price', '<=', request('max_price'));
        }

        // Filter by duration
        if (request()->has('duration')) {
            $query->where('duration', request('duration'));
        }

        // Filter by availability (only tours with available seats)
        if (request()->has('available') && request('available') == 'true') {
            $query->whereColumn('booked_participants', '<', 'max_participants');
        }

        // Sort options
        $sortBy = request('sort_by', 'created_at');
        $sortOrder = request('sort_order', 'desc');
        
        switch($sortBy) {
            case 'price_low':
                $query->orderBy('price', 'asc');
                break;
            case 'price_high':
                $query->orderBy('price', 'desc');
                break;
            case 'popularity':
                $query->orderBy('booked_participants', 'desc');
                break;
            case 'date':
                $query->orderBy('start_date', 'asc');
                break;
            default:
                $query->orderBy($sortBy, $sortOrder);
        }

        $tours = $query->get()->map(function($tour) {
            // Add full image URL
            if ($tour->image) {
                $tour->image_url = asset('storage/' . $tour->image);
            } else {
                $tour->image_url = null;
            }
            // Add rating data
            $tour->average_rating = round($tour->average_rating, 1);
            $tour->review_count = $tour->review_count;
            return $tour;
        });
        
        return response()->json($tours);
    }

    public function show($id)
    {
        $tour = Tour::with('category')->findOrFail($id);
        
        // Add full image URL
        if ($tour->image) {
            $tour->image_url = asset('storage/' . $tour->image);
        } else {
            $tour->image_url = null;
        }
        
        // Add rating data
        $tour->average_rating = round($tour->average_rating, 1);
        $tour->review_count = $tour->review_count;
        
        return response()->json($tour);
    }
}