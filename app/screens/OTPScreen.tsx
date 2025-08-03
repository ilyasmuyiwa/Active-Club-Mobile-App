import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';

const { width, height } = Dimensions.get('window');

const OTPScreen: React.FC = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(120); // 2 minutes
  const [canResend, setCanResend] = useState(false);
  const router = useRouter();
  
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
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
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

  const handleVerify = (otpCode?: string) => {
    const finalOtp = otpCode || otp.join('');
    
    if (finalOtp.length === 6) {
      // Simulate OTP verification
      if (finalOtp === '123456') {
        // User exists, go to home
        router.replace('/(tabs)');
      } else if (finalOtp === '654321') {
        // New user, go to registration
        router.push('/screens/RegistrationScreen');
      } else {
        // Demo purposes - any other code goes to registration
        router.push('/screens/RegistrationScreen');
      }
    } else {
      Alert.alert('Error', 'Please enter the complete OTP');
    }
  };

  const handleResendOTP = () => {
    if (canResend) {
      setTimer(120);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      Alert.alert('OTP Sent', 'A new OTP has been sent to your phone');
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <IconSymbol name="arrow.left" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verification</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>OTP Verification Code</Text>
        <Text style={styles.subtitle}>
          Please enter the OTP verification code that was{'\n'}
          sent to +974 XXXX XXXX
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
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        <Text style={styles.timerText}>
          {timer > 0 ? formatTime(timer) : ''}
        </Text>

        <TouchableOpacity 
          style={[styles.resendButton, !canResend && styles.resendButtonDisabled]}
          onPress={handleResendOTP}
          disabled={!canResend}
        >
          <Text style={[styles.resendText, !canResend && styles.resendTextDisabled]}>
            Didn't receive the OTP? <Text style={styles.resendLink}>Resend OTP</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.verifyButton, otp.join('').length !== 6 && styles.verifyButtonDisabled]}
          onPress={() => handleVerify()}
          disabled={otp.join('').length !== 6}
        >
          <Text style={styles.verifyButtonText}>Verify</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    fontFamily: 'Roboto',
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 40,
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
    color: '#666666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
    fontFamily: 'Roboto',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  otpInput: {
    width: 45,
    height: 55,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    backgroundColor: '#F9F9F9',
    fontFamily: 'Roboto',
  },
  otpInputFilled: {
    borderColor: '#F1C229',
    backgroundColor: '#FFFBF0',
  },
  timerText: {
    fontSize: 16,
    color: '#F1C229',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
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
    color: '#666666',
    textAlign: 'center',
    fontFamily: 'Roboto',
  },
  resendTextDisabled: {
    color: '#CCCCCC',
  },
  resendLink: {
    color: '#F1C229',
    fontWeight: '600',
  },
  verifyButton: {
    backgroundColor: '#F1C229',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 50,
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

export default OTPScreen;