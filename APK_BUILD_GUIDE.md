# APK Build Guide for Kishan Diary

This guide explains how to generate an APK file for testing the Kishan Diary app on Android devices.

## Prerequisites

Before you can build an APK, you need:

1. **Node.js** (v14 or higher) - Already installed
2. **EAS CLI** - Expo Application Services Command Line Interface
3. **Expo Account** - Free account at [expo.dev](https://expo.dev)

## Setup Instructions

### 1. Install EAS CLI (if not already installed)

```bash
npm install -g eas-cli
```

### 2. Login to Expo

```bash
eas login
```

Enter your Expo account credentials. If you don't have an account, create one at [expo.dev](https://expo.dev).

### 3. Configure Your Project

The project is already configured with `eas.json`. If you need to reconfigure:

```bash
eas build:configure
```

## Building APK

### Option 1: Build APK for Testing (Recommended)

This creates an APK that can be installed on any Android device for testing:

```bash
npm run build:apk
```

Or directly using EAS:

```bash
eas build --platform android --profile preview
```

**What happens:**
- Creates a standalone APK file
- Can be installed on any Android device
- Does not require Google Play Store
- Perfect for testing and sharing with testers

### Option 2: Build Development APK

For development builds with development client:

```bash
eas build --platform android --profile development
```

### Option 3: Build Production App Bundle

For Play Store submission:

```bash
npm run build:android
```

Or:

```bash
eas build --platform android --profile production
```

## Build Profiles

The project includes three build profiles in `eas.json`:

### 1. **preview** (Best for Testing)
- Output: APK file
- Distribution: Internal
- Can be installed directly on devices
- No Google Play Store required

### 2. **development**
- Output: Debug APK
- Includes development tools
- For active development

### 3. **production**
- Output: AAB (Android App Bundle)
- For Google Play Store submission
- Optimized and signed

## After Building

### 1. Wait for Build Completion

The build process takes 10-20 minutes. You can:
- Wait in the terminal
- Close terminal and check status later with: `eas build:list`
- Monitor on Expo dashboard: https://expo.dev

### 2. Download Your APK

Once the build completes:
- Download link will appear in terminal
- Also available on Expo dashboard
- APK will be available for 30 days

### 3. Install on Android Device

**Method 1: Direct Installation**
1. Download APK to your Android device
2. Open the APK file
3. Allow installation from unknown sources (if prompted)
4. Install and run

**Method 2: Using ADB**
```bash
adb install path/to/kishan-diary.apk
```

**Method 3: Share via QR Code**
- Expo provides a QR code for easy sharing
- Testers can scan and download directly

## Common Commands

### Check Build Status
```bash
eas build:list
```

### View Build Details
```bash
eas build:view [BUILD_ID]
```

### Cancel a Build
```bash
eas build:cancel [BUILD_ID]
```

### View Build Logs
```bash
eas build:view [BUILD_ID] --logs
```

## Troubleshooting

### Build Fails with "Invalid Package Name"
- Ensure `android.package` in `app.json` is properly set
- Format: `com.company.appname`
- Must be lowercase, no spaces

### Build Fails with "No Credentials"
First time building? Run:
```bash
eas credentials
```
Select "Android" and let EAS generate credentials for you.

### APK Won't Install on Device
1. Enable "Install from Unknown Sources" in Android settings
2. Ensure Android version is compatible (Android 5.0+)
3. Try clearing previous installation if updating

### Build Takes Too Long
- Normal build time: 10-20 minutes
- First build may take longer
- Check build queue: `eas build:list`

## App Signing

EAS automatically handles app signing:
- **Development/Preview**: Uses debug keystore
- **Production**: Uses release keystore (managed by EAS)

You can also use your own keystore:
```bash
eas credentials
```

## Distribution Options

### Internal Testing
- Use preview profile
- Share APK link with testers
- No approval process needed

### External Testing
- Use Google Play Console
- Upload AAB from production profile
- Set up internal/closed/open testing tracks

## APK Size Optimization

Current APK size is approximately 50-70 MB. To reduce:

1. **Remove unused dependencies**
2. **Enable Hermes** (already enabled with new architecture)
3. **Use ProGuard** (for production builds)
4. **Optimize images** in assets folder

## Security Notes

⚠️ **Important for Production:**
- Never commit keystore files to git
- Keep signing credentials secure
- Use EAS Secrets for sensitive data
- Enable app signing in Play Console

## Version Management

Update version before building:

**app.json:**
```json
{
  "expo": {
    "version": "1.0.0",
    "android": {
      "versionCode": 1
    }
  }
}
```

- `version`: Displayed to users (1.0.0, 1.1.0, etc.)
- `versionCode`: Must increment with each build (1, 2, 3, etc.)

## CI/CD Integration

To automate builds in CI/CD:

```bash
# Use EAS with non-interactive mode
EXPO_TOKEN=your_token eas build --platform android --profile preview --non-interactive
```

Get token from: https://expo.dev/accounts/[username]/settings/access-tokens

## Additional Resources

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Android App Signing](https://docs.expo.dev/app-signing/app-credentials/)
- [Distributing Apps](https://docs.expo.dev/build/internal-distribution/)
- [Expo Dashboard](https://expo.dev)

## Support

If you encounter issues:
1. Check [Expo Forums](https://forums.expo.dev/)
2. Review [EAS Build Troubleshooting](https://docs.expo.dev/build-reference/troubleshooting/)
3. Open an issue on GitHub

---

## Quick Start (TL;DR)

```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Login
eas login

# 3. Build APK for testing
npm run build:apk

# 4. Wait 10-20 minutes

# 5. Download and install on Android device
```

That's it! 🎉
