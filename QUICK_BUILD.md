# Quick APK Build Reference

## One-Time Setup

```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Login to Expo
eas login
```

## Build APK (Every Time)

```bash
# Build APK for testing
npm run build:apk
```

Wait 10-20 minutes, then download the APK from the provided link.

## Alternative Methods

### Using the Build Script
```bash
./build-apk.sh
```

### Using EAS Directly
```bash
eas build --platform android --profile preview
```

## Check Build Status

```bash
npm run build:status
```

## Install APK on Device

1. Download APK to your Android device
2. Open the APK file
3. Allow "Install from Unknown Sources" if prompted
4. Install and enjoy! 🎉

## Troubleshooting

### "EAS CLI not found"
Run: `npm install -g eas-cli`

### "Not logged in"
Run: `eas login`

### "Build failed"
Check credentials: `eas credentials`

### APK won't install
Enable "Unknown Sources" in Android settings

## More Information

See [APK_BUILD_GUIDE.md](APK_BUILD_GUIDE.md) for detailed documentation.
