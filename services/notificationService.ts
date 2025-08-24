import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const PUSH_TOKEN_KEY = 'push_token';
const API_BASE_URL = 'https://sportscorner.qa/rest/V1';

// Configure notification handling
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

interface PushTokenRegistration {
  mobile: string;
  pushToken: string;
  deviceType: 'ios' | 'android';
}

interface NotificationResponse {
  id: number;
  user_mobile: string;
  push_token: string;
  device_type: string;
  is_active: boolean;
}

class NotificationService {
  private pushToken: string | null = null;

  /**
   * Request notification permissions from the user
   */
  async requestPermissions(): Promise<boolean> {
    try {
      if (!Device.isDevice) {
        console.warn('Push notifications only work on physical devices');
        return false;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Permission for notifications was denied');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  /**
   * Get the Expo push token for this device
   */
  async getPushToken(): Promise<string | null> {
    try {
      console.log('🔔 Getting push token...');
      
      // Check if we already have a cached token
      if (this.pushToken) {
        console.log('🔔 Using cached push token:', this.pushToken);
        return this.pushToken;
      }

      // Try to get from storage
      const storedToken = await AsyncStorage.getItem(PUSH_TOKEN_KEY);
      if (storedToken) {
        console.log('🔔 Using stored push token:', storedToken);
        this.pushToken = storedToken;
        return storedToken;
      }

      console.log('🔔 Generating new push token...');
      // Get new token
      const token = (await Notifications.getExpoPushTokenAsync({
        projectId: '833c3db2-bec6-4f1e-b653-9765287a1188',
      })).data;
      console.log('🔔 Generated new push token:', token);
      console.log('🔔 Token type:', token?.startsWith('ExponentPushToken') ? 'Expo Token' : 'Native Token');
      console.log('🔔 App environment:', __DEV__ ? 'Development' : 'Production');
      console.log('🔔 Device platform:', Platform.OS);
      
      this.pushToken = token;

      // Cache the token
      await AsyncStorage.setItem(PUSH_TOKEN_KEY, token);
      console.log('🔔 Cached push token in storage');
      
      return token;
    } catch (error) {
      console.error('🔔 ERROR getting push token:', error);
      return null;
    }
  }

  /**
   * Register push token with backend API
   */
  async registerPushToken(mobile: string): Promise<boolean> {
    try {
      console.log('🔔 Starting push token registration for mobile:', mobile);
      
      const pushToken = await this.getPushToken();
      if (!pushToken) {
        console.error('🔔 ERROR: No push token available for registration');
        return false;
      }

      console.log('🔔 Got push token:', pushToken);
      const deviceType = Platform.OS === 'ios' ? 'ios' : 'android';
      console.log('🔔 Device type:', deviceType);
      
      const registrationData: PushTokenRegistration = {
        mobile,
        pushToken,
        deviceType,
      };

      console.log('🔔 Registration data:', JSON.stringify(registrationData, null, 2));
      console.log('🔔 Making API call to:', `${API_BASE_URL}/push-notification/register`);

      const response = await fetch(`${API_BASE_URL}/push-notification/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      console.log('🔔 API Response status:', response.status);
      console.log('🔔 API Response headers:', JSON.stringify([...response.headers.entries()]));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🔔 ERROR: Failed to register push token');
        console.error('🔔 ERROR: Status:', response.status);
        console.error('🔔 ERROR: Status Text:', response.statusText);
        console.error('🔔 ERROR: Response Body:', errorText);
        return false;
      }

      const result: NotificationResponse = await response.json();
      console.log('🔔 SUCCESS: Push token registered successfully!');
      console.log('🔔 SUCCESS: Response:', JSON.stringify(result, null, 2));
      
      return true;
    } catch (error) {
      console.error('🔔 ERROR: Exception during push token registration:', error);
      if (error instanceof TypeError) {
        console.error('🔔 ERROR: Network error - check internet connection and API endpoint');
      }
      return false;
    }
  }

  /**
   * Initialize notification service with permissions and token registration
   */
  async initialize(mobile: string): Promise<boolean> {
    try {
      console.log('🔔 Initializing notification service for mobile:', mobile);

      // Request permissions
      console.log('🔔 Requesting notification permissions...');
      const hasPermissions = await this.requestPermissions();
      if (!hasPermissions) {
        console.error('🔔 ERROR: Notification permissions denied');
        return false;
      }
      console.log('🔔 SUCCESS: Notification permissions granted');

      // Register push token
      console.log('🔔 Registering push token...');
      const registered = await this.registerPushToken(mobile);
      if (!registered) {
        console.error('🔔 ERROR: Push token registration failed');
        return false;
      }
      console.log('🔔 SUCCESS: Push token registered');

      // Set up notification listeners
      console.log('🔔 Setting up notification listeners...');
      this.setupNotificationListeners();
      console.log('🔔 SUCCESS: Notification listeners setup complete');

      console.log('🔔 SUCCESS: Notification service fully initialized!');
      return true;
    } catch (error) {
      console.error('🔔 ERROR: Exception initializing notification service:', error);
      return false;
    }
  }

  /**
   * Set up notification event listeners
   */
  private setupNotificationListeners(): void {
    // Handle notification received while app is in foreground
    Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
      // You can add custom logic here for foreground notifications
    });

    // Handle notification response (user tapped notification)
    Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
      // You can add navigation logic here based on notification data
      const data = response.notification.request.content.data;
      this.handleNotificationAction(data);
    });
  }

  /**
   * Handle notification tap actions
   */
  private handleNotificationAction(data: any): void {
    console.log('🔔 Handling notification action with data:', data);
    
    try {
      // Navigate to specific screens based on notification type
      if (data?.type === 'points_earned' || data?.type === 'points_redeemed') {
        // Navigate to activities screen
        console.log('🔔 Navigating to activities screen');
        router.push('/(tabs)/activities');
      } else if (data?.type === 'level_up' || data?.type === 'achievement') {
        // Navigate to user level screen
        console.log('🔔 Navigating to user level screen');
        router.push('/user-level');
      } else if (data?.type === 'partner_offer') {
        // Navigate to partners screen
        console.log('🔔 Navigating to partners screen');
        router.push('/(tabs)/partners');
      } else if (data?.type === 'general' || !data?.type) {
        // Navigate to notifications screen by default
        console.log('🔔 Navigating to notifications screen');
        router.push('/(tabs)/notifications');
      }
    } catch (error) {
      console.error('🔔 Error handling notification navigation:', error);
      // Fallback to notifications screen
      try {
        router.push('/(tabs)/notifications');
      } catch (fallbackError) {
        console.error('🔔 Error with fallback navigation:', fallbackError);
      }
    }
  }

  /**
   * Clear all notifications
   */
  async clearAllNotifications(): Promise<void> {
    try {
      await Notifications.dismissAllNotificationsAsync();
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  }

  /**
   * Get delivered notifications
   */
  async getDeliveredNotifications(): Promise<Notifications.Notification[]> {
    try {
      return await Notifications.getPresentedNotificationsAsync();
    } catch (error) {
      console.error('Error getting delivered notifications:', error);
      return [];
    }
  }

  /**
   * Unregister push token (for logout)
   */
  async unregisterPushToken(): Promise<void> {
    try {
      console.log('🔔 Unregistering push token...');
      this.pushToken = null;
      await AsyncStorage.removeItem(PUSH_TOKEN_KEY);
      console.log('🔔 SUCCESS: Push token unregistered');
      // Note: You might also want to call an API endpoint to mark the token as inactive
    } catch (error) {
      console.error('🔔 ERROR: Failed to unregister push token:', error);
    }
  }

  /**
   * Test function to manually trigger registration
   * Use this for debugging in the console
   */
  async testRegistration(mobile: string): Promise<void> {
    console.log('🔔 TEST: Starting manual push token registration test...');
    console.log('🔔 TEST: Mobile number:', mobile);
    console.log('🔔 TEST: API Base URL:', API_BASE_URL);
    console.log('🔔 TEST: Device platform:', Platform.OS);
    console.log('🔔 TEST: Is physical device:', Device.isDevice);
    
    const result = await this.initialize(mobile);
    console.log('🔔 TEST: Final result:', result ? 'SUCCESS' : 'FAILED');
  }
}

export default new NotificationService();