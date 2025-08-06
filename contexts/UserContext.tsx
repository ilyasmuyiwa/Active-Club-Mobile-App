import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { authService } from '../services/authService';
import { router } from 'expo-router';
import { AppState, AppStateStatus } from 'react-native';

interface UserContextType {
  phoneNumber: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setPhoneNumber: (phone: string | null) => void;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  setAuthFlow: (inFlow: boolean) => void;
  refreshCustomerData: () => void;
  onCustomerDataRefresh: (callback: () => void) => () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isInAuthFlow, setIsInAuthFlow] = useState(false);
  const sessionCheckInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const customerDataRefreshCallbacks = useRef<Set<() => void>>(new Set());
  const authFlowTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const checkAuthStatus = async (shouldRedirect: boolean = false) => {
    try {
      setIsLoading(true);
      const authenticated = await authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        const phone = await authService.getPhoneNumber();
        console.log('🔐 UserContext: Loaded phone from session:', phone);
        setPhoneNumber(phone);
      } else {
        console.log('🔐 UserContext: No authenticated session found');
        setPhoneNumber(null);
        
        // Only redirect if we should redirect, not in auth flow, and user was previously authenticated
        if (shouldRedirect && !isInAuthFlow && phoneNumber !== null) {
          console.log('🔐 UserContext: Session expired - redirecting to login');
          // Use replace to avoid navigation stack issues
          setTimeout(() => {
            try {
              router.replace('/screens/LoginScreen');
            } catch (error) {
              console.error('🔐 UserContext: Navigation error:', error);
            }
          }, 100);
        } else if (shouldRedirect && isInAuthFlow) {
          console.log('🔐 UserContext: In auth flow, skipping redirect to prevent loop');
        } else if (shouldRedirect && phoneNumber === null) {
          console.log('🔐 UserContext: User was never authenticated, skipping redirect');
        }
      }
    } catch (error) {
      console.error('🔐 UserContext: Error checking auth status:', error);
      setIsAuthenticated(false);
      setPhoneNumber(null);
    } finally {
      setIsLoading(false);
    }
  };

  const startSessionCheck = () => {
    // Don't start session check if already running, in auth flow, or user is not authenticated
    if (sessionCheckInterval.current || isInAuthFlow || !isAuthenticated) {
      return;
    }
    
    // Check session every 5 minutes
    sessionCheckInterval.current = setInterval(() => {
      // Skip session check if in auth flow or not authenticated to prevent interrupting login/OTP
      if (isInAuthFlow || !isAuthenticated) {
        console.log('🔐 UserContext: Skipping session check - in auth flow or not authenticated');
        return;
      }
      
      console.log('🔐 UserContext: Periodic session check');
      checkAuthStatus(true);
    }, 5 * 60 * 1000);
  };

  const stopSessionCheck = () => {
    if (sessionCheckInterval.current) {
      clearInterval(sessionCheckInterval.current);
      sessionCheckInterval.current = null;
    }
  };

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active' && isAuthenticated) {
      console.log('🔐 UserContext: App became active - checking session');
      checkAuthStatus(true);
    }
  };

  const logout = async () => {
    try {
      console.log('🔐 UserContext: Logging out user');
      stopSessionCheck();
      setIsInAuthFlow(true); // Set auth flow to prevent session checks during logout
      await authService.logout();
      setIsAuthenticated(false);
      setPhoneNumber(null);
      
      console.log('🔐 UserContext: User logged out successfully, redirecting to login');
      
      // Force navigate to login screen after logout
      setTimeout(() => {
        setIsInAuthFlow(false);
        router.replace('/screens/LoginScreen');
      }, 100);
      
    } catch (error) {
      console.error('🔐 UserContext: Error during logout:', error);
      setIsInAuthFlow(false);
    }
  };

  const setPhoneNumberWithUpdate = async (phone: string | null) => {
    console.log('🔐 UserContext: Setting phone number:', phone);
    setPhoneNumber(phone);
  };

  const setAuthFlow = (inFlow: boolean) => {
    console.log('🔐 UserContext: Setting auth flow:', inFlow);
    
    // Clear any existing timeout
    if (authFlowTimeoutRef.current) {
      clearTimeout(authFlowTimeoutRef.current);
    }
    
    setIsInAuthFlow(inFlow);
    
    // If setting auth flow to false, add a safety timeout to ensure session checks resume
    if (!inFlow) {
      authFlowTimeoutRef.current = setTimeout(() => {
        console.log('🔐 UserContext: Auth flow timeout - ensuring session checks can resume');
        setIsInAuthFlow(false);
      }, 1000);
    }
  };

  const refreshCustomerData = () => {
    console.log('🔄 UserContext: Triggering customer data refresh');
    customerDataRefreshCallbacks.current.forEach(callback => callback());
  };

  const onCustomerDataRefresh = (callback: () => void) => {
    console.log('🔄 UserContext: Registered customer data refresh callback');
    customerDataRefreshCallbacks.current.add(callback);
    
    // Return cleanup function
    return () => {
      customerDataRefreshCallbacks.current.delete(callback);
    };
  };

  // Initial auth check only
  useEffect(() => {
    checkAuthStatus();
    
    // Listen for app state changes
    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      stopSessionCheck();
      if (authFlowTimeoutRef.current) {
        clearTimeout(authFlowTimeoutRef.current);
      }
      appStateSubscription?.remove();
    };
  }, []);

  // Start/stop session check based on authentication status and auth flow
  useEffect(() => {
    if (isAuthenticated && !isInAuthFlow) {
      console.log('🔐 UserContext: Starting session check - user authenticated');
      startSessionCheck();
    } else {
      console.log('🔐 UserContext: Stopping session check - user not authenticated or in auth flow');
      stopSessionCheck();
    }
  }, [isAuthenticated, isInAuthFlow]);

  // Debug logging moved to useEffect to prevent render loops
  useEffect(() => {
    console.log('🔐 UserContext: Current state - phone:', phoneNumber, 'authenticated:', isAuthenticated, 'loading:', isLoading);
  }, [phoneNumber, isAuthenticated, isLoading]);

  return (
    <UserContext.Provider value={{ 
      phoneNumber, 
      isAuthenticated, 
      isLoading,
      setPhoneNumber: setPhoneNumberWithUpdate, 
      logout, 
      checkAuthStatus,
      setAuthFlow,
      refreshCustomerData,
      onCustomerDataRefresh
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};