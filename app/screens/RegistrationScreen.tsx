import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Picker } from '@react-native-picker/picker';

interface FormData {
  firstName: string;
  lastName: string;
  mobileNumber: string;
  email: string;
  nationality: string;
  dateOfBirth: string;
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
}

const RegistrationScreen: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    mobileNumber: '+974 XXXX XXXX',
    email: '',
    nationality: 'Qatar',
    dateOfBirth: '',
    agreeToTerms: false,
    agreeToPrivacy: false,
  });

  const router = useRouter();

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormValid = () => {
    return (
      formData.firstName.trim() &&
      formData.lastName.trim() &&
      formData.email.trim() &&
      formData.dateOfBirth.trim() &&
      formData.agreeToTerms &&
      formData.agreeToPrivacy
    );
  };

  const handleCreateAccount = () => {
    if (isFormValid()) {
      // Simulate account creation
      Alert.alert(
        'Account Created!',
        'Your Active Club account has been successfully created.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)')
          }
        ]
      );
    } else {
      Alert.alert('Error', 'Please fill in all required fields and accept the terms.');
    }
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
        <Text style={styles.headerTitle}>Create your account</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.nameRow}>
            <View style={styles.nameField}>
              <Text style={styles.label}>
                Mr <IconSymbol name="person.circle" size={16} color="#F1C229" />
              </Text>
              <Text style={styles.label}>Ms</Text>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>First name</Text>
            <TextInput
              style={styles.input}
              value={formData.firstName}
              onChangeText={(value) => updateFormData('firstName', value)}
              placeholder="John"
              placeholderTextColor="#CCCCCC"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Last name</Text>
            <TextInput
              style={styles.input}
              value={formData.lastName}
              onChangeText={(value) => updateFormData('lastName', value)}
              placeholder="Smith"
              placeholderTextColor="#CCCCCC"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mobile number</Text>
            <TextInput
              style={[styles.input, styles.inputDisabled]}
              value={formData.mobileNumber}
              editable={false}
            />
            <IconSymbol name="lock.fill" size={20} color="#CCCCCC" style={styles.lockIcon} />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(value) => updateFormData('email', value)}
              placeholder="john_smith@gmail.com"
              placeholderTextColor="#CCCCCC"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <IconSymbol name="lock.fill" size={20} color="#CCCCCC" style={styles.lockIcon} />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nationality</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.nationality}
                onValueChange={(value) => updateFormData('nationality', value)}
                style={styles.picker}
              >
                <Picker.Item label="Qatar" value="Qatar" />
                <Picker.Item label="UAE" value="UAE" />
                <Picker.Item label="Saudi Arabia" value="Saudi Arabia" />
                <Picker.Item label="Kuwait" value="Kuwait" />
                <Picker.Item label="Bahrain" value="Bahrain" />
                <Picker.Item label="Oman" value="Oman" />
                <Picker.Item label="Other" value="Other" />
              </Picker>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Date of Birth</Text>
            <TextInput
              style={styles.input}
              value={formData.dateOfBirth}
              onChangeText={(value) => updateFormData('dateOfBirth', value)}
              placeholder="12/03/1998"
              placeholderTextColor="#CCCCCC"
            />
            <IconSymbol name="calendar" size={20} color="#CCCCCC" style={styles.lockIcon} />
          </View>

          <View style={styles.checkboxContainer}>
            <TouchableOpacity 
              style={styles.checkbox}
              onPress={() => updateFormData('agreeToTerms', !formData.agreeToTerms)}
            >
              {formData.agreeToTerms && (
                <IconSymbol name="checkmark" size={16} color="#F1C229" />
              )}
            </TouchableOpacity>
            <Text style={styles.checkboxText}>
              I'd like to receive the latest news and promotions
            </Text>
          </View>

          <View style={styles.checkboxContainer}>
            <TouchableOpacity 
              style={styles.checkbox}
              onPress={() => updateFormData('agreeToPrivacy', !formData.agreeToPrivacy)}
            >
              {formData.agreeToPrivacy && (
                <IconSymbol name="checkmark" size={16} color="#F1C229" />
              )}
            </TouchableOpacity>
            <Text style={styles.checkboxText}>
              I agree to the <Text style={styles.linkText}>terms of use</Text> and <Text style={styles.linkText}>privacy policy</Text>
            </Text>
          </View>

          <TouchableOpacity 
            style={[styles.createButton, !isFormValid() && styles.createButtonDisabled]}
            onPress={handleCreateAccount}
            disabled={!isFormValid()}
          >
            <Text style={styles.createButtonText}>Create account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 30,
    paddingBottom: 50,
  },
  nameRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  nameField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  inputContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  label: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 8,
    fontFamily: 'Roboto',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: '#000000',
    backgroundColor: '#FFFFFF',
    fontFamily: 'Roboto',
  },
  inputDisabled: {
    backgroundColor: '#F5F5F5',
    color: '#666666',
  },
  lockIcon: {
    position: 'absolute',
    right: 15,
    top: 43,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  picker: {
    height: 50,
    color: '#000000',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    marginRight: 12,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    fontFamily: 'Roboto',
  },
  linkText: {
    color: '#F1C229',
    textDecorationLine: 'underline',
  },
  createButton: {
    backgroundColor: '#F1C229',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonDisabled: {
    backgroundColor: 'rgba(241, 194, 41, 0.3)',
  },
  createButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
});

export default RegistrationScreen;