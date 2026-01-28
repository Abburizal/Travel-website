import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
    en: {
        translation: {
            // Navigation
            nav: {
                home: 'Home',
                tours: 'Tours',
                about: 'About Us',
                contact: 'Contact',
                login: 'Login',
                register: 'Register',
                dashboard: 'Dashboard',
                wishlist: 'Wishlist',
                compare: 'Compare',
                logout: 'Logout'
            },
            
            // Common words
            common: {
                search: 'Search',
                filter: 'Filter',
                sort: 'Sort by',
                clear: 'Clear',
                apply: 'Apply',
                cancel: 'Cancel',
                save: 'Save',
                edit: 'Edit',
                delete: 'Delete',
                view: 'View',
                close: 'Close',
                loading: 'Loading...',
                no_results: 'No results found',
                error: 'An error occurred',
                success: 'Success!',
                price: 'Price',
                duration: 'Duration',
                category: 'Category',
                destination: 'Destination',
                per_person: 'per person',
                days: 'days',
                book_now: 'Book Now',
                view_details: 'View Details',
                learn_more: 'Learn More',
                read_more: 'Read More'
            },
            
            // Home page
            home: {
                hero_title: 'Discover Your Next Adventure',
                hero_subtitle: 'Explore amazing destinations with our curated tour packages',
                explore_tours: 'Explore Tours',
                featured_tours: 'Featured Tours',
                why_choose_us: 'Why Choose Us',
                best_prices: 'Best Prices',
                best_prices_desc: 'We guarantee the best prices for all our tour packages',
                expert_guides: 'Expert Guides',
                expert_guides_desc: 'Professional and experienced tour guides',
                safe_travel: 'Safe Travel',
                safe_travel_desc: 'Your safety is our top priority',
                support: '24/7 Support',
                support_desc: 'We are always here to help you',
                testimonials: 'What Our Customers Say',
                meet_team: 'Meet Our Team'
            },
            
            // Tours page
            tours: {
                title: 'All Tours',
                search_placeholder: 'Search tours by name or destination...',
                filter_title: 'Filters',
                category: 'Category',
                all_categories: 'All Categories',
                price_range: 'Price Range',
                duration_filter: 'Duration',
                availability: 'Availability',
                available_only: 'Available Only',
                sort_by: 'Sort by',
                sort_price_low: 'Price: Low to High',
                sort_price_high: 'Price: High to Low',
                sort_duration_short: 'Duration: Shortest',
                sort_duration_long: 'Duration: Longest',
                sort_newest: 'Newest First',
                sort_popular: 'Most Popular',
                showing_results: 'Showing {{count}} tour(s)',
                no_tours: 'No tours found matching your criteria',
                seats_left: 'Seats Left',
                sold_out: 'Sold Out',
                compare: 'Compare',
                add_wishlist: 'Add to Wishlist',
                remove_wishlist: 'Remove from Wishlist'
            },
            
            // Tour Detail
            tour_detail: {
                overview: 'Overview',
                highlights: 'Highlights',
                included: 'What\'s Included',
                excluded: 'What\'s Not Included',
                itinerary: 'Itinerary',
                download_itinerary: 'Download Itinerary',
                reviews: 'Reviews',
                rating: 'Rating',
                no_reviews: 'No reviews yet',
                write_review: 'Write a Review',
                departure: 'Departure',
                destination: 'Destination',
                available_seats: 'Available Seats',
                share: 'Share this tour',
                book_this_tour: 'Book This Tour',
                sold_out_message: 'This tour is currently sold out'
            },
            
            // Booking
            booking: {
                title: 'Complete Your Booking',
                tour_details: 'Tour Details',
                personal_info: 'Personal Information',
                full_name: 'Full Name',
                email: 'Email Address',
                phone: 'Phone Number',
                special_requests: 'Special Requests',
                special_requests_placeholder: 'Any special requirements or requests...',
                payment_summary: 'Payment Summary',
                subtotal: 'Subtotal',
                tax: 'Tax',
                total: 'Total',
                proceed_payment: 'Proceed to Payment',
                booking_confirmed: 'Booking Confirmed!',
                booking_error: 'Booking Failed'
            },
            
            // Dashboard
            dashboard: {
                title: 'My Dashboard',
                my_bookings: 'My Bookings',
                no_bookings: 'You have no bookings yet',
                booking_status: 'Status',
                booking_date: 'Booking Date',
                total_paid: 'Total Paid',
                status_pending: 'Pending',
                status_paid: 'Paid',
                status_confirmed: 'Confirmed',
                status_cancelled: 'Cancelled',
                view_details: 'View Details',
                my_reviews: 'My Reviews',
                write_review: 'Write Review',
                no_reviews: 'You haven\'t written any reviews yet'
            },
            
            // Auth
            auth: {
                login: 'Login',
                register: 'Register',
                email: 'Email',
                password: 'Password',
                confirm_password: 'Confirm Password',
                name: 'Full Name',
                remember_me: 'Remember Me',
                forgot_password: 'Forgot Password?',
                no_account: 'Don\'t have an account?',
                have_account: 'Already have an account?',
                sign_in: 'Sign In',
                sign_up: 'Sign Up',
                login_success: 'Login successful!',
                register_success: 'Registration successful!',
                logout_success: 'Logged out successfully'
            },
            
            // Wishlist
            wishlist: {
                title: 'My Wishlist',
                empty: 'Your wishlist is empty',
                added: 'Added to wishlist',
                removed: 'Removed from wishlist'
            },
            
            // Compare
            compare: {
                title: 'Compare Tours',
                empty: 'No tours to compare',
                max_reached: 'Maximum 3 tours can be compared',
                added: 'Added to compare',
                removed: 'Removed from compare',
                clear_all: 'Clear All',
                compare_feature: 'Compare Features'
            },
            
            // Contact
            contact: {
                title: 'Contact Us',
                subtitle: 'Get in touch with us',
                name: 'Your Name',
                email: 'Your Email',
                subject: 'Subject',
                message: 'Message',
                send: 'Send Message',
                success: 'Message sent successfully!',
                office: 'Office',
                phone: 'Phone',
                email_label: 'Email',
                follow_us: 'Follow Us'
            },
            
            // FAQ
            faq: {
                title: 'Frequently Asked Questions',
                subtitle: 'Find answers to common questions'
            },
            
            // Footer
            footer: {
                about_us: 'About Us',
                quick_links: 'Quick Links',
                popular_tours: 'Popular Tours',
                contact_info: 'Contact Info',
                newsletter: 'Newsletter',
                newsletter_text: 'Subscribe to get special offers and updates',
                subscribe: 'Subscribe',
                copyright: '© 2026 Tripin Travel. All rights reserved.',
                terms: 'Terms of Service',
                privacy: 'Privacy Policy'
            }
        }
    },
    id: {
        translation: {
            // Navigasi
            nav: {
                home: 'Beranda',
                tours: 'Paket Tour',
                about: 'Tentang Kami',
                contact: 'Kontak',
                login: 'Masuk',
                register: 'Daftar',
                dashboard: 'Dashboard',
                wishlist: 'Favorit',
                compare: 'Bandingkan',
                logout: 'Keluar'
            },
            
            // Kata umum
            common: {
                search: 'Cari',
                filter: 'Filter',
                sort: 'Urutkan',
                clear: 'Hapus',
                apply: 'Terapkan',
                cancel: 'Batal',
                save: 'Simpan',
                edit: 'Ubah',
                delete: 'Hapus',
                view: 'Lihat',
                close: 'Tutup',
                loading: 'Memuat...',
                no_results: 'Tidak ada hasil',
                error: 'Terjadi kesalahan',
                success: 'Berhasil!',
                price: 'Harga',
                duration: 'Durasi',
                category: 'Kategori',
                destination: 'Destinasi',
                per_person: 'per orang',
                days: 'hari',
                book_now: 'Pesan Sekarang',
                view_details: 'Lihat Detail',
                learn_more: 'Pelajari Lebih Lanjut',
                read_more: 'Baca Selengkapnya'
            },
            
            // Halaman beranda
            home: {
                hero_title: 'Temukan Petualangan Anda Selanjutnya',
                hero_subtitle: 'Jelajahi destinasi menakjubkan dengan paket tour pilihan kami',
                explore_tours: 'Jelajahi Tour',
                featured_tours: 'Tour Unggulan',
                why_choose_us: 'Mengapa Memilih Kami',
                best_prices: 'Harga Terbaik',
                best_prices_desc: 'Kami menjamin harga terbaik untuk semua paket tour',
                expert_guides: 'Pemandu Ahli',
                expert_guides_desc: 'Pemandu tour profesional dan berpengalaman',
                safe_travel: 'Perjalanan Aman',
                safe_travel_desc: 'Keamanan Anda adalah prioritas utama kami',
                support: 'Dukungan 24/7',
                support_desc: 'Kami selalu siap membantu Anda',
                testimonials: 'Kata Pelanggan Kami',
                meet_team: 'Tim Kami'
            },
            
            // Halaman tour
            tours: {
                title: 'Semua Paket Tour',
                search_placeholder: 'Cari tour berdasarkan nama atau destinasi...',
                filter_title: 'Filter',
                category: 'Kategori',
                all_categories: 'Semua Kategori',
                price_range: 'Rentang Harga',
                duration_filter: 'Durasi',
                availability: 'Ketersediaan',
                available_only: 'Tersedia Saja',
                sort_by: 'Urutkan',
                sort_price_low: 'Harga: Rendah ke Tinggi',
                sort_price_high: 'Harga: Tinggi ke Rendah',
                sort_duration_short: 'Durasi: Terpendek',
                sort_duration_long: 'Durasi: Terpanjang',
                sort_newest: 'Terbaru',
                sort_popular: 'Terpopuler',
                showing_results: 'Menampilkan {{count}} tour',
                no_tours: 'Tidak ada tour yang sesuai dengan kriteria Anda',
                seats_left: 'Kursi Tersisa',
                sold_out: 'Habis Terjual',
                compare: 'Bandingkan',
                add_wishlist: 'Tambah ke Favorit',
                remove_wishlist: 'Hapus dari Favorit'
            },
            
            // Detail Tour
            tour_detail: {
                overview: 'Ringkasan',
                highlights: 'Sorotan',
                included: 'Yang Termasuk',
                excluded: 'Yang Tidak Termasuk',
                itinerary: 'Itinerary',
                download_itinerary: 'Unduh Itinerary',
                reviews: 'Ulasan',
                rating: 'Rating',
                no_reviews: 'Belum ada ulasan',
                write_review: 'Tulis Ulasan',
                departure: 'Keberangkatan',
                destination: 'Destinasi',
                available_seats: 'Kursi Tersedia',
                share: 'Bagikan tour ini',
                book_this_tour: 'Pesan Tour Ini',
                sold_out_message: 'Tour ini saat ini sudah habis terjual'
            },
            
            // Pemesanan
            booking: {
                title: 'Lengkapi Pemesanan Anda',
                tour_details: 'Detail Tour',
                personal_info: 'Informasi Pribadi',
                full_name: 'Nama Lengkap',
                email: 'Alamat Email',
                phone: 'Nomor Telepon',
                special_requests: 'Permintaan Khusus',
                special_requests_placeholder: 'Permintaan atau kebutuhan khusus...',
                payment_summary: 'Ringkasan Pembayaran',
                subtotal: 'Subtotal',
                tax: 'Pajak',
                total: 'Total',
                proceed_payment: 'Lanjut ke Pembayaran',
                booking_confirmed: 'Pemesanan Berhasil!',
                booking_error: 'Pemesanan Gagal'
            },
            
            // Dashboard
            dashboard: {
                title: 'Dashboard Saya',
                my_bookings: 'Pemesanan Saya',
                no_bookings: 'Anda belum memiliki pemesanan',
                booking_status: 'Status',
                booking_date: 'Tanggal Pesan',
                total_paid: 'Total Bayar',
                status_pending: 'Menunggu',
                status_paid: 'Lunas',
                status_confirmed: 'Terkonfirmasi',
                status_cancelled: 'Dibatalkan',
                view_details: 'Lihat Detail',
                my_reviews: 'Ulasan Saya',
                write_review: 'Tulis Ulasan',
                no_reviews: 'Anda belum menulis ulasan'
            },
            
            // Autentikasi
            auth: {
                login: 'Masuk',
                register: 'Daftar',
                email: 'Email',
                password: 'Kata Sandi',
                confirm_password: 'Konfirmasi Kata Sandi',
                name: 'Nama Lengkap',
                remember_me: 'Ingat Saya',
                forgot_password: 'Lupa Kata Sandi?',
                no_account: 'Belum punya akun?',
                have_account: 'Sudah punya akun?',
                sign_in: 'Masuk',
                sign_up: 'Daftar',
                login_success: 'Login berhasil!',
                register_success: 'Registrasi berhasil!',
                logout_success: 'Berhasil keluar'
            },
            
            // Favorit
            wishlist: {
                title: 'Favorit Saya',
                empty: 'Daftar favorit Anda kosong',
                added: 'Ditambahkan ke favorit',
                removed: 'Dihapus dari favorit'
            },
            
            // Bandingkan
            compare: {
                title: 'Bandingkan Tour',
                empty: 'Tidak ada tour untuk dibandingkan',
                max_reached: 'Maksimal 3 tour dapat dibandingkan',
                added: 'Ditambahkan ke perbandingan',
                removed: 'Dihapus dari perbandingan',
                clear_all: 'Hapus Semua',
                compare_feature: 'Bandingkan Fitur'
            },
            
            // Kontak
            contact: {
                title: 'Hubungi Kami',
                subtitle: 'Hubungi kami',
                name: 'Nama Anda',
                email: 'Email Anda',
                subject: 'Subjek',
                message: 'Pesan',
                send: 'Kirim Pesan',
                success: 'Pesan berhasil dikirim!',
                office: 'Kantor',
                phone: 'Telepon',
                email_label: 'Email',
                follow_us: 'Ikuti Kami'
            },
            
            // FAQ
            faq: {
                title: 'Pertanyaan yang Sering Diajukan',
                subtitle: 'Temukan jawaban untuk pertanyaan umum'
            },
            
            // Footer
            footer: {
                about_us: 'Tentang Kami',
                quick_links: 'Tautan Cepat',
                popular_tours: 'Tour Populer',
                contact_info: 'Info Kontak',
                newsletter: 'Newsletter',
                newsletter_text: 'Berlangganan untuk mendapatkan penawaran khusus dan update',
                subscribe: 'Berlangganan',
                copyright: '© 2026 Tripin Travel. Hak cipta dilindungi.',
                terms: 'Syarat Layanan',
                privacy: 'Kebijakan Privasi'
            }
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'id', // Indonesian as default
        lng: 'id', // Default language
        
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage']
        },
        
        interpolation: {
            escapeValue: false // React already escapes
        }
    });

export default i18n;
