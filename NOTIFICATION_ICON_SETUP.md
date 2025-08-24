# Notification Icon Setup Guide

## Current Issue
Push notifications are showing the Expo default icon instead of the Active Club icon.

## What I've Fixed
1. ✅ Updated `app.config.js` with notification icon configuration
2. ✅ Added Android-specific notification settings
3. ✅ Configured notification color to match Active Club branding (#F1C229)

## Configuration Added

### expo-notifications plugin:
```javascript
[
  'expo-notifications',
  {
    icon: './assets/images/icon.png',
    color: '#F1C229',
    defaultChannel: 'default',
    sounds: ['./assets/notification-sound.wav'],
  }
]
```

### Android notification settings:
```javascript
android: {
  notification: {
    icon: './assets/images/icon.png',
    color: '#F1C229',
  },
}
```

## Important: Rebuild Required

**The notification icon will only update after rebuilding the app.**

### For Development Builds:
```bash
# Android
npm run android

# iOS  
npm run ios
```

### For Production Builds:
```bash
# Android
npm run build:android

# iOS
npm run build:ios
```

## Optimal Notification Icon Requirements

### Android
- **Small icon**: 24x24dp, white/transparent PNG
- **Large icon**: App icon (shows in notification expanded view)
- **Color**: Used to tint the small icon (#F1C229 for Active Club)

### iOS
- Uses the app icon automatically
- No additional configuration needed

## Testing the Fix

1. **Rebuild the app** using one of the commands above
2. **Install the new build** on your device
3. **Login and trigger a test notification**:
   ```bash
   curl -X POST https://sportscorner.qa/pushnotification/webhook/capillary \
     -H "Content-Type: application/json" \
     -d '{
       "eventName": "pointsIssued",
       "data": {
         "mobile": "97470577110",
         "type": "points_earned",
         "points": 50,
         "message": "Testing notification icon! 🎉"
       }
     }'
   ```
4. **Check notification** - should now show Active Club icon

## Creating a Better Notification Icon (Optional)

For the best results on Android, you can create a dedicated notification icon:

### Requirements:
- 24x24dp PNG file
- White icon on transparent background
- Simple, recognizable design
- Save as `assets/images/notification-icon.png`

### Update config to use it:
```javascript
[
  'expo-notifications',
  {
    icon: './assets/images/notification-icon.png', // <- dedicated notification icon
    color: '#F1C229',
    defaultChannel: 'default',
  }
]
```

## Troubleshooting

### Icon Still Shows Expo Logo
- Ensure you've rebuilt the app after config changes
- Clear app data/cache before testing
- Verify the icon file exists and is accessible

### Icon Appears Corrupted
- Check icon file format (should be PNG)
- Verify icon dimensions are appropriate
- Ensure transparency is properly set

### Different Icon on Different Platforms
- iOS uses app icon automatically
- Android uses the configured notification icon
- This is normal platform behavior

## Next Steps

1. **Rebuild your app** with the new configuration
2. **Test notifications** to verify the Active Club icon appears
3. **Optionally create** a dedicated notification icon for better Android display

The notification icon configuration is now properly set up. After rebuilding, your push notifications will display the Active Club icon instead of the Expo default.