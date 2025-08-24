export default {
  expo: {
    name: 'Active Club',
    slug: 'active-club',
    version: '2.0.9',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'activeclub',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    splash: {
      image: './assets/images/icon.png',
      resizeMode: 'contain',
      backgroundColor: '#F1C229'
    },
    ios: {
      supportsTablet: false,
      bundleIdentifier: 'com.tbg.loyalty',
      buildNumber: '10',
      infoPlist: {
        NSCameraUsageDescription: 'This app uses the camera to scan membership barcodes.',
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      package: 'com.tbg.loyalty',
      versionCode: 4,
      icon: './assets/images/icon.png',
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#000000',
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
          image: './assets/images/icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#F1C229',
        },
      ],
      [
        'expo-notifications',
        {
          color: '#F1C229',
          defaultChannel: 'default',
        }
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
      eas: {
        projectId: '833c3db2-bec6-4f1e-b653-9765287a1188'
      }
    },
  },
};