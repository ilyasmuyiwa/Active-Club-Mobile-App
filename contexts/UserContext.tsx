import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserContextType {
  phoneNumber: string | null;
  setPhoneNumber: (phone: string) => void;
  clearUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load phone number from storage on mount
  useEffect(() => {
    const loadPhoneNumber = async () => {
      try {
        const stored = await AsyncStorage.getItem('userPhoneNumber');
        console.log('🔐 UserContext: Loaded phone from storage:', stored);
        if (stored) {
          setPhoneNumber(stored);
        }
      } catch (error) {
        console.error('🔐 UserContext: Error loading phone number:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPhoneNumber();
  }, []);

  const setPhoneNumberWithLog = async (phone: string) => {
    console.log('🔐 UserContext: Setting phone number:', phone);
    console.log('🔐 UserContext: Phone number type:', typeof phone);
    console.log('🔐 UserContext: Phone number length:', phone?.length);
    console.log('🔐 UserContext: Current state before setting:', phoneNumber);
    
    try {
      await AsyncStorage.setItem('userPhoneNumber', phone);
      console.log('🔐 UserContext: Successfully saved to AsyncStorage');
      setPhoneNumber(phone);
      console.log('🔐 UserContext: State updated to:', phone);
    } catch (error) {
      console.error('🔐 UserContext: Error saving phone number:', error);
      setPhoneNumber(phone); // Still set in state even if storage fails
      console.log('🔐 UserContext: State updated to:', phone, '(despite storage error)');
    }
  };

  const clearUser = async () => {
    console.log('🔐 UserContext: Clearing user data');
    try {
      await AsyncStorage.removeItem('userPhoneNumber');
    } catch (error) {
      console.error('🔐 UserContext: Error clearing phone number:', error);
    }
    setPhoneNumber(null);
  };

  console.log('🔐 UserContext: Current phone number:', phoneNumber);

  return (
    <UserContext.Provider value={{ phoneNumber, setPhoneNumber: setPhoneNumberWithLog, clearUser }}>
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