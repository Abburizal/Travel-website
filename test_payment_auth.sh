#!/bin/bash

echo "Testing Payment Authorization Issue..."
echo ""

# Register & Login
echo "1. Register user..."
REG=$(curl -s -X POST http://127.0.0.1:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test Payment\",\"email\":\"payment$(date +%s)@test.com\",\"password\":\"password123\",\"password_confirmation\":\"password123\"}")

TOKEN=$(echo $REG | jq -r '.data.token')
USER_ID=$(echo $REG | jq -r '.data.user.id')
echo "✓ User ID: $USER_ID"
echo "✓ Token: ${TOKEN:0:30}..."
echo ""

# Create booking
echo "2. Create booking..."
BOOK=$(curl -s -X POST http://127.0.0.1:8000/api/bookings \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"tour_id":1,"booking_date":"2026-02-10","number_of_participants":2}')

BOOKING_ID=$(echo $BOOK | jq -r '.data.id')
BOOKING_USER_ID=$(echo $BOOK | jq -r '.data.user_id')
echo "✓ Booking ID: $BOOKING_ID"
echo "✓ Booking User ID: $BOOKING_USER_ID"
echo ""

# Get bookings list
echo "3. Check bookings list..."
curl -s http://127.0.0.1:8000/api/bookings \
  -H "Authorization: Bearer $TOKEN" | jq '.data[] | {id, user_id, status}'
echo ""

# Try to pay
echo "4. Try to pay for booking $BOOKING_ID..."
PAY=$(curl -s -X POST http://127.0.0.1:8000/api/payments/$BOOKING_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

echo "$PAY" | jq '.'
echo ""

# Check if error exists
if echo "$PAY" | grep -q "Unauthorized"; then
    echo "❌ ERROR: Unauthorized access detected!"
    echo ""
    echo "Checking logs..."
    tail -20 storage/logs/laravel.log | grep -A 3 "Payment request\|Unauthorized"
else
    echo "✅ Payment request successful!"
fi
