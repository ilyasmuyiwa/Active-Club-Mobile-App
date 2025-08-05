// OTP Authentication Service
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const OTP_API_URL = Constants.expoConfig?.extra?.OTP_API_URL || 'https://sportscorner.qa/rest/V1/otp';
const API_KEY = Constants.expoConfig?.extra?.OTP_API_KEY;

// Storage keys
const AUTH_TOKEN_KEY = 'auth_token';
const PHONE_NUMBER_KEY = 'phone_number';
const SESSION_EXPIRY_KEY = 'session_expiry';

export interface OTPRequestResponse {
  success: boolean;
  phone: string;
  expires_in: number;
  message: string;
}

export interface OTPVerifyResponse {
  success: boolean;
  cap_token: string;
  expires_in: number;
}

export interface AuthSession {
  token: string;
  phoneNumber: string;
  expiresAt: number;
}

class AuthService {
  private baseURL = OTP_API_URL;
  private apiKey = API_KEY;

  constructor() {
    if (!this.apiKey) {
      console.error('🔴 OTP_API_KEY not configured. Please set it in your environment variables.');
      throw new Error('OTP_API_KEY is required but not configured');
    }
  }

  /**
   * Request OTP for phone number
   */
  async requestOTP(phoneNumber: string): Promise<OTPRequestResponse> {
    try {
      // Ensure phone number has +974 prefix
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      
      console.log('🔵 Requesting OTP for:', formattedPhone);
      
      const response = await fetch(`${this.baseURL}/request`, {
        method: 'POST',
        headers: {
          'X-API-Key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: formattedPhone
        }),
      });

      console.log('🟡 OTP request response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🔴 OTP request failed:', response.status, errorText);
        throw new Error(`OTP request failed: ${response.status}`);
      }

      const data: OTPRequestResponse[] = await response.json();
      console.log('🟢 OTP request successful:', data[0]);
      
      if (data && data.length > 0 && data[0].success) {
        return data[0];
      }
      
      throw new Error('OTP request failed');
    } catch (error) {
      console.error('🔴 Error requesting OTP:', error);
      throw error;
    }
  }

  /**
   * Verify OTP code
   */
  async verifyOTP(phoneNumber: string, code: string): Promise<OTPVerifyResponse> {
    try {
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      
      console.log('🔵 Verifying OTP for:', formattedPhone, 'with code:', code);
      
      const response = await fetch(`${this.baseURL}/verify`, {
        method: 'POST',
        headers: {
          'X-API-Key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: formattedPhone,
          code: code
        }),
      });

      console.log('🟡 OTP verify response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🔴 OTP verification failed:', response.status, errorText);
        throw new Error(`OTP verification failed: ${response.status}`);
      }

      const data: OTPVerifyResponse[] = await response.json();
      console.log('🟢 OTP verification successful');
      
      if (data && data.length > 0 && data[0].success) {
        // Save session after successful verification
        await this.saveSession(data[0].cap_token, formattedPhone, data[0].expires_in);
        return data[0];
      }
      
      throw new Error('OTP verification failed');
    } catch (error) {
      console.error('🔴 Error verifying OTP:', error);
      throw error;
    }
  }

  /**
   * Save authentication session
   */
  async saveSession(token: string, phoneNumber: string, expiresIn: number): Promise<void> {
    try {
      // Calculate expiry time (30 days from now, or API expiry, whichever is longer)
      const thirtyDaysInSeconds = 30 * 24 * 60 * 60; // 30 days
      const sessionDuration = Math.max(expiresIn, thirtyDaysInSeconds);
      const expiresAt = Date.now() + (sessionDuration * 1000);

      await Promise.all([
        AsyncStorage.setItem(AUTH_TOKEN_KEY, token),
        AsyncStorage.setItem(PHONE_NUMBER_KEY, phoneNumber),
        AsyncStorage.setItem(SESSION_EXPIRY_KEY, expiresAt.toString()),
      ]);

      console.log('✅ Session saved successfully, expires at:', new Date(expiresAt));
      console.log('✅ Session duration:', Math.floor(sessionDuration / (24 * 60 * 60)), 'days');
    } catch (error) {
      console.error('🔴 Error saving session:', error);
      throw error;
    }
  }

  /**
   * Get current session
   */
  async getSession(): Promise<AuthSession | null> {
    try {
      const [token, phoneNumber, expiryStr] = await Promise.all([
        AsyncStorage.getItem(AUTH_TOKEN_KEY),
        AsyncStorage.getItem(PHONE_NUMBER_KEY),
        AsyncStorage.getItem(SESSION_EXPIRY_KEY),
      ]);

      if (!token || !phoneNumber || !expiryStr) {
        return null;
      }

      const expiresAt = parseInt(expiryStr);
      
      // Check if session is expired
      if (Date.now() >= expiresAt) {
        console.log('⚠️ Session expired, clearing storage');
        await this.clearSession();
        return null;
      }

      return {
        token,
        phoneNumber,
        expiresAt,
      };
    } catch (error) {
      console.error('🔴 Error getting session:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const session = await this.getSession();
    return session !== null;
  }

  /**
   * Get current auth token
   */
  async getAuthToken(): Promise<string | null> {
    const session = await this.getSession();
    return session?.token || null;
  }

  /**
   * Get current phone number
   */
  async getPhoneNumber(): Promise<string | null> {
    const session = await this.getSession();
    return session?.phoneNumber || null;
  }

  /**
   * Clear session (logout)
   */
  async clearSession(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(AUTH_TOKEN_KEY),
        AsyncStorage.removeItem(PHONE_NUMBER_KEY),
        AsyncStorage.removeItem(SESSION_EXPIRY_KEY),
      ]);
      console.log('✅ Session cleared successfully');
    } catch (error) {
      console.error('🔴 Error clearing session:', error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    await this.clearSession();
  }

  /**
   * Format phone number to ensure +974 prefix
   */
  private formatPhoneNumber(phoneNumber: string): string {
    // Remove any spaces, dashes, or other formatting
    let cleaned = phoneNumber.replace(/[\s\-\(\)]/g, '');
    
    // Remove leading + if present
    if (cleaned.startsWith('+')) {
      cleaned = cleaned.substring(1);
    }
    
    // Add +974 prefix if not present
    if (!cleaned.startsWith('974')) {
      cleaned = '974' + cleaned;
    }
    
    return '+' + cleaned;
  }

  /**
   * Get session expiry info
   */
  async getSessionInfo(): Promise<{ expiresAt: number; isExpired: boolean } | null> {
    const session = await this.getSession();
    if (!session) return null;

    return {
      expiresAt: session.expiresAt,
      isExpired: Date.now() >= session.expiresAt,
    };
  }
}

export const authService = new AuthService();