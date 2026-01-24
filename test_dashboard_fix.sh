#!/bin/bash

echo "Testing Dashboard Fix..."
echo ""

# Create 2 users
echo "1. Creating User 1..."
USER1=$(curl -s -X POST http://127.0.0.1:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"User One\",\"email\":\"user1_$(date +%s)@test.com\",\"password\":\"password123\",\"password_confirmation\":\"password123\"}")
TOKEN1=$(echo $USER1 | jq -r '.data.token')
USER1_ID=$(echo $USER1 | jq -r '.data.user.id')
echo "✓ User 1 ID: $USER1_ID"

echo ""
echo "2. Creating User 2..."
USER2=$(curl -s -X POST http://127.0.0.1:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"User Two\",\"email\":\"user2_$(date +%s)@test.com\",\"password\":\"password123\",\"password_confirmation\":\"password123\"}")
TOKEN2=$(echo $USER2 | jq -r '.data.token')
USER2_ID=$(echo $USER2 | jq -r '.data.user.id')
echo "✓ User 2 ID: $USER2_ID"

# User 1 creates booking
echo ""
echo "3. User 1 creates booking..."
BOOK1=$(curl -s -X POST http://127.0.0.1:8000/api/bookings \
  -H "Authorization: Bearer $TOKEN1" \
  -H "Content-Type: application/json" \
  -d '{"tour_id":1,"booking_date":"2026-02-15","number_of_participants":1}')
BOOKING1_ID=$(echo $BOOK1 | jq -r '.data.id')
echo "✓ Booking 1 ID: $BOOKING1_ID (by User $USER1_ID)"

# User 2 creates booking
echo ""
echo "4. User 2 creates booking..."
BOOK2=$(curl -s -X POST http://127.0.0.1:8000/api/bookings \
  -H "Authorization: Bearer $TOKEN2" \
  -H "Content-Type: application/json" \
  -d '{"tour_id":2,"booking_date":"2026-02-16","number_of_participants":2}')
BOOKING2_ID=$(echo $BOOK2 | jq -r '.data.id')
echo "✓ Booking 2 ID: $BOOKING2_ID (by User $USER2_ID)"

# User 1 checks dashboard - should only see own booking
echo ""
echo "5. User 1 checks dashboard (should only see booking $BOOKING1_ID)..."
DASH1=$(curl -s http://127.0.0.1:8000/api/bookings \
  -H "Authorization: Bearer $TOKEN1")
echo "$DASH1" | jq '.data | length as $count | "Found \($count) bookings"'
echo "$DASH1" | jq '.data[] | {id, user_id, status}'

# User 1 tries to pay own booking - should work
echo ""
echo "6. User 1 pays own booking..."
PAY1=$(curl -s -X POST http://127.0.0.1:8000/api/payments/$BOOKING1_ID \
  -H "Authorization: Bearer $TOKEN1")
if echo "$PAY1" | grep -q '"success":true'; then
    echo "✅ SUCCESS: User 1 can pay own booking"
else
    echo "❌ FAILED: User 1 cannot pay own booking"
    echo "$PAY1" | jq '.message'
fi

# User 1 tries to pay User 2's booking - should fail
echo ""
echo "7. User 1 tries to pay User 2's booking (should fail)..."
PAY_OTHER=$(curl -s -X POST http://127.0.0.1:8000/api/payments/$BOOKING2_ID \
  -H "Authorization: Bearer $TOKEN1")
if echo "$PAY_OTHER" | grep -q "Unauthorized"; then
    echo "✅ SUCCESS: Security check prevented unauthorized access"
else
    echo "❌ FAILED: User 1 could access User 2's booking!"
fi
echo "$PAY_OTHER" | jq '.message'

echo ""
echo "========================================="
echo "✅ Dashboard Fix Test Complete"
echo "========================================="
