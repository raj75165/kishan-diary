#!/bin/bash
# Post-create setup for Kishan Diary Codespace
set -e

echo ""
echo "🌾 Setting up Kishan Diary development environment..."
echo ""

# Install project dependencies
echo "📦 Installing project dependencies..."
npm ci
echo "✅ Dependencies installed."
echo ""

# Install EAS CLI globally
echo "📦 Installing EAS CLI..."
npm install -g eas-cli
echo "✅ EAS CLI installed: $(eas --version)"
echo ""

echo "✅ Kishan Diary environment is ready!"
echo ""
echo "Run 'eas login' to authenticate with your Expo account,"
echo "then 'npm run build:apk' to start an APK build."
echo ""
