<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = App\Models\User::first();
if (!$user) {
    echo "No user found\n";
    exit;
}

// Simulate API logic
$wishlists = $user->wishlists()->with('tour.category')->get()->map(function($wishlist) {
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
    }
    
    return $wishlist;
});

echo "Wishlist count: " . $wishlists->count() . "\n";

if ($wishlists->count() > 0) {
    $first = $wishlists->first();
    echo "\nFirst wishlist:\n";
    echo "- ID: " . $first->id . "\n";
    echo "- Tour: " . $first->tour->name . "\n";
    echo "- Tour image field: " . ($first->tour->image ?? 'NULL') . "\n";
    echo "- Tour image_url: " . ($first->tour->image_url ?? 'NULL') . "\n";
    echo "- Gallery images: " . $first->tour->gallery_images->count() . "\n";
    
    // Show JSON structure
    echo "\nJSON structure (tour only):\n";
    echo json_encode([
        'id' => $first->tour->id,
        'name' => $first->tour->name,
        'image' => $first->tour->image,
        'image_url' => $first->tour->image_url,
        'gallery_count' => $first->tour->gallery_images->count()
    ], JSON_PRETTY_PRINT);
}
