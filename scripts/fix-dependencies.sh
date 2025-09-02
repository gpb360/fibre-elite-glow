#!/bin/bash

# Fix Dependency Resolution Script
# This script will resolve the pnpm lockfile issue

echo "🔧 Fixing dependency resolution..."

# Remove any remaining lockfiles
echo "📋 Cleaning old lockfiles..."
rm -f pnpm-lock.yaml
rm -f bun.lockb
rm -f package-lock.json
rm -f yarn.lock

# Clear pnpm cache
echo "🗑️  Clearing pnpm cache..."
pnpm store prune

# Install dependencies with fresh lockfile
echo "📦 Installing dependencies..."
pnpm install --no-frozen-lockfile

echo "✅ Dependencies resolved successfully!"
echo ""
echo "🚀 Next steps:"
echo "1. Your admin email system is ready!"
echo "2. Configure Stripe webhook at: https://lebve.netlify.app/.netlify/functions/stripe-webhook"
echo "3. Add environment variables in Netlify"
echo "4. Test with a purchase"
echo ""
echo "📖 Full instructions: ADMIN_EMAIL_SETUP.md"