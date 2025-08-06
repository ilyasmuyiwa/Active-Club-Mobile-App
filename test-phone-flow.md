# Phone Number Flow Test

## Current Implementation:

1. **LoginScreen** (`/screens/LoginScreen.tsx`):
   - User enters phone number (e.g., `+974 98988787`)
   - On valid number, saves cleaned version (`98988787`) to UserContext
   - Also passes full number via navigation params to OtpScreen

2. **OtpScreen** (`/screens/OtpScreen.tsx`):
   - Receives phone number from navigation params 
   - On successful OTP (12345), extracts mobile number and saves to UserContext again
   - Navigates to home screen

3. **HomeScreen** (`/screens/HomeScreen.tsx`):
   - Gets phone number from UserContext
   - Uses it for API calls (fallback to `98988787` if empty)
   - Monitors context changes with useEffect

## Expected Flow:
1. User enters `+974 12345678` in LoginScreen
2. LoginScreen saves `12345678` to context and navigates to OTP
3. OTP screen processes and confirms the number
4. HomeScreen gets `12345678` from context and uses it for API call

## Test Steps:
1. Run the app
2. Enter any valid Qatar number (8 digits after +974)
3. Enter OTP: 12345
4. Check console logs to verify:
   - ✅ LoginScreen saves number to context
   - ✅ OtpScreen receives and processes number
   - ✅ HomeScreen uses correct number for API call

## Console Log Pattern to Look For:
```
🚀 Login Screen: Also saving to context directly: 12345678
🔐 UserContext: Setting phone number: 12345678
📱 OTP Screen: Phone number received: +974 12345678
🏠 HomeScreen: Phone number context changed: 12345678
🏠 Using mobile number: 12345678
🔵 Making API call to: .../customer/get?mobile=12345678
```