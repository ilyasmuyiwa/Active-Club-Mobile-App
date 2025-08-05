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
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const sessionCheckInterval = useRef<NodeJS.Timeout | null>(null);

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
        
        // Redirect to login if session expired and we should redirect
        if (shouldRedirect) {
          console.log('🔐 UserContext: Session expired - redirecting to login');
          setTimeout(() => {
            router.replace('/screens/LoginScreen');
          }, 100);
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
    // Check session every 5 minutes
    sessionCheckInterval.current = setInterval(() => {
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
      await authService.logout();
      setIsAuthenticated(false);
      setPhoneNumber(null);
      console.log('🔐 UserContext: User logged out successfully');
    } catch (error) {
      console.error('🔐 UserContext: Error during logout:', error);
    }
  };

  const setPhoneNumberWithUpdate = async (phone: string | null) => {
    console.log('🔐 UserContext: Setting phone number:', phone);
    setPhoneNumber(phone);
  };

  useEffect(() => {
    checkAuthStatus();
    
    // Start session monitoring when authenticated
    if (isAuthenticated) {
      startSessionCheck();
    }
    
    // Listen for app state changes
    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      stopSessionCheck();
      appStateSubscription?.remove();
    };
  }, [isAuthenticated]);

  // Start session check when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated) {
      startSessionCheck();
    } else {
      stopSessionCheck();
    }
  }, [isAuthenticated]);

  console.log('🔐 UserContext: Current state - phone:', phoneNumber, 'authenticated:', isAuthenticated, 'loading:', isLoading);

  return (
    <UserContext.Provider value={{ 
      phoneNumber, 
      isAuthenticated, 
      isLoading,
      setPhoneNumber: setPhoneNumberWithUpdate, 
      logout, 
      checkAuthStatus 
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