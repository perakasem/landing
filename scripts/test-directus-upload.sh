#!/bin/bash

# Test Directus File Upload Configuration
# This script tests if Directus is properly configured to use R2

echo "🧪 Testing Directus File Upload Configuration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Configuration (update these)
DIRECTUS_URL="https://cms.perakasem.com"
DIRECTUS_TOKEN="your-admin-token-here"

echo "📝 Step 1: Check Directus server info"
curl -s "$DIRECTUS_URL/server/info" | jq '.'

echo ""
echo "📝 Step 2: List recent files"
curl -s -H "Authorization: Bearer $DIRECTUS_TOKEN" \
  "$DIRECTUS_URL/files?limit=3&sort=-uploaded_on" | jq '.data[] | {id, filename_download, storage}'

echo ""
echo "💡 What to look for:"
echo "   - storage field should be 'cloudflare', not 'local'"
echo "   - If storage is 'local', R2 is not configured properly"
echo ""
