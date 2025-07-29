# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Active Club is a React Native mobile application built with Expo. The app uses TypeScript and follows Expo's file-based routing structure.

## Development Commands

### Installation and Setup
```bash
bun install  # Install dependencies using Bun
```

### Running the App
```bash
npx expo start      # Start development server with options for all platforms
npm run android     # Start on Android
npm run ios         # Start on iOS  
npm run web         # Start on web
```

### Code Quality
```bash
npm run lint        # Run ESLint
```

### Reset Project
```bash
npm run reset-project  # Move current code to app-example/ and create fresh app/
```

## Architecture

### Navigation Structure
- **Root Layout** (`app/_layout.tsx`): Implements Stack navigation with theme support
- **Tab Navigation** (`app/(tabs)/_layout.tsx`): Bottom tab navigation with Home and Explore tabs
- **File-based Routing**: All screens are defined in the `app/` directory

### Key Technical Patterns
- **Theming**: Dark/light mode support via `useColorScheme` hook and `ThemeProvider`
- **Components**: Reusable UI components in `components/` with themed variants
- **Platform-specific Code**: Uses `Platform.select()` for iOS/Android differences
- **Haptic Feedback**: Tab interactions include haptic feedback on supported devices

### Adobe XD Design Reference
The app has an Adobe XD prototype with the following screens planned:
- Home, Menu, FAQ, Contact Us, Get in Touch
- Terms and Conditions, Privacy Policy  
- Notifications, Partners, Activities
- Profile, Level Details

## Project Structure
```
active-club/
├── app/                    # Screen components using file-based routing
│   ├── (tabs)/            # Tab-based screens
│   ├── screens/           # Screen components
│   └── _layout.tsx        # Root navigation setup
├── components/            # Reusable UI components
│   ├── common/           # Shared components
│   └── ui/               # Platform-specific UI components
├── constants/            # App constants (colors, etc.)
├── hooks/                # Custom React hooks
├── assets/               # Images and fonts
└── active-club-screen-1/  # Design mockups (12 screens)
```

## Screen Implementation Status
1. ✅ Home Screen - Membership card, points, activities feed
2. ⏳ Settings Screen
3. ⏳ FAQ Screen
4. ⏳ Contact Screen
5. ⏳ Contact Form (Get in Touch) Screen
6. ⏳ Terms & Conditions Screen
7. ⏳ Privacy Screen
8. ⏳ Notifications Screen
9. ⏳ Partners Screen
10. ⏳ Activities Screen
11. ⏳ Profile Screen
12. ⏳ User Level Screen

## Key Implementation Details
- **Home Screen**: Features a gradient header with user profile, ActiveFit membership card showing points and rewards, barcode for scanning, and latest activities feed
- **Navigation**: Bottom tab navigation with Home, Activity, Partners, and Notifications
- **Static Data**: Currently using mock data for all dynamic content
- **Design System**: Following Adobe XD designs with #F5A623 (orange) as primary color