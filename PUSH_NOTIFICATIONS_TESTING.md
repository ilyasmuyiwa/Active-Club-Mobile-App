# Push Notifications Testing Guide

## Overview
This guide helps you test the complete push notification flow in the Active Club app.

## Prerequisites
1. Physical device (iOS/Android) - push notifications don't work on simulators
2. Active Club app installed and logged in
3. User must be authenticated with a valid mobile number

## Testing Flow

### 1. Initial Setup Test
1. **Install and run the app** on a physical device
2. **Login** with a valid mobile number
3. **Check console logs** for these messages:
   ```
   🔔 UserContext: Initializing push notifications for: [phone_number]
   🔔 UserContext: Push notifications initialized successfully
   ```
4. **Allow notification permissions** when prompted

### 2. Token Registration Test
1. After successful login, check if push token was registered:
   ```bash
   # Check server logs for this API call
   POST https://sportscorner.qa/rest/V1/push-notification/register
   ```
2. The request should contain:
   ```json
   {
     "mobile": "97470577110",
     "pushToken": "ExponentPushToken[actual-token-from-expo]",
     "deviceType": "ios" // or "android"
   }
   ```

### 3. Webhook Simulation Test
Use this curl command to simulate a Capillary webhook and trigger a test notification:

```bash
# Test notification for points earned
curl -X POST https://sportscorner.qa/pushnotification/webhook/capillary \
  -H "Content-Type: application/json" \
  -d '{
    "eventName": "pointsIssued",
    "data": {
      "mobile": "97470577110",
      "points": 50,
      "transactionAmount": 500,
      "storeName": "Sports Corner Mall",
      "message": "You earned 50 points! 🎉"
    }
  }'
```

### 4. Notification Types to Test

#### Points Earned Notification
```bash
curl -X POST https://sportscorner.qa/pushnotification/webhook/capillary \
  -H "Content-Type: application/json" \
  -d '{
    "eventName": "pointsIssued",
    "data": {
      "mobile": "97470577110",
      "type": "points_earned",
      "points": 50,
      "message": "You earned 50 points at Sports Corner! 🎉"
    }
  }'
```
**Expected**: Notification shows, tapping navigates to Activities screen

#### Level Up Notification
```bash
curl -X POST https://sportscorner.qa/pushnotification/webhook/capillary \
  -H "Content-Type: application/json" \
  -d '{
    "eventName": "levelUp",
    "data": {
      "mobile": "97470577110",
      "type": "level_up",
      "newLevel": "Gold",
      "message": "Congratulations! You reached Gold level! 🌟"
    }
  }'
```
**Expected**: Notification shows, tapping navigates to User Level screen

#### Partner Offer Notification
```bash
curl -X POST https://sportscorner.qa/pushnotification/webhook/capillary \
  -H "Content-Type: application/json" \
  -d '{
    "eventName": "partnerOffer",
    "data": {
      "mobile": "97470577110",
      "type": "partner_offer",
      "partner": "Nike",
      "message": "Special offer from Nike - 20% off! 🛍️"
    }
  }'
```
**Expected**: Notification shows, tapping navigates to Partners screen

### 5. Navigation Testing
1. **Send test notification** using curl commands above
2. **Receive notification** on device
3. **Tap notification** when app is closed/background
4. **Verify navigation** to correct screen:
   - `points_earned` → Activities tab
   - `level_up` → User Level screen
   - `partner_offer` → Partners tab
   - `general` or no type → Notifications tab

### 6. Logout Cleanup Test
1. **Logout** from the app
2. **Check console logs** for:
   ```
   🔔 UserContext: Cleaning up push notifications
   ```
3. **Verify** push token is removed from local storage
4. **Test** that notifications are no longer received after logout

## Troubleshooting

### Common Issues

#### 1. No Notification Received
- Check device notification settings
- Verify app has notification permissions
- Check if push token was registered successfully
- Verify webhook payload format

#### 2. Permission Denied
- Go to device Settings → Active Club → Notifications
- Enable all notification types
- Restart the app

#### 3. Navigation Not Working
- Check console logs for navigation errors
- Verify expo-router is properly configured
- Test with different notification types

#### 4. Registration Failed
- Check network connection
- Verify API endpoint is accessible
- Check server logs for registration errors

### Debug Console Logs

Look for these log patterns:

**Success Indicators:**
```
🔔 UserContext: Push notifications initialized successfully
🔔 Handling notification action with data: {...}
🔔 Navigating to activities screen
```

**Error Indicators:**
```
🔔 UserContext: Failed to initialize push notifications
🔔 Error handling notification navigation
```

## Testing Checklist

- [ ] App requests notification permissions on login
- [ ] Push token is generated and registered with backend
- [ ] Test notifications are received on device
- [ ] Tapping notifications navigates to correct screens
- [ ] Different notification types work (points, level up, partner)
- [ ] Cleanup works on logout
- [ ] Foreground notifications are handled properly
- [ ] Background/closed app notifications work
- [ ] Multiple notifications are handled correctly

## Production Testing

Once tested with curl commands, the real flow will be:
1. Customer makes purchase at Sports Corner
2. Capillary automatically sends webhook
3. Your backend processes and sends notification
4. Customer receives notification instantly

The curl commands are for testing only - in production, Capillary sends the webhooks automatically.