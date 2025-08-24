import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Clipboard,
  Alert,
  Platform,
} from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { IconSymbol } from '@/components/ui/IconSymbol';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface DebugInfo {
  pushToken: string | null;
  tokenType: string;
  environment: string;
  platform: string;
  deviceName: string | null;
  permissions: string;
  registrationStatus: string;
  timestamp: string;
  lastNotificationReceived: string | null;
  notificationCount: number;
}

export default function DebugPanel() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [isVisible, setIsVisible] = useState(false);
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Listen for notifications
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('🔔 Notification received:', notification);
      AsyncStorage.setItem('last_notification', JSON.stringify({
        title: notification.request.content.title,
        body: notification.request.content.body,
        timestamp: new Date().toISOString(),
      }));
      
      // Increment counter
      AsyncStorage.getItem('notification_count').then(count => {
        const newCount = (parseInt(count || '0') + 1).toString();
        AsyncStorage.setItem('notification_count', newCount);
      });
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('🔔 Notification response:', response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  const collectDebugInfo = async () => {
    setIsLoading(true);
    try {
      // Get push token
      let pushToken: string | null = null;
      let tokenType = 'Unknown';
      
      try {
        const token = await Notifications.getExpoPushTokenAsync({
          projectId: '833c3db2-bec6-4f1e-b653-9765287a1188',
        });
        pushToken = token.data;
        tokenType = pushToken?.startsWith('ExponentPushToken') ? 'Expo Token' : 'Native Token';
      } catch (error) {
        pushToken = `Error: ${error}`;
        tokenType = 'Failed';
      }

      // Check permissions
      const { status } = await Notifications.getPermissionsAsync();
      
      // Check stored token
      const storedToken = await AsyncStorage.getItem('push_token');
      const registrationStatus = storedToken ? 'Token Stored' : 'Not Stored';

      // Get notification history
      const lastNotificationData = await AsyncStorage.getItem('last_notification');
      const notificationCount = await AsyncStorage.getItem('notification_count');
      
      let lastNotificationReceived = null;
      if (lastNotificationData) {
        const notificationInfo = JSON.parse(lastNotificationData);
        lastNotificationReceived = `${notificationInfo.title} - ${new Date(notificationInfo.timestamp).toLocaleTimeString()}`;
      }

      const info: DebugInfo = {
        pushToken,
        tokenType,
        environment: __DEV__ ? 'Development' : 'Production',
        platform: Platform.OS,
        deviceName: Device.deviceName,
        permissions: status,
        registrationStatus,
        timestamp: new Date().toLocaleTimeString(),
        lastNotificationReceived: lastNotificationReceived || 'None received',
        notificationCount: parseInt(notificationCount || '0'),
      };

      setDebugInfo(info);
    } catch (error) {
      console.error('Error collecting debug info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
    Alert.alert('Copied!', 'Debug info copied to clipboard');
  };

  const formatDebugInfo = () => {
    if (!debugInfo) return '';
    
    return `
Active Club - Push Notification Debug Info
==========================================
Push Token: ${debugInfo.pushToken}
Token Type: ${debugInfo.tokenType}
Environment: ${debugInfo.environment}
Platform: ${debugInfo.platform}
Device: ${debugInfo.deviceName}
Permissions: ${debugInfo.permissions}
Registration: ${debugInfo.registrationStatus}
Notifications Received: ${debugInfo.notificationCount}
Last Notification: ${debugInfo.lastNotificationReceived}
Timestamp: ${debugInfo.timestamp}
==========================================
    `.trim();
  };

  if (!isVisible) {
    return (
      <TouchableOpacity
        style={[styles.debugToggle, { backgroundColor: colors.background }]}
        onPress={() => {
          setIsVisible(true);
          collectDebugInfo();
        }}
      >
        <Text style={[styles.debugToggleText, { color: colors.text }]}>🔧 Debug</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.debugPanel, { backgroundColor: colors.background }]}>
      <View style={[styles.debugHeader, { borderBottomColor: colors.text + '20' }]}>
        <Text style={[styles.debugTitle, { color: colors.text }]}>🔔 Push Debug Panel</Text>
        <TouchableOpacity
          onPress={() => setIsVisible(false)}
          style={styles.closeButton}
        >
          <IconSymbol name="xmark" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.debugContent}>
        {isLoading ? (
          <Text style={[styles.loadingText, { color: colors.text }]}>Collecting debug info...</Text>
        ) : debugInfo ? (
          <>
            <View style={styles.debugSection}>
              <Text style={[styles.sectionTitle, { color: '#F1C229' }]}>Push Token</Text>
              <Text style={[styles.debugText, { color: colors.text }]}>
                {debugInfo.pushToken}
              </Text>
              <Text style={[styles.statusText, { 
                color: debugInfo.tokenType === 'Expo Token' ? '#4CAF50' : '#FF6B6B' 
              }]}>
                Type: {debugInfo.tokenType}
              </Text>
            </View>

            <View style={styles.debugSection}>
              <Text style={[styles.sectionTitle, { color: '#F1C229' }]}>Environment</Text>
              <Text style={[styles.debugText, { color: colors.text }]}>
                Environment: {debugInfo.environment}
              </Text>
              <Text style={[styles.debugText, { color: colors.text }]}>
                Platform: {debugInfo.platform}
              </Text>
              <Text style={[styles.debugText, { color: colors.text }]}>
                Device: {debugInfo.deviceName}
              </Text>
            </View>

            <View style={styles.debugSection}>
              <Text style={[styles.sectionTitle, { color: '#F1C229' }]}>Permissions & Status</Text>
              <Text style={[styles.statusText, { 
                color: debugInfo.permissions === 'granted' ? '#4CAF50' : '#FF6B6B' 
              }]}>
                Permissions: {debugInfo.permissions}
              </Text>
              <Text style={[styles.statusText, { 
                color: debugInfo.registrationStatus === 'Token Stored' ? '#4CAF50' : '#FF6B6B' 
              }]}>
                Registration: {debugInfo.registrationStatus}
              </Text>
            </View>

            <View style={styles.debugSection}>
              <Text style={[styles.sectionTitle, { color: '#F1C229' }]}>Notification Tracking</Text>
              <Text style={[styles.statusText, { 
                color: debugInfo.notificationCount > 0 ? '#4CAF50' : '#FF6B6B' 
              }]}>
                Notifications Received: {debugInfo.notificationCount}
              </Text>
              <Text style={[styles.debugText, { color: colors.text }]}>
                Last Notification: {debugInfo.lastNotificationReceived}
              </Text>
            </View>

            <View style={styles.debugSection}>
              <Text style={[styles.sectionTitle, { color: '#F1C229' }]}>Actions</Text>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#F1C229' }]}
                onPress={collectDebugInfo}
              >
                <Text style={styles.actionButtonText}>🔄 Refresh Info</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
                onPress={() => copyToClipboard(formatDebugInfo())}
              >
                <Text style={styles.actionButtonText}>📋 Copy All Info</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.timestamp, { color: colors.text + '80' }]}>
              Last updated: {debugInfo.timestamp}
            </Text>
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  debugToggle: {
    position: 'absolute',
    top: 100,
    right: 20,
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1C229',
    zIndex: 1000,
  },
  debugToggleText: {
    fontSize: 12,
    fontWeight: '600',
  },
  debugPanel: {
    position: 'absolute',
    top: 80,
    left: 20,
    right: 20,
    maxHeight: '70%',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#F1C229',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  debugHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  closeButton: {
    padding: 5,
  },
  debugContent: {
    padding: 15,
  },
  loadingText: {
    textAlign: 'center',
    fontStyle: 'italic',
    padding: 20,
  },
  debugSection: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  debugText: {
    fontSize: 12,
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
});