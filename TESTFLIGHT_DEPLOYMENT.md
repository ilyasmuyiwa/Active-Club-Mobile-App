# TestFlight Deployment Guide for Active Club

## Prerequisites

1. **Apple Developer Account** ($99/year)
2. **Xcode** installed (latest version)
3. **Valid App ID** and **Provisioning Profile**
4. **App Store Connect** access

## Pre-Deployment Checklist

### 1. Remove/Disable Console Logs
- [ ] Replace all console.log with logger utility (see utils/logger.ts)
- [ ] Or use babel plugin to remove console statements in production

### 2. Update App Configuration

```bash
# Update app.json with production values
```

Check these in `app.json`:
- [ ] Update version number (e.g., "1.0.0")
- [ ] Update buildNumber/versionCode
- [ ] Set proper bundleIdentifier (e.g., "com.yourcompany.activeclub")
- [ ] Add iOS specific config

### 3. Configure iOS Settings

Add to `app.json`:
```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.yourcompany.activeclub",
      "buildNumber": "1",
      "supportsTablet": false,
      "infoPlist": {
        "NSCameraUsageDescription": "This app uses the camera to scan barcodes.",
        "ITSAppUsesNonExemptEncryption": false
      }
    }
  }
}
```

## Build Process

### Option 1: Using EAS Build (Recommended)

1. **Install EAS CLI**
```bash
npm install -g eas-cli
```

2. **Login to Expo**
```bash
eas login
```

3. **Configure EAS**
```bash
eas build:configure
```

4. **Create eas.json** (if not exists)
```json
{
  "cli": {
    "version": ">= 5.9.1"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "ios": {
        "buildConfiguration": "Release"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

5. **Build for iOS**
```bash
# For TestFlight
eas build --platform ios --profile production

# Or for internal testing first
eas build --platform ios --profile preview
```

6. **Submit to TestFlight**
```bash
eas submit -p ios
```

### Option 2: Local Build with Xcode

1. **Prebuild iOS project**
```bash
npx expo prebuild --platform ios
```

2. **Install iOS dependencies**
```bash
cd ios && pod install && cd ..
```

3. **Open in Xcode**
```bash
open ios/ActiveClub.xcworkspace
```

4. **In Xcode:**
- Select your team in Signing & Capabilities
- Set Bundle Identifier
- Select "Any iOS Device" as build target
- Product → Archive
- Distribute App → App Store Connect → Upload

## Environment Variables

Create `.env.production` for production API endpoints:
```bash
API_BASE_URL=https://api.production.com
CAPILLARY_AUTH_USERNAME=prod_username
CAPILLARY_AUTH_PASSWORD=prod_password
```

## Final Steps Before Upload

1. **Test on real device**
```bash
npx expo run:ios --device
```

2. **Check for errors**
```bash
npm run lint
```

3. **Update App Store Information**
- App description
- Screenshots (6.5", 5.5" required)
- App icon (1024x1024)
- Keywords
- Category

## TestFlight Setup

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Select your app
3. Go to TestFlight tab
4. Add internal/external testers
5. Submit for Beta App Review (external testers)

## Common Issues

### "Missing Push Notification Entitlement"
- Add push notification capability in Xcode even if not using

### "Invalid Binary"
- Check provisioning profile matches App ID
- Ensure all required device permissions are declared

### Build Size Too Large
- Use `expo-updates` for OTA updates
- Optimize images and assets

## Post-Deployment

1. Monitor crash reports in App Store Connect
2. Respond to tester feedback
3. Plan iterations based on testing

## Useful Commands

```bash
# Check bundle size
npx expo export --platform ios --dump-sourcemap

# Validate before submission
npx expo doctor

# Clear caches if having issues
npx expo start --clear
watchman watch-del-all
rm -rf node_modules
npm install
```