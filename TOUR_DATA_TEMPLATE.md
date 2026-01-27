# 📋 TOUR PACKAGE DATA TEMPLATE - FLYMORA

**Panduan:** Field apa saja yang dibutuhkan untuk mengisi paket tour

---

## ✅ DATA WAJIB (REQUIRED)

### 1. **Nama Paket** (name)
**Format:** String, max 200 karakter  
**Contoh:** "Singapore Malaysia 5D4N Amazing Tour", "Bali Adventure Complete Package"  
**Tips:** Sertakan destinasi + durasi untuk clarity

### 2. **Kategori** (category)
**Format:** Pilih dari 16 kategori yang tersedia  
**Pilihan:**
- Activity: Adventure, Beach, Cultural, Mountain, City
- Country: Thailand, Malaysia, Singapore, China, Japan, Korea, Vietnam, Turki, Hongkong
- Special: Multi-Country, Private Tour

**Contoh:** "Thailand" atau "Multi-Country" atau "Adventure"

### 3. **Harga** (price)
**Format:** Angka dalam IDR (tanpa titik/koma)  
**Contoh:** 5500000 (untuk Rp 5.500.000)  
**Tips:** 
- Harga mulai dari (starting from)
- Sudah termasuk format IDR di sistem

### 4. **Durasi** (duration)
**Format:** String bebas atau angka hari  
**Contoh:** 
- "5 Days 4 Nights"
- "4D3N"
- "5" (sistem otomatis format jadi "5 Days 4 Nights")

### 5. **Destinasi** (destination)
**Format:** String, nama kota/negara utama  
**Contoh:** "Bali, Indonesia", "Singapore", "Bangkok, Thailand"

### 6. **Deskripsi Singkat** (description)
**Format:** Text, 2-3 paragraf (500-800 karakter recommended)  
**Contoh:**
```
Jelajahi keindahan pulau Bali dengan paket lengkap selama 5 hari 4 malam. 
Kunjungi tempat-tempat ikonik seperti Tanah Lot, Ubud, dan Uluwatu.

Nikmati pengalaman budaya Bali yang autentik dengan mengunjungi desa tradisional,
menyaksikan tari Kecak, dan mencoba kuliner khas Bali.

Paket ini cocok untuk keluarga, pasangan, atau solo traveler yang ingin
menikmati Bali secara maksimal dengan budget terjangkau.
```

---

## 🎯 DATA PENTING (HIGHLY RECOMMENDED)

### 7. **Highlights** (highlights)
**Format:** Array/List, 5-8 poin  
**Fungsi:** Keunggulan utama paket (ditampilkan di card & detail)  
**Contoh:**
```
- Kunjungan ke Tanah Lot Temple
- Ubud Rice Terrace dan Monkey Forest
- Uluwatu Temple dengan Kecak Dance
- Water sport activities di Tanjung Benoa
- Makan malam seafood di Jimbaran Beach
- Hotel bintang 4 dengan breakfast
```

### 8. **Termasuk dalam Paket** (included)
**Format:** Array/List, 6-10 item  
**Fungsi:** Apa yang sudah termasuk dalam harga  
**Contoh:**
```
- Hotel 4* (4 malam) dengan breakfast
- Transport full AC selama tour
- Tiket masuk semua objek wisata
- Guide berbahasa Indonesia/English
- Makan siang & malam (8x meals)
- Asuransi perjalanan
- Air mineral selama tour
```

### 9. **Tidak Termasuk** (excluded)
**Format:** Array/List, 4-6 item  
**Fungsi:** Apa yang TIDAK termasuk (transparency)  
**Contoh:**
```
- Tiket pesawat ke Bali
- Makan di luar itinerary
- Pengeluaran pribadi
- Tips guide & driver (optional)
```

### 10. **Lokasi Keberangkatan** (departure_location)
**Format:** String, nama kota/bandara  
**Contoh:** "Jakarta (Soekarno-Hatta)", "Surabaya", "Singapore"  
**Tips:** Penting untuk logistik customer

---

## 📸 DATA VISUAL (OPTIONAL TAPI BAGUS)

### 11. **Gambar Utama** (image)
**Format:** URL gambar atau upload file  
**Ukuran:** Min 1200x800px (landscape)  
**Fungsi:** Thumbnail utama di card & banner detail  
**Tips:** Pilih foto paling menarik/iconic

### 12. **Galeri Foto** (images/gallery)
**Format:** Array URL gambar  
**Jumlah:** 5-10 foto  
**Ukuran:** Min 1200x800px each  
**Fungsi:** Slideshow di halaman detail  
**Tips:** Variasi (tempat wisata, hotel, aktivitas, makanan)

---

## 📅 DATA TANGGAL (OPTIONAL)

### 13. **Tanggal Tersedia Mulai** (available_from)
**Format:** Date (YYYY-MM-DD)  
**Contoh:** 2026-02-01  
**Fungsi:** Periode tour tersedia

### 14. **Tanggal Tersedia Sampai** (available_until)
**Format:** Date (YYYY-MM-DD)  
**Contoh:** 2026-12-31  
**Fungsi:** Batas akhir tour

### 15. **Tanggal Keberangkatan** (start_date)
**Format:** Datetime  
**Contoh:** 2026-03-15  
**Fungsi:** Tanggal fix departure (jika ada)

---

## 👥 DATA KAPASITAS (SYSTEM DEFAULT)

### 16. **Max Peserta** (max_participants)
**Default:** 50 orang  
**Format:** Integer  
**Optional:** Bisa di-set manual jika berbeda

### 17. **Peserta Terdaftar** (booked_participants)
**Default:** 0  
**Auto-increment:** Otomatis bertambah saat ada booking

---

## 📄 DATA TAMBAHAN (ADVANCED)

### 18. **File Itinerary** (PDF)
**Format:** PDF file  
**Upload:** Via Filament admin panel  
**Fungsi:** Detail jadwal hari per hari  
**Ukuran:** Max 5MB recommended

---

## 📝 TEMPLATE PENGISIAN CEPAT

### **Format untuk 1 Paket Tour:**

```
NAMA PAKET: Singapore Malaysia Thailand 7D6N
KATEGORI: Multi-Country
HARGA: 8500000
DURASI: 7D6N
DESTINASI: Singapore, Malaysia, Thailand
DEPARTURE: Jakarta

DESKRIPSI:
Jelajahi 3 negara Asia Tenggara dalam 1 paket hemat! 
Tour 7 hari 6 malam mengunjungi Singapore, Malaysia, dan Thailand.
Cocok untuk first-time traveler yang ingin explore banyak destinasi.

HIGHLIGHTS:
- Marina Bay Sands & Gardens by the Bay
- Genting Highlands & Batu Caves
- Kuala Lumpur City Tour
- Bangkok Grand Palace & Wat Pho
- Floating Market & Ayutthaya
- Shopping time di setiap negara
- Hotel 3-4 star

TERMASUK:
- Hotel 6 malam (twin/double sharing)
- Transport AC antar negara
- Tour guide tiap negara
- Tiket masuk tempat wisata
- 12x meals (breakfast & lunch/dinner)
- Asuransi perjalanan

TIDAK TERMASUK:
- Tiket pesawat Jakarta-Singapore & Bangkok-Jakarta
- Visa (jika diperlukan)
- Makan di luar itinerary
- Pengeluaran pribadi
```

---

## 🎯 PRIORITAS DATA

### **MINIMAL (Bisa Langsung Publish):**
✅ Nama, Kategori, Harga, Durasi, Destinasi, Deskripsi

### **RECOMMENDED (Profesional):**
✅ + Highlights, Included, Excluded, Departure Location

### **COMPLETE (Best Quality):**
✅ + Gambar Utama, Galeri Foto, Tanggal Tersedia

### **PREMIUM (Full Package):**
✅ + File PDF Itinerary, Max Participants Custom

---

## 💡 TIPS PENGISIAN

### **Untuk Nama:**
- Jangan terlalu panjang (max 60 karakter ideal)
- Include destinasi utama
- Sertakan durasi jika multi-hari

### **Untuk Deskripsi:**
- Paragraf 1: Ringkasan tour (what & where)
- Paragraf 2: Aktivitas utama (what to do)
- Paragraf 3: Target market (who is this for)

### **Untuk Highlights:**
- Fokus pada selling points
- Gunakan bullet points singkat
- 5-8 poin sudah cukup
- Mix: tempat wisata + fasilitas + aktivitas

### **Untuk Harga:**
- Tulis dalam angka bulat IDR
- Contoh: 5500000 (bukan 5.500.000 atau Rp 5.5jt)
- Sistem akan format otomatis jadi Rp 5.500.000

---

## ❓ FAQ

**Q: Apakah semua field harus diisi?**  
A: Tidak. Minimal: nama, kategori, harga, durasi, destinasi, deskripsi.

**Q: Berapa panjang deskripsi ideal?**  
A: 500-800 karakter (2-3 paragraf singkat).

**Q: Berapa banyak highlights yang ideal?**  
A: 5-8 poin sudah cukup. Fokus pada yang paling menarik.

**Q: Format harga bagaimana?**  
A: Angka bulat tanpa titik/koma. Contoh: 5500000

**Q: Durasi harus format apa?**  
A: Bebas. Bisa "5D4N" atau "5 Days 4 Nights" atau cukup "5" (sistem auto-format).

**Q: Gambar wajib upload?**  
A: Tidak wajib, tapi sangat disarankan. Tanpa gambar pakai placeholder.

**Q: Bisa edit nanti?**  
A: Ya, bisa edit kapan saja via admin panel.

---

## 🚀 CARA INPUT DATA

### **Via Admin Panel:**
1. Login: http://localhost:8000/admin
2. Menu: Travel Management → Tours
3. Klik: New Tour
4. Isi form sesuai template di atas
5. Save

### **Via Seeder (Bulk):**
1. Edit: `database/seeders/TourSeeder.php`
2. Tambahkan data dalam format array
3. Run: `php artisan db:seed --class=TourSeeder`

---

**Siap terima data dari Anda!** 🎯  
Kirim dalam format bebas, saya akan organize dan input ke sistem.
