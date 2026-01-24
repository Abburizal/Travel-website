# Quick Test Commands - Copy & Paste Ready

## 🔧 Setup

```bash
# Terminal 1: Start Laravel Server
cd /Users/user/tripin-travel
php artisan serve
```

Wait for: `Server running on http://127.0.0.1:8000`

---

## ✅ Test Cases (Terminal 2)

### 1. Get All Tours (No auth needed)
```bash
curl http://localhost:8000/api/tours
```

**Expected**: 200 OK with array of 5 tours

---

### 2. Register New User
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123",
    "password_confirmation": "TestPass123",
    "phone": "08123456789"
  }'
```

**Expected**: 
- Status 201
- Contains: `"token": "1|abc..."` 
- ⚠️ **SAVE THIS TOKEN** for next steps

---

### 3. Login (Get new token)
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

**Expected**: 
- Status 200
- New token in response

---

### 4. Get Current User Info (Protected)
```bash
curl -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Replace `YOUR_TOKEN_HERE` with actual token

**Expected**: 200 OK with user data

---

### 5. Create Booking (Protected) - MAIN TEST
```bash
curl -X POST http://localhost:8000/api/bookings \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "tour_id": 1,
    "booking_date": "2026-02-01",
    "number_of_participants": 2
  }'
```

Replace `YOUR_TOKEN_HERE` with actual token

**Expected**: 
- Status 201
- ✅ `user_id` = your authenticated user (NOT spoofed!)
- ✅ `status` = "pending"
- ✅ `expired_at` = 30 minutes from now
- ✅ `total_price` = tour_price × 2

---

### 6. Test User Spoofing Prevention
```bash
curl -X POST http://localhost:8000/api/bookings \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "tour_id": 1,
    "booking_date": "2026-02-01",
    "number_of_participants": 1,
    "user_id": 999
  }'
```

**CRITICAL**: Even if you send `"user_id": 999`, 
the booking MUST be created with your authenticated user_id (NOT 999)

---

### 7. Get Bookings (Protected)
```bash
curl -X GET http://localhost:8000/api/bookings \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected**: Array of your bookings

---

### 8. Get Payment Token (Protected)
```bash
curl -X POST http://localhost:8000/api/payments/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

**Expected**: 
- Status 200
- Contains: `snap_token`, `order_id`, `gross_amount`

---

### 9. Refresh Token (Protected)
```bash
curl -X POST http://localhost:8000/api/auth/refresh-token \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

**Expected**: 
- New token in response
- Old token invalidated

---

### 10. Logout (Protected)
```bash
curl -X POST http://localhost:8000/api/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

**Expected**: 
- Status 200
- Try using same token again → should get 401 error

---

## 🗄️ Database Verification

### Check Users Table
```bash
sqlite3 database/database.sqlite "SELECT * FROM users;"
```

### Check Personal Access Tokens
```bash
sqlite3 database/database.sqlite "SELECT * FROM personal_access_tokens;"
```

### Check Bookings
```bash
sqlite3 database/database.sqlite "SELECT * FROM bookings;"
```

### Check Tours
```bash
sqlite3 database/database.sqlite "SELECT * FROM tours LIMIT 2;"
```

---

## 🛠️ Laravel Tinker Commands

```bash
php artisan tinker

# In tinker:
> User::all();
> Booking::all();
> Tour::all();
> exit
```

---

## 📋 Checklist Before Proceeding to Phase 2

- [ ] Server starts without errors
- [ ] Tours list endpoint returns 200
- [ ] User registration works, returns token
- [ ] Booking creation works, user_id is authenticated user
- [ ] Booking has 30-minute expiry
- [ ] Token-based auth working (401 without token)
- [ ] Cannot spoof user_id (sending different ID is ignored)
- [ ] Database tables populated correctly

---

## 🚨 Common Issues & Fixes

**Issue**: `"SQLSTATE[HY000]: General error: 1 unable to open database file"`
- Fix: Run `php artisan migrate`

**Issue**: `401 Unauthenticated` on protected route
- Fix: Add proper Authorization header: `Bearer TOKEN`

**Issue**: `Cannot POST /api/bookings`
- Fix: Check if server is running (Terminal 1)

**Issue**: Different user_id than authenticated
- Fix: Verify auth()->id() is being used in BookingController

---

## 📚 Full Documentation

- See `API_TESTING_PHASE1.md` for complete endpoint reference
- See `SECURITY_FIXES_SUMMARY.md` for security details
- See `PHASE1_COMPLETION.md` for overview

