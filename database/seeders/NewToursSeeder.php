<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tour;
use App\Models\Category;

class NewToursSeeder extends Seeder
{
    public function run(): void
    {
        $tours = [
            // Thailand Tours
            [
                'category' => 'Thailand',
                'name' => 'BKK 19 BANGKOK PATTAYA KANCHANABURI',
                'duration' => '5 Days 4 Nights',
                'price' => 4025000,
                'description' => 'Explore the best of Bangkok, Pattaya, and the historic Kanchanaburi with visits to temples, floating markets, and the famous Bridge over River Kwai.',
                'highlights' => json_encode([
                    'Grand Palace & Wat Phra Kaew',
                    'Pattaya Beach & Coral Island',
                    'Bridge over River Kwai',
                    'Floating Market',
                    'Thai Cultural Shows'
                ]),
                'included' => json_encode([
                    'Return flights',
                    '4 nights accommodation',
                    'Daily breakfast',
                    'All entrance fees',
                    'English speaking guide',
                    'Airport transfers'
                ]),
                'excluded' => json_encode([
                    'Personal expenses',
                    'Travel insurance',
                    'Lunch & dinner (unless specified)',
                    'Tips for guide and driver'
                ]),
                'departure_location' => 'Jakarta',
                'max_participants' => 30,
                'available_from' => '2026-03-01',
                'available_until' => '2026-12-31',
            ],
            [
                'category' => 'Thailand',
                'name' => 'BKK 20 BANGKOK PATTAYA DREAM WORLD',
                'duration' => '5 Days 4 Nights',
                'price' => 3920000,
                'description' => 'Bangkok and Pattaya adventure with Dream World theme park - perfect for families! Experience thrilling rides and Thai culture.',
                'highlights' => json_encode([
                    'Dream World Theme Park',
                    'Bangkok City Tour',
                    'Pattaya Beach Activities',
                    'Shopping at Pratunam',
                    'Thai Massage Experience'
                ]),
                'included' => json_encode([
                    'Return flights',
                    '4 nights hotel accommodation',
                    'Daily breakfast',
                    'Dream World entrance ticket',
                    'All transfers',
                    'Tour guide'
                ]),
                'excluded' => json_encode([
                    'Visa fees (if applicable)',
                    'Personal expenses',
                    'Meals not mentioned',
                    'Optional activities'
                ]),
                'departure_location' => 'Jakarta',
                'max_participants' => 25,
                'available_from' => '2026-03-01',
                'available_until' => '2026-12-31',
            ],
            [
                'category' => 'Thailand',
                'name' => 'CHIANG MAI – CHIANG RAI 3D2N CODE CNX1',
                'duration' => '3 Days 2 Nights',
                'price' => 2350000,
                'description' => 'Experience the cultural heart of Northern Thailand with visits to stunning temples, hill tribes, and natural wonders.',
                'highlights' => json_encode([
                    'White Temple (Wat Rong Khun)',
                    'Blue Temple (Wat Rong Suea Ten)',
                    'Golden Triangle',
                    'Doi Suthep Temple',
                    'Night Bazaar Shopping'
                ]),
                'included' => json_encode([
                    'Return flights',
                    '2 nights accommodation',
                    'Daily breakfast',
                    'All entrance fees',
                    'Private tour guide',
                    'Hotel transfers'
                ]),
                'excluded' => json_encode([
                    'International flights',
                    'Lunch and dinner',
                    'Personal expenses',
                    'Travel insurance'
                ]),
                'departure_location' => 'Jakarta',
                'max_participants' => 20,
                'available_from' => '2026-03-01',
                'available_until' => '2026-12-31',
            ],
            [
                'category' => 'Thailand',
                'name' => 'CHIANG MAI – CHIANG RAI 4D3N CODE CNX2',
                'duration' => '4 Days 3 Nights',
                'price' => 3300000,
                'description' => 'Extended Northern Thailand exploration with more time for temples, elephant sanctuary, and cultural experiences.',
                'highlights' => json_encode([
                    'Elephant Sanctuary Visit',
                    'White Temple & Blue Temple',
                    'Mae Kajan Hot Spring',
                    'Golden Triangle & Opium Museum',
                    'Doi Inthanon National Park',
                    'Hmong Hill Tribe Village'
                ]),
                'included' => json_encode([
                    'Return flights',
                    '3 nights hotel',
                    'Daily breakfast',
                    'Elephant sanctuary fee',
                    'All entrance tickets',
                    'Tour guide & transfers'
                ]),
                'excluded' => json_encode([
                    'Visa fees',
                    'Lunch & dinner',
                    'Tips and gratuities',
                    'Personal shopping'
                ]),
                'departure_location' => 'Jakarta',
                'max_participants' => 20,
                'available_from' => '2026-03-01',
                'available_until' => '2026-12-31',
            ],
            [
                'category' => 'Thailand',
                'name' => 'CHIANG MAI – CHIANG RAI 4D3N CODE CNX3',
                'duration' => '4 Days 3 Nights',
                'price' => 3150000,
                'description' => 'Budget-friendly Northern Thailand package with all major attractions included. Perfect for first-time visitors!',
                'highlights' => json_encode([
                    'White Temple',
                    'Chiang Mai Old City',
                    'Doi Suthep Temple',
                    'Night Market Experience',
                    'Local Craft Villages'
                ]),
                'included' => json_encode([
                    'Return flights',
                    '3 nights accommodation',
                    'Daily breakfast',
                    'All entrance fees',
                    'Transportation',
                    'English guide'
                ]),
                'excluded' => json_encode([
                    'Meals not specified',
                    'Personal expenses',
                    'Optional activities',
                    'Travel insurance'
                ]),
                'departure_location' => 'Jakarta',
                'max_participants' => 25,
                'available_from' => '2026-03-01',
                'available_until' => '2026-12-31',
            ],
            [
                'category' => 'Thailand',
                'name' => 'CHIANG MAI – CHIANG RAI 5D4N CODE CNX4',
                'duration' => '5 Days 4 Nights',
                'price' => 4200000,
                'description' => 'Comprehensive Northern Thailand tour with leisurely pace. Experience culture, nature, and adventure at its best.',
                'highlights' => json_encode([
                    'Ethical Elephant Experience',
                    'White & Blue Temples',
                    'Golden Triangle Tour',
                    'Doi Inthanon Peak',
                    'Thai Cooking Class',
                    'Traditional Lanna Dinner'
                ]),
                'included' => json_encode([
                    'Return flights',
                    '4 nights hotel accommodation',
                    'Daily breakfast & 2 dinners',
                    'Cooking class',
                    'All entrance fees',
                    'Private guide & driver'
                ]),
                'excluded' => json_encode([
                    'International flights to Thailand',
                    'Lunches',
                    'Personal expenses',
                    'Tips for guide'
                ]),
                'departure_location' => 'Jakarta',
                'max_participants' => 20,
                'available_from' => '2026-03-01',
                'available_until' => '2026-12-31',
            ],
            [
                'category' => 'Thailand',
                'name' => 'PHUKET 3D2N CODE HKT1',
                'duration' => '3 Days 2 Nights',
                'price' => 2800000,
                'description' => 'Quick beach getaway to the pearl of Andaman Sea. Perfect for weekend escape with beautiful beaches and vibrant nightlife.',
                'highlights' => json_encode([
                    'Patong Beach',
                    'Phi Phi Islands Day Trip',
                    'Big Buddha',
                    'Old Phuket Town',
                    'Beach Club Sunset'
                ]),
                'included' => json_encode([
                    'Return flights',
                    '2 nights beach resort',
                    'Daily breakfast',
                    'Island hopping tour',
                    'Airport transfers',
                    'Tour guide'
                ]),
                'excluded' => json_encode([
                    'Lunch and dinner',
                    'Water activities fees',
                    'Personal expenses',
                    'Travel insurance'
                ]),
                'departure_location' => 'Jakarta',
                'max_participants' => 30,
                'available_from' => '2026-04-01',
                'available_until' => '2026-12-31',
            ],

            // Singapore Tours
            [
                'category' => 'Singapore',
                'name' => '3 HARI SINGAPORE SENTOSA TOUR A',
                'duration' => '3 Days',
                'price' => 3805000,
                'description' => 'Explore the Garden City with visits to iconic attractions including Sentosa Island, Gardens by the Bay, and Marina Bay Sands.',
                'highlights' => json_encode([
                    'Gardens by the Bay',
                    'Sentosa Island',
                    'Universal Studios Singapore',
                    'Merlion Park',
                    'Chinatown & Little India'
                ]),
                'included' => json_encode([
                    'Return flights',
                    '2 nights hotel accommodation',
                    'Daily breakfast',
                    'Sentosa entry ticket',
                    'City tour',
                    'Airport transfers'
                ]),
                'excluded' => json_encode([
                    'Universal Studios ticket',
                    'Lunch and dinner',
                    'Personal expenses',
                    'Optional tours'
                ]),
                'departure_location' => 'Jakarta',
                'max_participants' => 25,
                'available_from' => '2026-03-01',
                'available_until' => '2026-12-31',
            ],
            [
                'category' => 'Singapore',
                'name' => '3 HARI SINGAPORE SENTOSA TOUR B',
                'duration' => '3 Days',
                'price' => 4910000,
                'description' => 'Premium Singapore experience with Universal Studios included! Perfect family holiday package.',
                'highlights' => json_encode([
                    'Universal Studios Singapore',
                    'S.E.A Aquarium',
                    'Gardens by the Bay Cloud Forest',
                    'Marina Bay Sands SkyPark',
                    'Singapore River Cruise'
                ]),
                'included' => json_encode([
                    'Return flights',
                    '2 nights 4-star hotel',
                    'Daily breakfast',
                    'Universal Studios 1-day pass',
                    'Gardens admission',
                    'All transfers'
                ]),
                'excluded' => json_encode([
                    'Meals not specified',
                    'Personal shopping',
                    'Travel insurance',
                    'Tips'
                ]),
                'departure_location' => 'Jakarta',
                'max_participants' => 20,
                'available_from' => '2026-03-01',
                'available_until' => '2026-12-31',
            ],
            [
                'category' => 'Singapore',
                'name' => '3 HARI SINGAPORE SENTOSA TOUR C',
                'duration' => '3 Days',
                'price' => 5585000,
                'description' => 'Luxury Singapore experience with 5-star accommodation and premium attractions. VIP treatment throughout.',
                'highlights' => json_encode([
                    'Universal Studios VIP Experience',
                    'Gardens by the Bay + OCBC Skyway',
                    'Marina Bay Sands SkyPark',
                    'Singapore Flyer',
                    'Michelin Restaurant Dinner',
                    'Jewel Changi Experience'
                ]),
                'included' => json_encode([
                    'Return flights (premium economy)',
                    '2 nights 5-star hotel',
                    'Daily breakfast & 1 dinner',
                    'USS VIP pass',
                    'All premium attractions',
                    'Private transfers'
                ]),
                'excluded' => json_encode([
                    'Lunches',
                    'Personal expenses',
                    'Additional meals',
                    'Travel insurance'
                ]),
                'departure_location' => 'Jakarta',
                'max_participants' => 15,
                'available_from' => '2026-03-01',
                'available_until' => '2026-12-31',
            ],
            [
                'category' => 'Singapore',
                'name' => '4 HARI SINGAPORE SENTOSA TOUR A',
                'duration' => '4 Days',
                'price' => 5525000,
                'description' => 'Extended Singapore adventure with more time to explore. Includes Sentosa attractions and city highlights.',
                'highlights' => json_encode([
                    'Universal Studios Singapore',
                    'Sentosa Beach Activities',
                    'Gardens by the Bay Day & Night',
                    'Singapore Zoo',
                    'Orchard Road Shopping',
                    'Clarke Quay Night Scene'
                ]),
                'included' => json_encode([
                    'Return flights',
                    '3 nights hotel',
                    'Daily breakfast',
                    'USS ticket',
                    'Zoo admission',
                    'All tours & transfers'
                ]),
                'excluded' => json_encode([
                    'Lunch and dinner',
                    'Shopping expenses',
                    'Additional attractions',
                    'Travel insurance'
                ]),
                'departure_location' => 'Jakarta',
                'max_participants' => 25,
                'available_from' => '2026-03-01',
                'available_until' => '2026-12-31',
            ],
            [
                'category' => 'Singapore',
                'name' => '4 HARI SINGAPORE SENTOSA TOUR B',
                'duration' => '4 Days',
                'price' => 6080000,
                'description' => 'Complete Singapore family package with all major attractions. Leisure time for shopping and dining.',
                'highlights' => json_encode([
                    'Universal Studios + SEA Aquarium',
                    'Adventure Cove Waterpark',
                    'Night Safari',
                    'Gardens by the Bay',
                    'Singapore Flyer',
                    'Free & Easy Shopping Time'
                ]),
                'included' => json_encode([
                    'Return flights',
                    '3 nights 4-star hotel',
                    'Daily breakfast',
                    'USS + SEA Aquarium combo',
                    'Night Safari ticket',
                    'City tour with guide'
                ]),
                'excluded' => json_encode([
                    'Meals except breakfast',
                    'Personal expenses',
                    'Optional tours',
                    'Tips and gratuities'
                ]),
                'departure_location' => 'Jakarta',
                'max_participants' => 20,
                'available_from' => '2026-03-01',
                'available_until' => '2026-12-31',
            ],
            [
                'category' => 'Singapore',
                'name' => '5 HARI SINGAPORE SENTOSA TOUR',
                'duration' => '5 Days',
                'price' => 6495000,
                'description' => 'Ultimate Singapore experience with full leisure time. Perfect for families who want to explore at their own pace.',
                'highlights' => json_encode([
                    'Universal Studios Full Day',
                    'Sentosa Multi-Attraction Pass',
                    'Singapore Zoo + River Safari',
                    'Gardens by the Bay Premium Tour',
                    'Jewel Changi Exploration',
                    '2 Days Free & Easy'
                ]),
                'included' => json_encode([
                    'Return flights',
                    '4 nights hotel accommodation',
                    'Daily breakfast',
                    'Multi-attraction passes',
                    'Half-day city tour',
                    'All transfers'
                ]),
                'excluded' => json_encode([
                    'Lunch and dinner',
                    'Personal shopping',
                    'Additional attractions',
                    'Travel insurance'
                ]),
                'departure_location' => 'Jakarta',
                'max_participants' => 20,
                'available_from' => '2026-03-01',
                'available_until' => '2026-12-31',
            ],

            // Japan Tours
            [
                'category' => 'Japan',
                'name' => '9D7N NEW YEAR WINTER JAPAN TOHOKU + ZAO FOX VILLAGE',
                'duration' => '9 Days 7 Nights',
                'price' => 39990000,
                'description' => 'Experience magical winter in Japan\'s Tohoku region with snow monsters, fox village, and traditional hot springs.',
                'highlights' => json_encode([
                    'Zao Fox Village',
                    'Snow Monster Ice Trees',
                    'Traditional Onsen Experience',
                    'Ginzan Onsen Town',
                    'Yamadera Temple',
                    'Sendai City Tour',
                    'Local Winter Festivals'
                ]),
                'included' => json_encode([
                    'Return international flights',
                    '7 nights accommodation (hotel + ryokan)',
                    'Daily breakfast & 5 dinners',
                    'All entrance fees',
                    'Pocket WiFi',
                    'English speaking guide',
                    'JR Pass (7 days)'
                ]),
                'excluded' => json_encode([
                    'Japan visa fee',
                    'Lunches',
                    'Personal expenses',
                    'Travel insurance',
                    'Optional activities'
                ]),
                'departure_location' => 'Jakarta',
                'max_participants' => 16,
                'available_from' => '2026-12-20',
                'available_until' => '2027-01-10',
            ],

            // Korea Tours
            [
                'category' => 'Korea',
                'name' => 'CRAZY SALE KOREA 5D 2025',
                'duration' => '5 Days',
                'price' => 9999000,
                'description' => 'Budget-friendly Korea package covering Seoul highlights and Korean culture. Perfect for first-time visitors!',
                'highlights' => json_encode([
                    'Gyeongbokgung Palace',
                    'N Seoul Tower',
                    'Myeongdong Shopping',
                    'Hanbok Experience',
                    'Korean BBQ Dinner',
                    'Lotte World or Everland'
                ]),
                'included' => json_encode([
                    'Return flights',
                    '4 nights hotel',
                    'Daily breakfast',
                    'Theme park ticket',
                    'City tour',
                    'Airport transfers'
                ]),
                'excluded' => json_encode([
                    'Korea K-ETA fee',
                    'Lunch and dinner (except mentioned)',
                    'Personal shopping',
                    'Travel insurance'
                ]),
                'departure_location' => 'Jakarta',
                'max_participants' => 30,
                'available_from' => '2026-03-01',
                'available_until' => '2026-12-31',
            ],
            [
                'category' => 'Korea',
                'name' => 'HALAL TOUR KOREA 6D',
                'duration' => '6 Days',
                'price' => 13990000,
                'description' => 'Muslim-friendly Korea tour with halal meals and prayer time consideration. Explore Seoul and Nami Island comfortably.',
                'highlights' => json_encode([
                    'Halal Korean Cuisine',
                    'Seoul Major Attractions',
                    'Nami Island',
                    'Bukchon Hanok Village',
                    'Prayer-friendly Itinerary',
                    'Muslim Guide Available'
                ]),
                'included' => json_encode([
                    'Return flights',
                    '5 nights accommodation',
                    'Daily breakfast & halal dinners',
                    'All entrance fees',
                    'Muslim-friendly guide',
                    'Pocket WiFi'
                ]),
                'excluded' => json_encode([
                    'K-ETA visa',
                    'Lunches',
                    'Personal expenses',
                    'Travel insurance',
                    'Tips'
                ]),
                'departure_location' => 'Jakarta',
                'max_participants' => 20,
                'available_from' => '2026-03-01',
                'available_until' => '2026-12-31',
            ],
            [
                'category' => 'Korea',
                'name' => 'WINTER YEAR END KOREA + SKI & LOTTE WORLD',
                'duration' => '6 Days 4 Nights',
                'price' => 15990000,
                'description' => 'Winter wonderland Korea experience with skiing and theme park fun. Perfect year-end holiday package!',
                'highlights' => json_encode([
                    'Ski Resort Full Day Pass',
                    'Lotte World Theme Park',
                    'Nami Island Snow Scene',
                    'Winter K-Drama Locations',
                    'Seoul City Lights',
                    'Hongdae Street Performance'
                ]),
                'included' => json_encode([
                    'Return flights',
                    '4 nights hotel',
                    'Daily breakfast',
                    'Ski equipment rental',
                    'Lotte World ticket',
                    'All transfers'
                ]),
                'excluded' => json_encode([
                    'Ski lesson fee',
                    'Meals except breakfast',
                    'Personal expenses',
                    'Travel insurance'
                ]),
                'departure_location' => 'Jakarta',
                'max_participants' => 25,
                'available_from' => '2026-11-01',
                'available_until' => '2027-02-28',
            ],
            [
                'category' => 'Korea',
                'name' => '7D ENJOY BLOSSOM LEBARAN KOREA',
                'duration' => '7 Days',
                'price' => 17390000,
                'description' => 'Spring cherry blossom special tour during Lebaran holiday. Witness Korea in full bloom with family!',
                'highlights' => json_encode([
                    'Cherry Blossom Viewing',
                    'Yeouido Spring Festival',
                    'Jinhae Gunhangje Festival',
                    'Seoul Grand Park',
                    'Halal Meal Options',
                    'Traditional Korean Village'
                ]),
                'included' => json_encode([
                    'Return flights',
                    '6 nights accommodation',
                    'Daily breakfast',
                    'All entrance fees',
                    'Blossom tour guide',
                    'Hotel transfers'
                ]),
                'excluded' => json_encode([
                    'Lunch and dinner',
                    'Personal expenses',
                    'Optional activities',
                    'Travel insurance'
                ]),
                'departure_location' => 'Jakarta',
                'max_participants' => 25,
                'available_from' => '2026-03-15',
                'available_until' => '2026-04-30',
            ],
            [
                'category' => 'Korea',
                'name' => '7D NEW YEAR BUSAN SEOUL WITH YACHT EXPERIENCE',
                'duration' => '7 Days',
                'price' => 19290000,
                'description' => 'Luxury New Year celebration covering Busan and Seoul with exclusive yacht experience. Toast to new year in style!',
                'highlights' => json_encode([
                    'Private Yacht Experience',
                    'Busan Gwangalli Beach',
                    'Gamcheon Culture Village',
                    'Seoul Countdown Event',
                    'Haeundae New Year Sunrise',
                    'KTX Train Experience'
                ]),
                'included' => json_encode([
                    'Return flights',
                    '6 nights 4-star hotels',
                    'Daily breakfast & 2 special dinners',
                    'Yacht tour',
                    'KTX tickets',
                    'All entrance fees',
                    'Professional guide'
                ]),
                'excluded' => json_encode([
                    'Lunches',
                    'Personal expenses',
                    'Yacht additional services',
                    'Travel insurance'
                ]),
                'departure_location' => 'Jakarta',
                'max_participants' => 20,
                'available_from' => '2026-12-26',
                'available_until' => '2027-01-05',
            ],
            [
                'category' => 'Korea',
                'name' => 'NEW YEAR EXCITING WINTER KOREA 7D',
                'duration' => '7 Days',
                'price' => 22590000,
                'description' => 'Premium winter Korea experience with snow festivals, ice fishing, and luxury accommodations. Create magical memories!',
                'highlights' => json_encode([
                    'Ice Fishing Festival',
                    'Ski Resort 2 Days',
                    'Nami Island Winter',
                    'Seoul Snow Festival',
                    'Luxury Hotel Staycation',
                    'New Year Special Events'
                ]),
                'included' => json_encode([
                    'Return flights (premium economy)',
                    '6 nights luxury accommodation',
                    'Daily breakfast & 4 dinners',
                    'Ski pass & equipment',
                    'Ice fishing experience',
                    'All tours with guide',
                    'Pocket WiFi'
                ]),
                'excluded' => json_encode([
                    'Lunches',
                    'Personal expenses',
                    'Additional winter activities',
                    'Travel insurance'
                ]),
                'departure_location' => 'Jakarta',
                'max_participants' => 16,
                'available_from' => '2026-12-20',
                'available_until' => '2027-02-10',
            ],

            // Hong Kong Tours
            [
                'category' => 'Hongkong',
                'name' => '7D YEAR END SPECIAL HONGKONG SHENZHEN MACAU + DISNEYLAND',
                'duration' => '7 Days',
                'price' => 17590000,
                'description' => 'Ultimate year-end celebration covering 3 cities! Experience Hong Kong Disneyland, Macau casinos, and Shenzhen shopping.',
                'highlights' => json_encode([
                    'Hong Kong Disneyland',
                    'Victoria Peak & Symphony of Lights',
                    'Macau Venetian & Ruins of St. Paul',
                    'Shenzhen Window of the World',
                    'Ngong Ping 360 Cable Car',
                    'Year-end Countdown Event'
                ]),
                'included' => json_encode([
                    'Return flights',
                    '6 nights accommodation',
                    'Daily breakfast',
                    'Disneyland 1-day ticket',
                    'All entrance fees',
                    'Ferry tickets HK-Macau',
                    'Tour guide & transfers'
                ]),
                'excluded' => json_encode([
                    'Lunch and dinner',
                    'Personal shopping',
                    'Macau casino expenses',
                    'Travel insurance'
                ]),
                'departure_location' => 'Jakarta',
                'max_participants' => 25,
                'available_from' => '2026-12-20',
                'available_until' => '2027-01-10',
            ],

            // Turkey Tours
            [
                'category' => 'Turki',
                'name' => '10D BEST OF TURKIYE CAPPADOCIA + BOSPHORUS',
                'duration' => '10 Days',
                'price' => 15999000,
                'description' => 'Classic Turkey tour covering Istanbul, Cappadocia, Pamukkale, and Ephesus. Experience East meets West civilization!',
                'highlights' => json_encode([
                    'Hot Air Balloon Cappadocia',
                    'Bosphorus Cruise',
                    'Hagia Sophia & Blue Mosque',
                    'Pamukkale Thermal Pools',
                    'Ephesus Ancient City',
                    'Grand Bazaar Shopping'
                ]),
                'included' => json_encode([
                    'Return international flights',
                    '9 nights hotel accommodation',
                    'Daily breakfast & 8 dinners',
                    'All entrance fees',
                    'Internal flights',
                    'English speaking guide',
                    'All transfers'
                ]),
                'excluded' => json_encode([
                    'Turkey e-visa',
                    'Hot air balloon ride (optional)',
                    'Lunches',
                    'Personal expenses',
                    'Travel insurance'
                ]),
                'departure_location' => 'Jakarta',
                'max_participants' => 20,
                'available_from' => '2026-03-01',
                'available_until' => '2026-11-30',
            ],
            [
                'category' => 'Turki',
                'name' => '10D NEW WINTER TURKIYE + Mt. ERCIYES',
                'duration' => '10 Days',
                'price' => 15990000,
                'description' => 'Winter special Turkey tour with Mount Erciyes ski resort. Combine culture and winter sports adventure!',
                'highlights' => json_encode([
                    'Mt. Erciyes Ski Resort',
                    'Cappadocia Snow Landscape',
                    'Istanbul Winter Charm',
                    'Turkish Bath Experience',
                    'Whirling Dervish Show',
                    'Traditional Turkish Cuisine'
                ]),
                'included' => json_encode([
                    'Return flights',
                    '9 nights accommodation',
                    'Daily breakfast & dinners',
                    'Ski resort day pass',
                    'All entrance fees',
                    'Domestic flights',
                    'Professional guide'
                ]),
                'excluded' => json_encode([
                    'Ski equipment rental',
                    'Lunches',
                    'Personal expenses',
                    'Travel insurance',
                    'Tips'
                ]),
                'departure_location' => 'Jakarta',
                'max_participants' => 20,
                'available_from' => '2026-12-01',
                'available_until' => '2027-03-31',
            ],
            [
                'category' => 'Turki',
                'name' => 'TURKIASIK 10 DAYS 07 NIGHT',
                'duration' => '10 Days 7 Nights',
                'price' => 15599000,
                'description' => 'Classic Turkey highlights package at best value. Perfect introduction to Turkish culture and history.',
                'highlights' => json_encode([
                    'Istanbul Top Attractions',
                    'Cappadocia Underground City',
                    'Pamukkale Cotton Castle',
                    'Ephesus Library of Celsus',
                    'Turkish Carpet Factory',
                    'Spice Bazaar'
                ]),
                'included' => json_encode([
                    'Return flights',
                    '7 nights hotel',
                    'Daily breakfast & dinners',
                    'All entrance tickets',
                    'Internal flights',
                    'Tour guide',
                    'Airport transfers'
                ]),
                'excluded' => json_encode([
                    'Visa fee',
                    'Lunches',
                    'Optional tours',
                    'Personal shopping',
                    'Travel insurance'
                ]),
                'departure_location' => 'Jakarta',
                'max_participants' => 25,
                'available_from' => '2026-03-01',
                'available_until' => '2026-12-31',
            ],
            [
                'category' => 'Turki',
                'name' => '28 DEC WONDERFUL TURKIYE ERCIYES 10D7N',
                'duration' => '10 Days 7 Nights',
                'price' => 22999000,
                'description' => 'Premium year-end Turkey tour with Mount Erciyes. Ring in the new year with Turkish hospitality!',
                'highlights' => json_encode([
                    'New Year Celebration in Turkey',
                    'Mt. Erciyes Ski Experience',
                    'Cappadocia Deluxe Cave Hotel',
                    'Istanbul 5-Star Bosphorus Hotel',
                    'Gala Dinner New Year',
                    'Luxury Coach Transportation'
                ]),
                'included' => json_encode([
                    'Return flights (premium seats)',
                    '7 nights premium accommodation',
                    'All meals included',
                    'New Year gala dinner',
                    'Ski pass',
                    'All attractions VIP entry',
                    'Professional guide'
                ]),
                'excluded' => json_encode([
                    'Ski equipment',
                    'Personal expenses',
                    'Alcoholic beverages',
                    'Travel insurance'
                ]),
                'departure_location' => 'Jakarta',
                'max_participants' => 16,
                'available_from' => '2026-12-28',
                'available_until' => '2027-01-08',
            ],

            // Vietnam Tours
            [
                'category' => 'Vietnam',
                'name' => 'BEST OF HANOI HALONG BAY FANSIPAN 6D',
                'duration' => '6 Days',
                'price' => 9990000,
                'description' => 'Explore Northern Vietnam\'s highlights including UNESCO Halong Bay and Fansipan - roof of Indochina.',
                'highlights' => json_encode([
                    'Halong Bay Cruise (1 night)',
                    'Fansipan Cable Car',
                    'Hanoi Old Quarter',
                    'Water Puppet Show',
                    'Sapa Hill Tribes',
                    'Vietnamese Coffee Tasting'
                ]),
                'included' => json_encode([
                    'Return flights',
                    '5 nights accommodation',
                    'Daily breakfast & 3 dinners',
                    'Halong Bay cruise',
                    'Fansipan ticket',
                    'All entrance fees',
                    'Tour guide'
                ]),
                'excluded' => json_encode([
                    'Visa on arrival fee',
                    'Lunches',
                    'Personal expenses',
                    'Travel insurance',
                    'Tips'
                ]),
                'departure_location' => 'Jakarta',
                'max_participants' => 25,
                'available_from' => '2026-03-01',
                'available_until' => '2026-12-31',
            ],
            [
                'category' => 'Vietnam',
                'name' => 'CRAZY SALE HANOI SAPA HALONG BAY 7D',
                'duration' => '7 Days',
                'price' => 7990000,
                'description' => 'Budget-friendly Vietnam package covering all Northern highlights. Best value for money Vietnam tour!',
                'highlights' => json_encode([
                    'Halong Bay Overnight Cruise',
                    'Sapa Trekking',
                    'Hanoi City Tour',
                    'Train Street Experience',
                    'Cat Cat Village',
                    'Local Market Visits'
                ]),
                'included' => json_encode([
                    'Return flights',
                    '6 nights accommodation',
                    'Daily breakfast',
                    'Halong Bay cruise',
                    'All transfers',
                    'English guide'
                ]),
                'excluded' => json_encode([
                    'Vietnam visa',
                    'Lunch and dinner (except on cruise)',
                    'Personal expenses',
                    'Travel insurance'
                ]),
                'departure_location' => 'Jakarta',
                'max_participants' => 30,
                'available_from' => '2026-03-01',
                'available_until' => '2026-12-31',
            ],
            [
                'category' => 'Vietnam',
                'name' => '8D FANTASTIC END YEAR HANOI HALONG SAPA SAIGON BY VN',
                'duration' => '8 Days',
                'price' => 16990000,
                'description' => 'Complete Vietnam North to South tour. Experience diverse culture from Hanoi to Ho Chi Minh City for year-end!',
                'highlights' => json_encode([
                    'North to South Vietnam',
                    'Halong Bay 5-Star Cruise',
                    'Sapa Valley Views',
                    'Cu Chi Tunnels',
                    'Mekong Delta Tour',
                    'Saigon Nightlife'
                ]),
                'included' => json_encode([
                    'Return international flights',
                    '7 nights accommodation',
                    'Daily breakfast & 4 dinners',
                    'Domestic flight Hanoi-Saigon',
                    'Luxury Halong cruise',
                    'All entrance fees',
                    'Professional guide'
                ]),
                'excluded' => json_encode([
                    'Vietnam visa',
                    'Lunches',
                    'Personal expenses',
                    'Travel insurance',
                    'Optional tours'
                ]),
                'departure_location' => 'Jakarta',
                'max_participants' => 20,
                'available_from' => '2026-12-20',
                'available_until' => '2027-01-10',
            ],

            // Multi-Country Tours
            [
                'category' => 'Multi-Country',
                'name' => 'Series 2 Negara',
                'duration' => '5 Days 4 Nights',
                'price' => 6399000,
                'description' => 'Explore 2 countries in one trip! Popular combination: Singapore-Malaysia or Malaysia-Thailand. Great value package!',
                'highlights' => json_encode([
                    'Two Countries One Trip',
                    'Major City Highlights',
                    'Cross-Border Experience',
                    'Mixed Cultural Experience',
                    'Shopping Paradise',
                    'Diverse Cuisine'
                ]),
                'included' => json_encode([
                    'Return flights',
                    '4 nights accommodation',
                    'Daily breakfast',
                    'City tours both countries',
                    'Border crossing transfers',
                    'Tour guide'
                ]),
                'excluded' => json_encode([
                    'Visa fees (if required)',
                    'Lunch and dinner',
                    'Personal expenses',
                    'Optional attractions',
                    'Travel insurance'
                ]),
                'departure_location' => 'Jakarta',
                'max_participants' => 25,
                'available_from' => '2026-03-01',
                'available_until' => '2026-12-31',
            ],
            [
                'category' => 'Multi-Country',
                'name' => 'Series 3 Negara',
                'duration' => '7 Days 6 Nights',
                'price' => 6399000,
                'description' => 'Amazing 3-country tour! Experience Singapore, Malaysia, and Thailand in one incredible journey. Unbeatable value!',
                'highlights' => json_encode([
                    'Three Countries Adventure',
                    'Singapore City Tour',
                    'Kuala Lumpur Highlights',
                    'Bangkok & Pattaya',
                    'Diverse Asian Cultures',
                    'Shopping Spree'
                ]),
                'included' => json_encode([
                    'Return flights',
                    '6 nights hotels',
                    'Daily breakfast',
                    'All city tours',
                    'Cross-border transfers',
                    'Multi-lingual guide'
                ]),
                'excluded' => json_encode([
                    'Visa fees',
                    'Meals except breakfast',
                    'Personal shopping',
                    'Optional tours',
                    'Travel insurance'
                ]),
                'departure_location' => 'Jakarta',
                'max_participants' => 30,
                'available_from' => '2026-03-01',
                'available_until' => '2026-12-31',
            ],

            // Private Tours
            [
                'category' => 'Private Tour',
                'name' => '3D2N PRIVATE SINGAPUR USS',
                'duration' => '3 Days 2 Nights',
                'price' => 5105000,
                'description' => 'Exclusive private Singapore tour with Universal Studios. Flexible itinerary just for your group!',
                'highlights' => json_encode([
                    'Private Car & Driver',
                    'Universal Studios Singapore',
                    'Customizable Itinerary',
                    'Gardens by the Bay',
                    'Flexible Timing',
                    'Personal Tour Guide'
                ]),
                'included' => json_encode([
                    'Return flights',
                    '2 nights hotel',
                    'Daily breakfast',
                    'USS ticket',
                    'Private car full day',
                    'Personal guide',
                    'Airport transfers'
                ]),
                'excluded' => json_encode([
                    'Lunch and dinner',
                    'Additional attractions',
                    'Personal expenses',
                    'Travel insurance'
                ]),
                'departure_location' => 'Jakarta',
                'max_participants' => 6,
                'available_from' => '2026-03-01',
                'available_until' => '2026-12-31',
            ],
            [
                'category' => 'Private Tour',
                'name' => '4D3N PRIVATE SINGAPORE USS',
                'duration' => '4 Days 3 Nights',
                'price' => 9535000,
                'description' => 'Luxury private Singapore experience with extended time. Perfect for families wanting personalized service.',
                'highlights' => json_encode([
                    'Private Chauffeur Service',
                    'Universal Studios + SEA Aquarium',
                    'Premium Hotel Upgrade Available',
                    'Flexible Daily Schedule',
                    'Personal Photographer (Optional)',
                    'VIP Treatment'
                ]),
                'included' => json_encode([
                    'Return flights',
                    '3 nights 4-star hotel',
                    'Daily breakfast',
                    'USS + SEA combo ticket',
                    'Private car all days',
                    'Personal guide',
                    'All transfers'
                ]),
                'excluded' => json_encode([
                    'Meals except breakfast',
                    'Additional activities',
                    'Shopping expenses',
                    'Travel insurance'
                ]),
                'departure_location' => 'Jakarta',
                'max_participants' => 6,
                'available_from' => '2026-03-01',
                'available_until' => '2026-12-31',
            ],
            [
                'category' => 'Private Tour',
                'name' => '4D3N PRIVATE KUALA LUMPUR – SINGAPORE USS',
                'duration' => '4 Days 3 Nights',
                'price' => 7760000,
                'description' => 'Private 2-country tour covering KL and Singapore with Universal Studios. Enjoy flexibility and comfort!',
                'highlights' => json_encode([
                    'Private Car Both Countries',
                    'Petronas Twin Towers',
                    'Genting Highlands (Optional)',
                    'Singapore Universal Studios',
                    'Flexible Border Crossing',
                    'Customized Routes'
                ]),
                'included' => json_encode([
                    'Return flights',
                    '3 nights accommodation',
                    'Daily breakfast',
                    'USS ticket',
                    'Private car & driver',
                    'Personal guide',
                    'All transfers'
                ]),
                'excluded' => json_encode([
                    'Visa fees',
                    'Lunch and dinner',
                    'Optional attractions',
                    'Personal expenses',
                    'Travel insurance'
                ]),
                'departure_location' => 'Jakarta',
                'max_participants' => 6,
                'available_from' => '2026-03-01',
                'available_until' => '2026-12-31',
            ],
        ];

        foreach ($tours as $tourData) {
            $category = Category::where('name', $tourData['category'])->first();
            
            if (!$category) {
                $this->command->warn("Category not found: {$tourData['category']} - Creating it...");
                $category = Category::create([
                    'name' => $tourData['category'],
                    'description' => "Tours to {$tourData['category']}"
                ]);
            }

            Tour::firstOrCreate(
                ['name' => $tourData['name']],
                [
                    'category_id' => $category->id,
                    'duration' => $tourData['duration'],
                    'price' => $tourData['price'],
                    'description' => $tourData['description'],
                    'highlights' => $tourData['highlights'],
                    'included' => $tourData['included'],
                    'excluded' => $tourData['excluded'],
                    'departure_location' => $tourData['departure_location'],
                    'max_participants' => $tourData['max_participants'],
                    'available_from' => $tourData['available_from'],
                    'available_until' => $tourData['available_until'],
                ]
            );

            $this->command->info("✓ Tour added: {$tourData['name']}");
        }

        $this->command->info("✅ All tours have been seeded successfully!");
    }
}
