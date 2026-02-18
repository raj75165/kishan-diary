#!/bin/bash

# Kishan Diary APK Build Script
# This script helps you build an APK for testing

set -e

echo "🌾 Kishan Diary - APK Build Script"
echo "===================================="
echo ""

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "📦 EAS CLI not found. Installing..."
    npm install -g eas-cli
    echo "✅ EAS CLI installed successfully"
    echo ""
else
    echo "✅ EAS CLI is already installed"
    echo ""
fi

# Check if user is logged in
echo "🔐 Checking Expo authentication..."
if eas whoami &> /dev/null; then
    USER=$(eas whoami 2>&1)
    echo "✅ Logged in as: $USER"
    echo ""
else
    echo "❌ Not logged in to Expo"
    echo ""
    echo "Please login to continue:"
    eas login
    echo ""
fi

# Show build options
echo "📱 Select build type:"
echo "1. Preview APK (Recommended for testing)"
echo "2. Development APK (Debug build)"
echo "3. Production AAB (For Play Store)"
echo ""
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "🔨 Building Preview APK..."
        echo "This will take approximately 10-20 minutes."
        echo ""
        eas build --platform android --profile preview
        ;;
    2)
        echo ""
        echo "🔨 Building Development APK..."
        echo "This will take approximately 10-20 minutes."
        echo ""
        eas build --platform android --profile development
        ;;
    3)
        echo ""
        echo "🔨 Building Production AAB..."
        echo "This will take approximately 10-20 minutes."
        echo ""
        eas build --platform android --profile production
        ;;
    *)
        echo ""
        echo "❌ Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""
echo "✅ Build submitted successfully!"
echo ""
echo "📋 To check build status, run:"
echo "   npm run build:status"
echo ""
echo "📥 Once complete, download the APK from the link provided"
echo "   or from https://expo.dev"
echo ""
