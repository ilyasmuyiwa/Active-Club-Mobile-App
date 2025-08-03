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

## Screen Implementation Status - COMPLETE! 🎉
1. ✅ Home Screen - Membership card, points, activities feed
2. ✅ Settings Screen - Notifications toggles, language, help & legal sections
3. ✅ FAQ Screen - Expandable Q&A with static data
4. ✅ Contact Screen - Customer support and get in touch options
5. ✅ Contact Form (Get in Touch) Screen - Subject, message, attachments form
6. ✅ Terms & Conditions Screen - Legal content display
7. ✅ Privacy Screen - Privacy policy content display
8. ✅ Notifications Screen - Achievement and points notifications list
9. ✅ Partners Screen - Loyalty partners with brand cards
10. ✅ Activities Screen - Complete activity history with earning/spending
11. ✅ Profile Screen - User profile management with edit functionality
12. ✅ User Level Screen - Level progression, points circle, tier system

**All 12 screens are now fully implemented!**

## Key Implementation Details
- **Home Screen**: Features gradient header with user profile, ActiveFit membership card showing points and rewards, barcode for scanning, and latest activities feed
- **Settings Screen**: Organized sections for notifications, help, and legal with proper toggles and navigation
- **FAQ Screen**: Collapsible question/answer format with icons and proper theming
- **Contact System**: Two-step contact flow - contact options screen leading to detailed contact form
- **Activities Screen**: Complete activity history with date grouping, earning/spending indicators, and proper icons
- **Partners Screen**: Loyalty partners display with brand cards and descriptive content
- **User Level Screen**: Comprehensive level system with progress tracking, points circle, tier visualization, and advancement rules
- **Forms**: Proper form validation, keyboard handling, and user feedback
- **Navigation**: Complete navigation flow between all screens with back buttons and proper routing
- **Static Data**: Currently using comprehensive mock data for all dynamic content across all screens
- **Design System**: Consistent theming following Adobe XD designs with #F1C229 (yellow) as primary color
- **Responsive**: All screens adapt to different device sizes and orientations
- **UI/UX**: Proper loading states, animations, and user feedback throughout the app