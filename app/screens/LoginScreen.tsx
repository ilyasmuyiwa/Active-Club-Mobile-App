import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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
  View
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { ActiveClubLogoSvg } from '../../assets/ActiveClubLogo';

const { height, width } = Dimensions.get('window');

const LoginScreen: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    if (phoneNumber.trim()) {
      router.push('/screens/OTPScreen');
    }
  };

  return (
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
          {/* Logo at top */}
          <View style={styles.logoContainer}>
            <SvgXml xml={ActiveClubLogoSvg} width={140} height={56} />
          </View>

          {/* Spacer to push form down */}
          <View style={styles.spacer} />

          {/* Login Form */}
          <View style={styles.formContainer}>
            <Text style={styles.title}>Login</Text>
            
            <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Mobile number"
              placeholderTextColor="#999999"
              keyboardType="phone-pad"
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />

            <TouchableOpacity 
              style={[styles.button, !phoneNumber.trim() && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={!phoneNumber.trim()}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
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
    paddingTop: 80,
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
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 18,
    fontSize: 16,
    color: '#000000',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    backgroundColor: '#F1C229',
    paddingVertical: 18,
    borderRadius: 12,
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