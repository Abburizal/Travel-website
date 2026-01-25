<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;

class CountryCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Thailand',
                'description' => 'Tours to Thailand - Land of Smiles. Experience Bangkok, Phuket, Chiang Mai, and beautiful beaches.',
            ],
            [
                'name' => 'Malaysia',
                'description' => 'Tours to Malaysia - Truly Asia. Explore Kuala Lumpur, Penang, Langkawi, and diverse cultures.',
            ],
            [
                'name' => 'Singapore',
                'description' => 'Tours to Singapore - Garden City. Modern metropolis with world-class attractions and cuisine.',
            ],
            [
                'name' => 'Turki',
                'description' => 'Tours to Turkey (Türkiye) - Where East Meets West. Istanbul, Cappadocia, and ancient wonders.',
            ],
            [
                'name' => 'Vietnam',
                'description' => 'Tours to Vietnam - Timeless Charm. Hanoi, Halong Bay, Hoi An, and rich history.',
            ],
            [
                'name' => 'Korea',
                'description' => 'Tours to South Korea - Dynamic Culture. Seoul, Jeju Island, K-pop, and traditional temples.',
            ],
            [
                'name' => 'Japan',
                'description' => 'Tours to Japan - Land of Rising Sun. Tokyo, Kyoto, Mount Fuji, and cherry blossoms.',
            ],
            [
                'name' => 'Hongkong',
                'description' => 'Tours to Hong Kong - Pearl of the Orient. Skyline, dim sum, Victoria Peak, and vibrant city life.',
            ],
            [
                'name' => 'China',
                'description' => 'Tours to China - Ancient Civilization. Great Wall, Beijing, Shanghai, and cultural heritage.',
            ],
        ];

        foreach ($categories as $categoryData) {
            Category::firstOrCreate(
                ['name' => $categoryData['name']],
                ['description' => $categoryData['description']]
            );
        }

        $this->command->info('Country categories seeded successfully!');
        $this->command->info('Total categories: ' . Category::count());
    }
}
