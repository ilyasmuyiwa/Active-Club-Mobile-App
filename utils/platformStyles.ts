import { Platform, StatusBar } from 'react-native';

export const getStatusBarHeight = () => {
  return Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;
};

export const getSafeAreaPadding = () => {
  return {
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0,
  };
};