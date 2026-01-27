<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            // Original Categories
            ['name' => 'Adventure', 'description' => 'Thrilling outdoor adventures and expeditions'],
            ['name' => 'Beach', 'description' => 'Relaxing beach and tropical island tours'],
            ['name' => 'Cultural', 'description' => 'Cultural heritage and historical tours'],
            ['name' => 'Mountain', 'description' => 'Mountain climbing and hiking tours'],
            ['name' => 'City', 'description' => 'Urban city tours and sightseeing'],
            
            // Country-Based Categories
            ['name' => 'Thailand', 'description' => 'Explore the Land of Smiles - temples, beaches, and culture'],
            ['name' => 'Malaysia', 'description' => 'Discover Malaysia - multicultural cities and natural wonders'],
            ['name' => 'Singapore', 'description' => 'Experience Singapore - modern city-state and attractions'],
            ['name' => 'China', 'description' => 'Explore ancient China - history, culture, and modern marvels'],
            ['name' => 'Japan', 'description' => 'Discover Japan - tradition meets innovation'],
            ['name' => 'Korea', 'description' => 'Experience Korea - K-culture, history, and modern Seoul'],
            ['name' => 'Vietnam', 'description' => 'Explore Vietnam - rich history and stunning landscapes'],
            ['name' => 'Turki', 'description' => 'Discover Turkey - where East meets West'],
            ['name' => 'Hongkong', 'description' => 'Experience Hong Kong - dynamic city of contrasts'],
            
            // Special Categories
            ['name' => 'Multi-Country', 'description' => 'Multi-destination tours across multiple countries'],
            ['name' => 'Private Tour', 'description' => 'Exclusive private tours customized for you'],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['name' => $category['name']],
                ['description' => $category['description']]
            );
        }
    }
}
