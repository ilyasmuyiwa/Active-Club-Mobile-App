import { IconSymbol } from '@/components/ui/IconSymbol';
import SuccessAlert from '@/components/SuccessAlert';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { getNationalityOptions } from '../../utils/nationalities';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

interface FormData {
  title: 'Mr' | 'Ms';
  firstName: string;
  lastName: string;
  mobileNumber: string;
  email: string;
  nationality: string;
  dateOfBirth: string;
  agreeToNews: boolean;
  agreeToTerms: boolean;
}

const RegistrationScreen: React.FC = () => {
  const router = useRouter();
  const { phoneNumber } = useLocalSearchParams<{ phoneNumber: string }>();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showNationalityDropdown, setShowNationalityDropdown] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const nationalityOptions = getNationalityOptions();

  const [formData, setFormData] = useState<FormData>({
    title: 'Mr',
    firstName: '',
    lastName: '',
    mobileNumber: phoneNumber || '+974 XXXX XXXX',
    email: '',
    nationality: 'Qatar',
    dateOfBirth: '',
    agreeToNews: false,
    agreeToTerms: false,
  });

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Validation functions
  const validateName = (name: string) => {
    return name.trim().length >= 2 && /^[A-Za-z\s]+$/.test(name.trim());
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const validateNationality = (nationality: string) => {
    return nationality.trim().length >= 2;
  };

  const validateDateOfBirth = (dateOfBirth: string) => {
    return dateOfBirth.trim().length > 0;
  };

  // Check if individual fields are valid
  const isFirstNameValid = validateName(formData.firstName);
  const isLastNameValid = validateName(formData.lastName);
  const isEmailValid = validateEmail(formData.email);
  const isNationalityValid = validateNationality(formData.nationality);
  const isDateOfBirthValid = validateDateOfBirth(formData.dateOfBirth);

  const handleDateChange = (event: any, date?: Date) => {
    // Handle dismissal properly
    if (event.type === 'dismissed' || event.type === 'neutralButtonPressed') {
      setShowDatePicker(false);
      return;
    }
    
    // On Android, close immediately after selection
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (date) {
      setSelectedDate(date);
      const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
      updateFormData('dateOfBirth', formattedDate);
      
      // On iOS, close after selection
      if (Platform.OS === 'ios') {
        setShowDatePicker(false);
      }
    }
  };

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  const handleDatePickerDone = () => {
    const formattedDate = `${selectedDate.getDate().toString().padStart(2, '0')}/${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}/${selectedDate.getFullYear()}`;
    updateFormData('dateOfBirth', formattedDate);
    setShowDatePicker(false);
  };

  const handleDatePickerCancel = () => {
    // Reset to original date if there was one, or reset to today
    if (formData.dateOfBirth) {
      // Parse existing date back to Date object
      const parts = formData.dateOfBirth.split('/');
      const existingDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
      setSelectedDate(existingDate);
    } else {
      setSelectedDate(new Date());
    }
    setShowDatePicker(false);
  };

  const isFormValid = () => {
    return (
      isFirstNameValid &&
      isLastNameValid &&
      isEmailValid &&
      isNationalityValid &&
      isDateOfBirthValid &&
      formData.agreeToTerms
    );
  };

  const handleCreateAccount = () => {
    if (isFormValid()) {
      // Show success alert
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
        router.replace('/(tabs)');
      }, 2000);
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
          <View style={styles.titleRow}>
            <TouchableOpacity 
              style={[styles.titleButton, formData.title === 'Mr' && styles.titleButtonSelected]}
              onPress={() => updateFormData('title', 'Mr')}
            >
              <Text style={[styles.titleText, formData.title === 'Mr' && styles.titleTextSelected]}>Mr.</Text>
              {formData.title === 'Mr' && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.titleButton, formData.title === 'Ms' && styles.titleButtonSelected]}
              onPress={() => updateFormData('title', 'Ms')}
            >
              <Text style={[styles.titleText, formData.title === 'Ms' && styles.titleTextSelected]}>Ms.</Text>
              {formData.title === 'Ms' && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>First name</Text>
            <TextInput
              style={[
                styles.input,
                formData.firstName && isFirstNameValid && styles.inputValid
              ]}
              value={formData.firstName}
              onChangeText={(value) => updateFormData('firstName', value)}
              placeholder="Enter your first name"
              placeholderTextColor="#CCCCCC"
            />
            {formData.firstName && isFirstNameValid && (
              <View style={[styles.checkmark, styles.checkmarkAbsolute]}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Last name</Text>
            <TextInput
              style={[
                styles.input,
                formData.lastName && isLastNameValid && styles.inputValid
              ]}
              value={formData.lastName}
              onChangeText={(value) => updateFormData('lastName', value)}
              placeholder="Enter your last name"
              placeholderTextColor="#CCCCCC"
            />
            {formData.lastName && isLastNameValid && (
              <View style={[styles.checkmark, styles.checkmarkAbsolute]}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
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
              style={[
                styles.input,
                formData.email && isEmailValid && styles.inputValid
              ]}
              value={formData.email}
              onChangeText={(value) => updateFormData('email', value)}
              placeholder="Enter your email address"
              placeholderTextColor="#CCCCCC"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {formData.email && isEmailValid && (
              <View style={[styles.checkmark, styles.checkmarkAbsolute]}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nationality</Text>
            <TouchableOpacity 
              style={[
                styles.dropdownButton,
                formData.nationality && isNationalityValid && styles.dropdownButtonValid
              ]}
              onPress={() => setShowNationalityDropdown(!showNationalityDropdown)}
            >
              <Text style={styles.dropdownButtonText}>{formData.nationality}</Text>
              <IconSymbol name="chevron.down" size={16} color="#CCCCCC" />
            </TouchableOpacity>
            {showNationalityDropdown && (
              <View style={styles.dropdownList}>
                <ScrollView style={styles.dropdownScrollView} nestedScrollEnabled={true}>
                  {nationalityOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.dropdownItem,
                        formData.nationality === option && styles.dropdownItemSelected
                      ]}
                      onPress={() => {
                        updateFormData('nationality', option);
                        setShowNationalityDropdown(false);
                      }}
                    >
                      <Text style={[
                        styles.dropdownItemText,
                        formData.nationality === option && styles.dropdownItemTextSelected
                      ]}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Date of Birth</Text>
            <TouchableOpacity 
              style={[
                styles.datePickerButton,
                formData.dateOfBirth && isDateOfBirthValid && styles.datePickerButtonValid
              ]} 
              onPress={openDatePicker}
              activeOpacity={0.7}
            >
              <Text style={[styles.datePickerText, !formData.dateOfBirth && styles.datePickerPlaceholder]}>
                {formData.dateOfBirth || 'Select your date of birth'}
              </Text>
              <IconSymbol name="calendar" size={20} color="#CCCCCC" />
            </TouchableOpacity>
            
            
            {showDatePicker && Platform.OS === 'android' && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}
          </View>

          <View style={styles.checkboxContainer}>
            <TouchableOpacity 
              style={[styles.checkbox, formData.agreeToNews && styles.checkboxChecked]}
              onPress={() => updateFormData('agreeToNews', !formData.agreeToNews)}
            >
              {formData.agreeToNews && (
                <Text style={styles.checkboxCheckmark}>✓</Text>
              )}
            </TouchableOpacity>
            <Text style={styles.checkboxText}>
              I&apos;d like to receive the latest news and promotions.
            </Text>
          </View>

          <View style={styles.checkboxContainer}>
            <TouchableOpacity 
              style={[styles.checkbox, formData.agreeToTerms && styles.checkboxChecked]}
              onPress={() => updateFormData('agreeToTerms', !formData.agreeToTerms)}
            >
              {formData.agreeToTerms && (
                <Text style={styles.checkboxCheckmark}>✓</Text>
              )}
            </TouchableOpacity>
            <Text style={styles.checkboxText}>
              I agree the <Text style={styles.linkText}>terms</Text> and <Text style={styles.linkText}>privacy policy</Text>
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
      
      {/* iOS Date Picker Modal */}
      {showDatePicker && Platform.OS === 'ios' && (
        <View style={styles.iosDatePickerOverlay}>
          <TouchableOpacity 
            style={styles.iosDatePickerBackground} 
            onPress={handleDatePickerCancel}
          />
          <View style={styles.iosDatePickerModal}>
            <View style={styles.datePickerHeader}>
              <TouchableOpacity onPress={handleDatePickerCancel} style={styles.datePickerHeaderButton}>
                <Text style={styles.datePickerHeaderText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDatePickerDone} style={styles.datePickerHeaderButton}>
                <Text style={styles.datePickerHeaderText}>Done</Text>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="spinner"
              onChange={(event, date) => {
                if (date) {
                  setSelectedDate(date);
                  // Don't update form data here - only update when Done is pressed
                }
              }}
              maximumDate={new Date()}
              style={styles.iosDatePicker}
            />
          </View>
        </View>
      )}
      
      <SuccessAlert
        visible={showSuccessAlert}
        onClose={() => setShowSuccessAlert(false)}
        title={`Welcome ${formData.firstName || 'to Active Club'}!`}
        message="Your Active Club account has been successfully created!"
      />
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
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#F5F5F5',
  },
  content: {
    paddingHorizontal: 30,
    paddingTop: 20,
    paddingBottom: 50,
    backgroundColor: '#F5F5F5',
  },
  titleRow: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 15,
  },
  titleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    padding: 15,
    backgroundColor: '#FFFFFF',
  },
  titleButtonSelected: {
    borderColor: '#F1C229',
  },
  titleText: {
    fontSize: 16,
    color: '#000000',
    fontFamily: 'Roboto',
  },
  titleTextSelected: {
    color: '#000000',
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F1C229',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    padding: 15,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  datePickerButtonValid: {
    borderColor: '#F1C229',
  },
  datePickerText: {
    fontSize: 16,
    color: '#000000',
    fontFamily: 'Roboto',
  },
  datePickerPlaceholder: {
    color: '#CCCCCC',
  },
  iosDatePickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  iosDatePickerBackground: {
    flex: 1,
  },
  iosDatePickerModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  datePickerHeaderButton: {
    padding: 5,
  },
  datePickerHeaderText: {
    fontSize: 16,
    color: '#007AFF',
    fontFamily: 'Roboto',
    fontWeight: '600',
  },
  iosDatePicker: {
    backgroundColor: '#FFFFFF',
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
    borderRadius: 6,
    padding: 15,
    paddingRight: 50,
    fontSize: 16,
    color: '#000000',
    backgroundColor: '#FFFFFF',
    fontFamily: 'Roboto',
  },
  inputValid: {
    borderColor: '#F1C229',
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
  checkmarkAbsolute: {
    position: 'absolute',
    right: 15,
    top: '50%',
    transform: [{ translateY: 1}],
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    padding: 15,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownButtonValid: {
    borderColor: '#F1C229',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#000000',
    fontFamily: 'Roboto',
  },
  dropdownList: {
    position: 'absolute',
    top: 75,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    maxHeight: 200,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownScrollView: {
    maxHeight: 200,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemSelected: {
    backgroundColor: '#F1C229',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#000000',
    fontFamily: 'Roboto',
  },
  dropdownItemTextSelected: {
    color: '#000000',
    fontWeight: 'bold',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 3,
    marginRight: 12,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  checkboxCheckmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    color: '#000000',
    lineHeight: 20,
    fontFamily: 'Roboto',
  },
  linkText: {
    color: '#000000',
    textDecorationLine: 'underline',
  },
  createButton: {
    backgroundColor: '#F1C229',
    paddingVertical: 15,
    borderRadius: 6,
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