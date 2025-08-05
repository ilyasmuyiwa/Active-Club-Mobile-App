import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useUser } from '../contexts/UserContext';

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        // User is authenticated, go to tabs
        console.log('🔐 Index: User authenticated, redirecting to tabs');
        router.replace('/(tabs)');
      } else {
        // User is not authenticated, go to login
        console.log('🔐 Index: User not authenticated, redirecting to login');
        router.replace('/screens/LoginScreen');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading screen while checking authentication
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#F1C229" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
});