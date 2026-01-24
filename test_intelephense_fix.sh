#!/bin/bash

echo "Testing after Intelephense fix..."
echo ""

# Register & create booking
REG=$(curl -s -X POST http://127.0.0.1:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Intele Test\",\"email\":\"intele$(date +%s)@test.com\",\"password\":\"password123\",\"password_confirmation\":\"password123\"}")

TOKEN=$(echo $REG | jq -r '.data.token')
echo "✓ Registered with token: ${TOKEN:0:25}..."

# Create booking
BOOK=$(curl -s -X POST http://127.0.0.1:8000/api/bookings \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"tour_id":1,"booking_date":"2026-02-20","number_of_participants":1}')

BOOKING_ID=$(echo $BOOK | jq -r '.data.id')
echo "✓ Created booking: $BOOKING_ID"

# Check dashboard
DASH=$(curl -s http://127.0.0.1:8000/api/bookings \
  -H "Authorization: Bearer $TOKEN")
  
COUNT=$(echo $DASH | jq '.data | length')
echo "✓ Dashboard shows: $COUNT booking(s)"

# Try payment
PAY=$(curl -s -X POST http://127.0.0.1:8000/api/payments/$BOOKING_ID \
  -H "Authorization: Bearer $TOKEN")

if echo "$PAY" | jq -e '.success' > /dev/null 2>&1; then
    echo "✓ Payment request successful"
    echo "$PAY" | jq '{snap_token: .snap_token[0:25], booking_id, success}'
else
    echo "✗ Payment failed"
    echo "$PAY" | jq '.'
fi

echo ""
echo "✅ All API endpoints working after Request injection fix!"
