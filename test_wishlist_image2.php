<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = App\Models\User::where('email', 'aburizalchilliyat@gmail.com')->first();
if (!$user) {
    echo "User not found\n";
    exit;
}

echo "Testing user: {$user->email}\n";
echo "Wishlist count: " . $user->wishlists()->count() . "\n\n";

// Simulate exact API logic from WishlistController
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
        }
        
        return $wishlist;
    });

echo "Retrieved wishlists: " . $wishlists->count() . "\n\n";

foreach ($wishlists as $idx => $w) {
    echo "Wishlist #" . ($idx + 1) . ":\n";
    echo "  - Tour: " . $w->tour->name . "\n";
    echo "  - tour.image: " . ($w->tour->image ?? 'NULL') . "\n";
    echo "  - tour.image_url: " . ($w->tour->image_url ?? 'NULL') . "\n";
    echo "  - gallery_images count: " . $w->tour->gallery_images->count() . "\n";
    echo "\n";
}
