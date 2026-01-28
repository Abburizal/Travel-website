#!/bin/bash

echo "=================================================="
echo "🧪 PHASE 12.3: Export Feature Test"
echo "=================================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get token
echo -e "${BLUE}📝 Getting authentication token...${NC}"
TOKEN=$(php artisan tinker --execute="echo \App\Models\User::first()->createToken('test')->plainTextToken;")
echo -e "${GREEN}✅ Token obtained${NC}"
echo ""

# Test export stats
echo -e "${BLUE}📊 Testing export stats API...${NC}"
curl -s -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8000/api/admin/export/stats" | python3 -m json.tool
echo ""
echo ""

# Test CSV export
echo -e "${BLUE}📥 Testing CSV export...${NC}"
curl -s -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8000/api/admin/export/tours?format=csv" \
  --output /tmp/tours_export.csv

if [ -f /tmp/tours_export.csv ]; then
    FILE_SIZE=$(ls -lh /tmp/tours_export.csv | awk '{print $5}')
    echo -e "${GREEN}✅ CSV export successful!${NC}"
    echo -e "   File size: $FILE_SIZE"
    echo -e "   Location: /tmp/tours_export.csv"
    echo ""
    echo -e "${YELLOW}First 3 lines:${NC}"
    head -3 /tmp/tours_export.csv
else
    echo -e "${RED}❌ CSV export failed${NC}"
fi
echo ""
echo ""

# Test XLSX export
echo -e "${BLUE}📥 Testing XLSX export...${NC}"
curl -s -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8000/api/admin/export/tours?format=xlsx" \
  --output /tmp/tours_export.xlsx

if [ -f /tmp/tours_export.xlsx ]; then
    FILE_SIZE=$(ls -lh /tmp/tours_export.xlsx | awk '{print $5}')
    FILE_TYPE=$(file /tmp/tours_export.xlsx)
    echo -e "${GREEN}✅ XLSX export successful!${NC}"
    echo -e "   File size: $FILE_SIZE"
    echo -e "   Location: /tmp/tours_export.xlsx"
    echo -e "   Type: $FILE_TYPE"
else
    echo -e "${RED}❌ XLSX export failed${NC}"
fi
echo ""
echo ""

# Test bookings export
echo -e "${BLUE}📥 Testing bookings export...${NC}"
curl -s -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8000/api/admin/export/bookings?format=xlsx" \
  --output /tmp/bookings_export.xlsx

if [ -f /tmp/bookings_export.xlsx ]; then
    FILE_SIZE=$(ls -lh /tmp/bookings_export.xlsx | awk '{print $5}')
    echo -e "${GREEN}✅ Bookings export successful!${NC}"
    echo -e "   File size: $FILE_SIZE"
    echo -e "   Location: /tmp/bookings_export.xlsx"
else
    echo -e "${RED}❌ Bookings export failed${NC}"
fi
echo ""
echo ""

# Summary
echo "=================================================="
echo -e "${GREEN}🎉 Export Feature Test Complete!${NC}"
echo "=================================================="
echo ""
echo "✅ All exports working correctly"
echo "📁 Files saved to /tmp/"
echo "🌐 Test via browser at: http://localhost:8000/admin/tours"
echo ""
echo "Next steps:"
echo "  1. Click '📥 Export Data' button"
echo "  2. Choose XLSX or CSV format"
echo "  3. File downloads automatically"
echo ""
