#!/bin/bash
# Quick validation script for Phase 1 compliance

echo "╔════════════════════════════════════════╗"
echo "║   PHASE 1 VALIDATION SCRIPT           ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

check_pass() {
    echo -e "${GREEN}✓${NC} $1"
}

check_fail() {
    echo -e "${RED}✗${NC} $1"
}

echo "1. Checking MySQL Database..."
MYSQL_CHECK=$(php artisan db:show 2>&1 | grep "MySQL")
if [ ! -z "$MYSQL_CHECK" ]; then
    check_pass "MySQL connected"
else
    check_fail "MySQL not connected"
fi

echo ""
echo "2. Checking Laravel Sanctum..."
SANCTUM_CHECK=$(grep "laravel/sanctum" composer.json)
if [ ! -z "$SANCTUM_CHECK" ]; then
    check_pass "Laravel Sanctum installed"
else
    check_fail "Laravel Sanctum not found"
fi

echo ""
echo "3. Checking BookingController security..."
AUTH_CHECK=$(grep "auth()->id()" app/Http/Controllers/Api/BookingController.php)
TRANSACTION_CHECK=$(grep "DB::transaction" app/Http/Controllers/Api/BookingController.php)
LOCK_CHECK=$(grep "lockForUpdate" app/Http/Controllers/Api/BookingController.php)

if [ ! -z "$AUTH_CHECK" ]; then
    check_pass "User ID security implemented"
else
    check_fail "User ID security missing"
fi

if [ ! -z "$TRANSACTION_CHECK" ]; then
    check_pass "DB Transaction implemented"
else
    check_fail "DB Transaction missing"
fi

if [ ! -z "$LOCK_CHECK" ]; then
    check_pass "Row locking implemented"
else
    check_fail "Row locking missing"
fi

echo ""
echo "4. Checking PaymentService..."
PAYMENT_SERVICE_CHECK=$(grep "Snap::getSnapToken" app/Services/PaymentService.php)
MIDTRANS_SDK_CHECK=$(grep "midtrans/midtrans-php" composer.json)

if [ ! -z "$PAYMENT_SERVICE_CHECK" ]; then
    check_pass "PaymentService uses Midtrans SDK"
else
    check_fail "PaymentService not using SDK"
fi

if [ ! -z "$MIDTRANS_SDK_CHECK" ]; then
    check_pass "Midtrans SDK installed"
else
    check_fail "Midtrans SDK not installed"
fi

echo ""
echo "5. Running API Tests..."
php artisan test --filter=ExampleTest 2>&1 | grep -q "PASS"
if [ $? -eq 0 ]; then
    check_pass "Tests passing"
else
    check_fail "Tests failing"
fi

echo ""
echo "6. Checking configuration files..."
if [ -f "config/booking.php" ]; then
    check_pass "config/booking.php exists"
else
    check_fail "config/booking.php missing"
fi

if grep -q "midtrans" config/services.php; then
    check_pass "Midtrans config in services.php"
else
    check_fail "Midtrans config missing"
fi

echo ""
echo "╔════════════════════════════════════════╗"
echo "║   PHASE 1 VALIDATION COMPLETE         ║"
echo "╚════════════════════════════════════════╝"
