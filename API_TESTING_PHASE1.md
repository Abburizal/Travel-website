# API Testing Guide - Phase 1 Complete

**Date**: January 24, 2026  
**Status**: ✅ PHASE 1 COMPLETE  
**Latest Commits**: 
- 447f347 - Security & Concurrency Fixes
- 25c7bde - Sanctum Authentication Implementation

---

## 📋 What's Implemented

### 1. ✅ Security Patches (Fixed)
- User spoofing vulnerability closed
- Database transaction + row locking for concurrency
- Config externalization

### 2. ✅ Midtrans Payment Service (Live)
- createSnapTransaction() method
- verifyPayment() method

### 3. ✅ Laravel Sanctum Authentication (NEW)
- Register endpoint
- Login endpoint
- Protected routes with token auth
- Token refresh mechanism

---

## 🧪 API TESTING - Complete Workflow

### **STEP 1: Register New User**

**Endpoint**: `POST /api/auth/register`

**Request**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123",
  "password_confirmation": "SecurePassword123",
  "phone": "08123456789"
}
```

**cURL Command**:
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePassword123",
    "password_confirmation": "SecurePassword123",
    "phone": "08123456789"
  }'
```

**Success Response** (201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "08123456789",
      "email_verified_at": null,
      "created_at": "2026-01-24T09:45:00.000000Z",
      "updated_at": "2026-01-24T09:45:00.000000Z"
    },
    "token": "1|abc123def456ghi789jkl012mno345pqr678stu901vwx234yz"
  }
}
```

**⚠️ WHAT YOU NEED TO CHECK**:
- ✅ User berhasil dibuat di database
- ✅ Token berhasil generated
- ⚠️ Save token untuk step berikutnya

---

### **STEP 2: Login Existing User**

**Endpoint**: `POST /api/auth/login`

**Request**:
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**cURL Command**:
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123"
  }'
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "08123456789",
      "email_verified_at": null,
      "created_at": "2026-01-24T09:45:00.000000Z",
      "updated_at": "2026-01-24T09:45:00.000000Z"
    },
    "token": "2|xyz789abc456def123ghi678jkl901mno345pqr678stu901vwx234yz"
  }
}
```

**⚠️ WHAT YOU NEED TO CHECK**:
- ✅ Token baru di-generate
- ✅ Token berbeda dari registrasi (untuk test refresh-token nanti)

---

### **STEP 3: Get Current User Info (Protected)**

**Endpoint**: `GET /api/auth/me`

**Headers** (IMPORTANT):
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**cURL Command**:
```bash
curl -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer 2|xyz789abc456def123ghi678jkl901mno345pqr678stu901vwx234yz" \
  -H "Content-Type: application/json"
```

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "08123456789",
    "email_verified_at": null,
    "created_at": "2026-01-24T09:45:00.000000Z",
    "updated_at": "2026-01-24T09:45:00.000000Z"
  }
}
```

**Error Response - No Token** (401):
```json
{
  "message": "Unauthenticated"
}
```

**⚠️ WHAT YOU NEED TO CHECK**:
- ✅ Token authentication working
- ✅ User data returned correctly
- ✅ Without token header → 401 error

---

### **STEP 4: Get Available Tours (Public)**

**Endpoint**: `GET /api/tours`

**cURL Command**:
```bash
curl -X GET http://localhost:8000/api/tours \
  -H "Content-Type: application/json"
```

**Sample Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Bali 3D2N Adventure",
      "description": "Jelajahi keindahan Bali",
      "destination": "Bali",
      "price": "299.99",
      "max_participants": 20,
      "booked_participants": 5,
      "available_seats": 15,
      "duration": "3 days",
      "start_date": "2026-02-01T00:00:00.000000Z",
      "end_date": "2026-02-03T23:59:59.000000Z",
      "category_id": 1,
      "created_at": "2026-01-24T09:00:00.000000Z",
      "updated_at": "2026-01-24T09:00:00.000000Z"
    }
  ]
}
```

**⚠️ WHAT YOU NEED TO CHECK**:
- ✅ Tours list returned
- ✅ available_seats calculated correctly (max_participants - booked_participants)
- ✅ No token needed for this endpoint

---

### **STEP 5: Create Booking (Protected)**

**Endpoint**: `POST /api/bookings`

**Headers** (REQUIRED):
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Request Body**:
```json
{
  "tour_id": 1,
  "booking_date": "2026-02-01",
  "number_of_participants": 2
}
```

**cURL Command**:
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

**Success Response** (201):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "tour_id": 1,
    "user_id": 1,
    "booking_date": "2026-02-01",
    "number_of_participants": 2,
    "total_price": "599.98",
    "status": "pending",
    "expired_at": "2026-01-24T10:15:00.000000Z",
    "created_at": "2026-01-24T09:45:00.000000Z",
    "updated_at": "2026-01-24T09:45:00.000000Z"
  },
  "expired_at": "2026-01-24T10:15:00.000000Z",
  "remaining_seconds": 1800,
  "available_seats": 13,
  "message": "Booking created successfully. Payment required within 30 minutes."
}
```

**Error Response - Not Authenticated** (401):
```json
{
  "message": "Unauthenticated"
}
```

**Error Response - Overbooking** (500):
```json
{
  "success": false,
  "message": "Not enough seats available. Available: 5, Requested: 10"
}
```

**⚠️ WHAT YOU NEED TO CHECK**:
- ✅ Token authentication working (without token → 401)
- ✅ Booking created dengan user_id dari auth()->id() (BUKAN dari request)
- ✅ Status adalah 'pending'
- ✅ expired_at set ke 30 minutes from now
- ✅ total_price = tour.price * number_of_participants
- ✅ Overbooking prevention working

---

### **STEP 6: Initiate Payment (Protected)**

**Endpoint**: `POST /api/payments/{booking_id}`

**Headers**:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**cURL Command**:
```bash
curl -X POST http://localhost:8000/api/payments/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

