import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { useUser } from '../../contexts/UserContext';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  Animated,
  ActivityIndicator
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { ActiveClubLogoSvg } from '../../assets/ActiveClubLogo';
import { authService } from '../../services/authService';
import SuccessAlert from '@/components/SuccessAlert';
import { getHeaderPaddingTop } from '../../utils/statusBar';

const { height, width } = Dimensions.get('window');

function LoginScreen() {
  const router = useRouter();
  const userContext = useUser();
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isValidNumber, setIsValidNumber] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ title: '', message: '', type: 'error' as 'success' | 'error' });
  
  const { setPhoneNumber: setContextPhoneNumber, checkAuthStatus, setAuthFlow } = userContext || {};
  
  // Animation values
  const logoAnimatedValue = useRef(new Animated.Value(-100)).current;
  const formAnimatedValue = useRef(new Animated.Value(height)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Set auth flow state when component mounts
    if (setAuthFlow) {
      setAuthFlow(true);
    }
    
    // Animate logo sliding down from top
    Animated.parallel([
      Animated.spring(logoAnimatedValue, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate form sliding up from bottom
    setTimeout(() => {
      Animated.spring(formAnimatedValue, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }, 300);
    
    return () => {
      // Clear auth flow state when component unmounts
      if (setAuthFlow) {
        setAuthFlow(false);
      }
    };
  }, [setAuthFlow]);

  const handlePhoneNumberChange = (text: string) => {
    // Remove all non-numeric characters and spaces
    const numericOnly = text.replace(/[^0-9]/g, '');
    
    // If empty, just set empty
    if (numericOnly === '') {
      setPhoneNumber('');
      setIsValidNumber(false);
      return;
    }
    
    // If user is typing and doesn't start with 974, auto-add +974 with space
    let formattedNumber = '';
    if (numericOnly.startsWith('974')) {
      const remainingDigits = numericOnly.substring(3);
      formattedNumber = remainingDigits ? `+974 ${remainingDigits}` : '+974';
    } else {
      formattedNumber = `+974 ${numericOnly}`;
    }
    
    // Limit to 13 characters total (+974 xxxxxxxx = 13 chars)
    if (formattedNumber.length <= 13) {
      setPhoneNumber(formattedNumber);
      
      // Check if it's a valid Qatar number (8 digits after +974 )
      const digitsAfter974 = formattedNumber.replace('+974 ', '');
      setIsValidNumber(digitsAfter974.length === 8);
    }
  };

  const handleLogin = async () => {
    if (!isValidNumber) {
      setAlertMessage({
        title: 'Invalid Number',
        message: 'Please enter a valid Qatar mobile number.',
        type: 'error'
      });
      setShowAlert(true);
      return;
    }

    setIsLoading(true);
    console.log('🚀 Login Screen: Requesting OTP for:', phoneNumber);
    
    try {
      const response = await authService.requestOTP(phoneNumber);
      
      if (response.success) {
        console.log('✅ Login Screen: OTP sent successfully');
        
        // Navigate to OTP screen with phone number
        router.push({
          pathname: '/screens/OtpScreen',
          params: { phoneNumber: phoneNumber }
        });
      } else {
        setAlertMessage({
          title: 'Error',
          message: response.message || 'Failed to send OTP. Please try again.',
          type: 'error'
        });
        setShowAlert(true);
      }
    } catch (error) {
      console.error('🔴 Login Screen: Error requesting OTP:', error);
      setAlertMessage({
        title: 'Connection Error',
        message: 'Unable to send OTP. Please check your internet connection and try again.',
        type: 'error'
      });
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <StatusBar barStyle="light-content" />
          
          {/* PNG Background */}
          <Image 
            source={require('../../assets/login_page_bg.png')}
            style={styles.backgroundImage}
            resizeMode="cover"
          />

          <KeyboardAvoidingView 
            style={styles.contentContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            {/* Logo at top with animation */}
            <Animated.View 
              style={[
                styles.logoContainer,
                {
                  opacity: logoOpacity,
                  transform: [{ translateY: logoAnimatedValue }]
                }
              ]}
            >
              <SvgXml xml={ActiveClubLogoSvg} width={140} height={56} />
            </Animated.View>

            {/* Spacer to push form down */}
            <View style={styles.spacer} />

            {/* Login Form with slide up animation */}
            <Animated.View 
              style={[
                styles.formContainer,
                {
                  transform: [{ translateY: formAnimatedValue }]
                }
              ]}
            >
              <Text style={styles.title}>Login</Text>
              
              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.input,
                    isValidNumber && styles.inputValid
                  ]}
                  value={phoneNumber}
                  onChangeText={handlePhoneNumberChange}
                  placeholder="+974 Mobile number"
                  placeholderTextColor="#999999"
                  keyboardType="phone-pad"
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                />
                {isValidNumber && (
                  <View style={styles.checkmarkContainer}>
                    <Text style={styles.checkmark}>✓</Text>
                  </View>
                )}
              </View>

              <TouchableOpacity 
                style={[styles.button, (!isValidNumber || isLoading) && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={!isValidNumber || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#000000" size="small" />
                ) : (
                  <Text style={styles.buttonText}>Send OTP</Text>
                )}
              </TouchableOpacity>
            </Animated.View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
      
      <SuccessAlert
        visible={showAlert}
        onClose={() => setShowAlert(false)}
        title={alertMessage.title}
        message={alertMessage.message}
        type={alertMessage.type}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
  },
  contentContainer: {
    flex: 1,
    paddingTop: getHeaderPaddingTop(45),
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  spacer: {
    flex: 1,
  },
  formContainer: {
    paddingHorizontal: 30,
    paddingBottom: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 30,
    textAlign: 'left',
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    padding: 18,
    paddingRight: 50,
    fontSize: 16,
    color: '#000000',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputValid: {
    borderColor: '#4CAF50',
  },
  checkmarkContainer: {
    position: 'absolute',
    right: 15,
    top: '50%',
    transform: [{ translateY: -12 }],
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#F1C229',
    paddingVertical: 18,
    borderRadius: 6,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: 'rgba(241, 194, 41, 0.5)',
  },
  buttonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginScreen;