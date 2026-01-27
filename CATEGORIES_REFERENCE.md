# 📦 CATEGORIES REFERENCE - FLYMORA TOUR PACKAGES

**Last Updated:** 27 Januari 2026  
**Total Categories:** 16  
**Status:** ✅ Active

---

## 📋 COMPLETE CATEGORY LIST

### 🎯 **Activity-Based Categories** (5)

1. **Adventure** - Thrilling outdoor adventures and expeditions
2. **Beach** - Relaxing beach and tropical island tours
3. **Cultural** - Cultural heritage and historical tours
4. **Mountain** - Mountain climbing and hiking tours
5. **City** - Urban city tours and sightseeing

### 🌏 **Country-Based Categories** (9)

6. **Thailand** - Explore the Land of Smiles - temples, beaches, and culture
7. **Malaysia** - Discover Malaysia - multicultural cities and natural wonders
8. **Singapore** - Experience Singapore - modern city-state and attractions
9. **China** - Explore ancient China - history, culture, and modern marvels
10. **Japan** - Discover Japan - tradition meets innovation
11. **Korea** - Experience Korea - K-culture, history, and modern Seoul
12. **Vietnam** - Explore Vietnam - rich history and stunning landscapes
13. **Turki** - Discover Turkey - where East meets West
14. **Hongkong** - Experience Hong Kong - dynamic city of contrasts

### ✨ **Special Categories** (2)

15. **Multi-Country** - Multi-destination tours across multiple countries
16. **Private Tour** - Exclusive private tours customized for you

---

## 🎯 CATEGORY USAGE GUIDELINES

### **For Tour Creation:**
- **Activity-Based** → Use when tour focuses on activity type
- **Country-Based** → Use when tour is country-specific
- **Multi-Country** → Use for tours covering 2+ countries
- **Private Tour** → Use for customizable private packages

### **Selection Priority:**
1. If single country → Use country category
2. If multiple countries → Use Multi-Country
3. If activity-focused → Use activity category
4. If fully customizable → Use Private Tour

---

## 📊 STATISTICS

- **Activity-Based:** 5 categories (31%)
- **Country-Based:** 9 categories (56%)
- **Special:** 2 categories (13%)
- **Total:** 16 categories

---

## 🚀 IMPLEMENTATION

**Database Table:** `categories`  
**Seeder:** `CategorySeeder.php`  
**Command:** `php artisan db:seed --class=CategorySeeder`

All categories use `updateOrCreate()` to prevent duplicates.

---

## ✅ STATUS

- [x] All 16 categories created
- [x] Database seeded successfully
- [x] Available in admin panel
- [x] Ready for tour assignment
