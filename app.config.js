export default {
  expo: {
    name: 'Active Club',
    slug: 'active-club',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'activeclub',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: false,
      bundleIdentifier: 'com.tbg.loyalty',
      buildNumber: '1',
      infoPlist: {
        NSCameraUsageDescription: 'This app uses the camera to scan membership barcodes.',
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      // Environment variables accessible via expo-constants
      OTP_API_KEY: process.env.OTP_API_KEY || '6b1f1e3b0f9d4c9a9f2f7a93d1a4c5e6f88b7c0d5e9a1c2b3d4e5f60718293af',
      OTP_API_URL: process.env.OTP_API_URL || 'https://sportscorner.qa/rest/V1/otp',
      CAPILLARY_API_URL: process.env.CAPILLARY_API_URL || 'https://eu.api.capillarytech.com/v1.1',
    },
  },
};