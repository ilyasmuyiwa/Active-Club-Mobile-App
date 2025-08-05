import { IconSymbol } from '@/components/ui/IconSymbol';
import SuccessAlert from '@/components/SuccessAlert';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { useUser } from '../../contexts/UserContext';
import {
  Alert,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator
} from 'react-native';
import { authService } from '../../services/authService';

const { width, height } = Dimensions.get('window');

const OtpScreen: React.FC = () => {
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [timer, setTimer] = useState(300); // 5 minutes (from API response)
  const [canResend, setCanResend] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState({ title: '', message: '' });
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams<{ phoneNumber: string }>();
  const { checkAuthStatus } = useUser();
  
  console.log('🎯 OTP Screen - All params received:', params);
  console.log('🎯 OTP Screen - phoneNumber param:', params.phoneNumber);
  console.log('🎯 OTP Screen - phoneNumber type:', typeof params.phoneNumber);
  console.log('🎯 OTP Screen - phoneNumber length:', params.phoneNumber?.length);
  
  const phoneNumber = params.phoneNumber;
  
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (value: string, index: number) => {
    // Handle iOS auto-fill - if user pastes/auto-fills multiple digits
    if (value.length > 1) {
      const digits = value.slice(0, 5).split('');
      const newOtp = ['', '', '', '', ''];
      
      // Fill the OTP array with the digits
      digits.forEach((digit, i) => {
        if (i < 5) {
          newOtp[i] = digit;
        }
      });
      
      setOtp(newOtp);
      
      // Focus the next empty field or the last field
      const nextIndex = Math.min(digits.length, 4);
      setTimeout(() => {
        inputRefs.current[nextIndex]?.focus();
      }, 0);
      
      // Auto-verify if all 5 digits are filled
      if (digits.length === 5) {
        handleVerify(newOtp.join(''));
      }
      
      return;
    }

    // Handle single digit input
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all digits are entered
    if (newOtp.every(digit => digit !== '') && value) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (otpCode?: string) => {
    const finalOtp = otpCode || otp.join('');
    
    if (finalOtp.length !== 5) {
      Alert.alert('Error', 'Please enter the complete 5-digit OTP');
      return;
    }

    if (!phoneNumber) {
      Alert.alert('Error', 'Phone number not found. Please try logging in again.');
      return;
    }

    setIsVerifying(true);
    console.log('📱 OTP Screen: Verifying OTP for:', phoneNumber);
    
    try {
      const response = await authService.verifyOTP(phoneNumber, finalOtp);
      
      if (response.success) {
        console.log('✅ OTP Screen: OTP verified successfully');
        
        // Update auth context
        await checkAuthStatus();
        
        setSuccessMessage({
          title: 'Welcome!',
          message: 'You have logged in successfully!'
        });
        setShowSuccessAlert(true);
        
        // Navigate to home screen
        setTimeout(() => {
          setShowSuccessAlert(false);
          router.replace('/(tabs)');
        }, 2000);
      } else {
        Alert.alert('Invalid OTP', 'The OTP you entered is incorrect. Please try again.');
        // Clear OTP inputs
        setOtp(['', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      console.error('🔴 OTP Screen: Error verifying OTP:', error);
      Alert.alert(
        'Verification Failed', 
        'Unable to verify OTP. Please check your internet connection and try again.'
      );
      // Clear OTP inputs
      setOtp(['', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend || !phoneNumber) return;

    setIsResending(true);
    console.log('🔄 OTP Screen: Resending OTP for:', phoneNumber);
    
    try {
      const response = await authService.requestOTP(phoneNumber);
      
      if (response.success) {
        setTimer(response.expires_in || 300);
        setCanResend(false);
        setOtp(['', '', '', '', '']);
        inputRefs.current[0]?.focus();
        Alert.alert('OTP Sent', 'A new OTP has been sent to your phone');
      } else {
        Alert.alert('Error', response.message || 'Failed to resend OTP. Please try again.');
      }
    } catch (error) {
      console.error('🔴 OTP Screen: Error resending OTP:', error);
      Alert.alert(
        'Resend Failed', 
        'Unable to resend OTP. Please check your internet connection and try again.'
      );
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Custom Header with Back Arrow */}
      <View style={styles.customHeader}>
        <TouchableOpacity 
          style={styles.backArrow}
          onPress={() => router.back()}
        >
          <IconSymbol name="arrow.left" size={24} color="#000000" />
        </TouchableOpacity>
      </View>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView 
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <View style={styles.content}>
        <Text style={styles.title}>OTP Verification Code</Text>
        <Text style={styles.subtitle}>
          Please enter the OTP verification code sent to your
          mobile number {'\n'} {phoneNumber || '+974 XXXX XXXX'}
        </Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => inputRefs.current[index] = ref}
              style={[
                styles.otpInput,
                digit && styles.otpInputFilled
              ]}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
              keyboardType="numeric"
              maxLength={index === 0 ? 5 : 1} // Allow paste/auto-fill in first field
              selectTextOnFocus
              editable={!isVerifying}
              textContentType={index === 0 ? "oneTimeCode" : "none"} // Enable auto-fill for first field only
              autoComplete={index === 0 ? "one-time-code" : "off"} // Android support
            />
          ))}
        </View>

        <Text style={styles.timerText}>
          {timer > 0 ? formatTime(timer) : ''}
        </Text>

        <TouchableOpacity 
          style={[styles.resendButton, (!canResend || isResending) && styles.resendButtonDisabled]}
          onPress={handleResendOTP}
          disabled={!canResend || isResending}
        >
          {isResending ? (
            <ActivityIndicator color="#F1C229" size="small" />
          ) : (
            <Text style={[styles.resendText, !canResend && styles.resendTextDisabled]}>
              Didn&apos;t receive the OTP? <Text style={[styles.resendLink, !canResend && styles.resendLinkDisabled]}>Resend OTP</Text>
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.verifyButton, (otp.join('').length !== 5 || isVerifying) && styles.verifyButtonDisabled]}
          onPress={() => handleVerify()}
          disabled={otp.join('').length !== 5 || isVerifying}
        >
          {isVerifying ? (
            <ActivityIndicator color="#000000" size="small" />
          ) : (
            <Text style={styles.verifyButtonText}>Verify</Text>
          )}
        </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
      
      <SuccessAlert
        visible={showSuccessAlert}
        onClose={() => setShowSuccessAlert(false)}
        title={successMessage.title}
        message={successMessage.message}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  customHeader: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: '#F5F5F5',
  },
  backArrow: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    paddingTop: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'Roboto',
  },
  subtitle: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
    fontFamily: 'Roboto',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
    marginBottom: 30,
    minHeight: 60,
  },
  otpInput: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    backgroundColor: '#FFFFFF',
    fontFamily: 'Roboto',
  },
  otpInputFilled: {
    borderColor: '#4CAF50',
    color: '#4CAF50',
  },
  timerText: {
    fontSize: 20,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  resendButton: {
    marginBottom: 40,
  },
  resendButtonDisabled: {
    opacity: 0.5,
  },
  resendText: {
    fontSize: 14,
    color: '#000000',
    textAlign: 'center',
    fontFamily: 'Roboto',
  },
  resendTextDisabled: {
    color: '#CCCCCC',
  },
  resendLink: {
    color: '#000000',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  resendLinkDisabled: {
    color: '#CCCCCC',
    textDecorationLine: 'none',
  },
  verifyButton: {
    backgroundColor: '#F1C229',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
  },
  verifyButtonDisabled: {
    backgroundColor: 'rgba(241, 194, 41, 0.3)',
  },
  verifyButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
});

export default OtpScreen;