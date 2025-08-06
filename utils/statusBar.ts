import { Platform, StatusBar } from 'react-native';
import Constants from 'expo-constants';

/**
 * Get the status bar height for the current platform
 * On Android, this includes the system status bar
 * On iOS, SafeAreaView typically handles this
 */
export const getStatusBarHeight = (): number => {
  if (Platform.OS === 'android') {
    // Use Expo Constants to get status bar height, fallback to StatusBar.currentHeight
    return Constants.statusBarHeight || StatusBar.currentHeight || 24;
  }
  
  // On iOS, SafeAreaView handles this automatically
  return 0;
};

/**
 * Get padding top for custom headers
 * Combines status bar height with additional padding
 */
export const getHeaderPaddingTop = (additionalPadding: number = 10): number => {
  return getStatusBarHeight() + additionalPadding;
};