**Success Response** (200):
```json
{
  "success": true,
  "snap_token": "01234567890abcdefghij",
  "booking_id": 1,
  "order_id": "BOOKING-1-1706079900",
  "gross_amount": 599
}
```

**⚠️ WHAT YOU NEED TO CHECK**:
- ✅ snap_token generated (untuk Midtrans Snap.js di frontend)
- ✅ order_id format: BOOKING-{booking_id}-{timestamp}
- ✅ gross_amount = total_price (dalam integer)

---

### **STEP 7: Refresh Token (Protected)**

**Endpoint**: `POST /api/auth/refresh-token`

**Headers**:
```
Authorization: Bearer CURRENT_TOKEN
```

**cURL Command**:
```bash
curl -X POST http://localhost:8000/api/auth/refresh-token \
  -H "Authorization: Bearer YOUR_CURRENT_TOKEN" \
  -H "Content-Type: application/json"
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "08123456789",
      "email_verified_at": null,
      "created_at": "2026-01-24T09:45:00.000000Z",
      "updated_at": "2026-01-24T09:45:00.000000Z"
    },
    "token": "3|new_token_generated_here"
  }
}
```

**⚠️ WHAT YOU NEED TO CHECK**:
- ✅ New token generated
- ✅ Old token invalidated (cannot use anymore)
- ✅ User data returned with new token

---

### **STEP 8: Logout (Protected)**

**Endpoint**: `POST /api/auth/logout`

**Headers**:
```
Authorization: Bearer YOUR_TOKEN
```

**cURL Command**:
```bash
curl -X POST http://localhost:8000/api/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Logout successful"
}
```

**Try using same token again**:
```bash
curl -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer YOUR_OLD_TOKEN"
```

**Error Response** (401):
```json
{
  "message": "Unauthenticated"
}
```

**⚠️ WHAT YOU NEED TO CHECK**:
- ✅ Token dihapus dari database
- ✅ Token tidak bisa digunakan lagi setelah logout

---

## 🔐 Security Features Verified

### ✅ User Spoofing Prevention
- **Before Fix**: `user_id` bisa dari request input
- **After Fix**: `user_id` selalu dari `auth()->id()` (authenticated user)
- **Test**: Register user A, login, create booking → booking harus user_id = A (bukan bisa di-hack jadi user B)

### ✅ Race Condition Prevention
- **Scenario**: 2 users create booking untuk tour dengan 5 kursi kosong, masing-masing booking 5 kursi
- **Expected**: Hanya 1 yang sukses, 1 lagi dapat error "Not enough seats"
- **Implementation**: DB::transaction + lockForUpdate()

### ✅ Token-Based Authentication
- **Protected Routes**: /bookings, /payments, /auth/me
- **Public Routes**: /tours, /auth/register, /auth/login
- **Validation**: Bearer token required in Authorization header

---

## 📊 Database Schema Verification

**⚠️ PERIKSA DATA INI DI DATABASE**:

```sql
-- Check users table
SELECT * FROM users;
-- Expected: user dengan phone field

-- Check api_tokens table (Sanctum)
SELECT * FROM personal_access_tokens;
-- Expected: tokens untuk setiap login/register

-- Check bookings
SELECT * FROM bookings;
-- Expected: booking dengan user_id = authenticated user (not spoofed)

-- Check tours
SELECT * FROM tours;
-- Expected: booked_participants accurate
```

---

## 🚀 Next Steps (Phase 2)

Once you verify all endpoints working:

1. **Frontend Setup** (Next.js/React)
   - Setup project dengan Vite/Next.js
   - Create Login/Register pages
   - Create Booking form

2. **Midtrans Integration**
   - Add Snap.js library
   - Create payment popup modal
   - Handle success/error callbacks

3. **Webhook Setup**
   - Update MidtransCallbackController
   - Auto-update booking status setelah payment

---

## ⚠️ Important Notes

1. **Token Format**:
   ```
   Authorization: Bearer [number]|[long_string]
   Example: Bearer 1|abc123def456ghi789jkl012mno345pqr
   ```

2. **Expiry Time**:
   - Booking expires in 30 minutes
   - `expired_at` field shows exact expiry timestamp
   - `remaining_seconds` shows time left

3. **SQLite Limitation**:
   - Current setup uses SQLite (for development)
   - For production: use MySQL/PostgreSQL
   - See steps in roadmap to migrate

4. **Midtrans Sandbox**:
   - Current credentials are sandbox (testing)
   - For production: update .env with live credentials
   - Test cards available at Midtrans documentation

---

## 📞 Troubleshooting

**Q: 401 Unauthenticated error**
A: Check token format in Authorization header. Should be: `Bearer [token]`

**Q: Token doesn't work after logout**
A: This is expected! Token is deleted from database.

**Q: Can't create booking, says "Tour not found"**
A: Make sure tour exists. Check tours list first.

**Q: Overbooking happens despite fixes**
A: Verify DB is using transactions. Check MySQL/PostgreSQL setup (SQLite may have issues).

---

**Status**: ✅ Ready for Phase 2 Frontend Implementation

