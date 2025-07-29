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
│   └── _layout.tsx        # Root navigation setup
├── components/            # Reusable UI components
│   └── ui/               # Platform-specific UI components
├── constants/            # App constants (colors, etc.)
├── hooks/                # Custom React hooks
└── assets/               # Images and fonts
```