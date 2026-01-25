<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tour;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class ItineraryController extends Controller
{
    public function download($id)
    {
        $tour = Tour::with('category')->findOrFail($id);
        
        // Check if custom itinerary PDF exists
        $customItinerary = $tour->getFirstMedia('itinerary');
        
        if ($customItinerary) {
            // Download custom PDF uploaded by admin
            return response()->download(
                $customItinerary->getPath(),
                $customItinerary->file_name,
                [
                    'Content-Type' => 'application/pdf',
                ]
            );
        }
        
        // If no custom PDF, generate default itinerary
        return $this->generateDefaultItinerary($tour);
    }
    
    private function generateDefaultItinerary($tour)
    {
        // Get gallery images
        $galleryImages = $tour->getMedia('images')->take(3)->map(function($media) {
            return $media->getUrl();
        });
        
        // Calculate available seats
        $availableSeats = $tour->max_participants - $tour->booked_participants;
        
        // Prepare data for PDF
        $data = [
            'tour' => $tour,
            'galleryImages' => $galleryImages,
            'availableSeats' => $availableSeats,
            'generatedDate' => now()->format('F d, Y'),
        ];
        
        // Generate PDF
        $pdf = Pdf::loadView('pdf.itinerary', $data);
        $pdf->setPaper('a4', 'portrait');
        
        // Download with tour name
        $filename = str_replace(' ', '-', strtolower($tour->name)) . '-itinerary.pdf';
        
        return $pdf->download($filename);
    }
}
