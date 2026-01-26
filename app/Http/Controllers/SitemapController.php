<?php

namespace App\Http\Controllers;

use App\Models\Tour;
use App\Models\Category;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index()
    {
        $tours = Tour::where('available_from', '<=', now())
            ->where(function ($query) {
                $query->whereNull('available_until')
                    ->orWhere('available_until', '>=', now());
            })
            ->orderBy('updated_at', 'desc')
            ->get();

        $categories = Category::orderBy('updated_at', 'desc')->get();

        $sitemap = '<?xml version="1.0" encoding="UTF-8"?>';
        $sitemap .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

        // Homepage
        $sitemap .= $this->createUrlEntry(url('/'), '1.0', 'daily', now());

        // Static pages
        $staticPages = [
            ['url' => '/tours', 'priority' => '0.9', 'changefreq' => 'daily'],
            ['url' => '/faq', 'priority' => '0.7', 'changefreq' => 'monthly'],
            ['url' => '/contact', 'priority' => '0.7', 'changefreq' => 'monthly'],
            ['url' => '/terms', 'priority' => '0.5', 'changefreq' => 'yearly'],
            ['url' => '/privacy', 'priority' => '0.5', 'changefreq' => 'yearly'],
        ];

        foreach ($staticPages as $page) {
            $sitemap .= $this->createUrlEntry(
                url($page['url']),
                $page['priority'],
                $page['changefreq'],
                now()
            );
        }

        // Categories
        foreach ($categories as $category) {
            $sitemap .= $this->createUrlEntry(
                url('/tours?category_id=' . $category->id),
                '0.8',
                'weekly',
                $category->updated_at
            );
        }

        // Tours
        foreach ($tours as $tour) {
            $sitemap .= $this->createUrlEntry(
                url('/tours/' . $tour->id),
                '0.8',
                'weekly',
                $tour->updated_at
            );
        }

        $sitemap .= '</urlset>';

        return response($sitemap, 200)
            ->header('Content-Type', 'application/xml');
    }

    private function createUrlEntry($loc, $priority, $changefreq, $lastmod)
    {
        $entry = '<url>';
        $entry .= '<loc>' . htmlspecialchars($loc) . '</loc>';
        $entry .= '<lastmod>' . $lastmod->format('Y-m-d') . '</lastmod>';
        $entry .= '<changefreq>' . $changefreq . '</changefreq>';
        $entry .= '<priority>' . $priority . '</priority>';
        $entry .= '</url>';
        
        return $entry;
    }
}
