import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getNationalityOptions } from '../../utils/nationalities';
import { capillaryApi, CustomerData } from '../../services/capillaryApi';
import { useUser } from '../../contexts/UserContext';
import SuccessAlert from '@/components/SuccessAlert';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { phoneNumber, refreshCustomerData } = useUser();
  
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [nationality, setNationality] = useState('Qatar');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showNationalityDropdown, setShowNationalityDropdown] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ title: '', message: '', type: 'success' as 'success' | 'error' });
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Track original values to detect changes
  const [originalData, setOriginalData] = useState({
    firstName: '',
    lastName: '',
    nationality: 'Qatar',
    dateOfBirth: ''
  });
  
  // Use phone number from context, fallback to demo number
  const userMobile = phoneNumber || '98988787';
  
  // Fallback data for when API fails or no customer data
  const fallbackData = {
    firstName: 'John',
    lastName: 'Smith',
    mobileNumber: '+974 98988787',
    email: 'john_smith@gmail.com',
    customerId: '3213554',
    dateOfBirth: '12/03/1998',
  };

  const nationalityOptions = getNationalityOptions();
  
  useEffect(() => {
    if (userMobile) {
      fetchCustomerData();
    }
  }, [userMobile]);

  // Clear alert state when component mounts to prevent stale alerts
  useEffect(() => {
    setShowSuccessAlert(false);
  }, []);
  
  // Debug state changes
  useEffect(() => {
    console.log('🔍 ProfileScreen State Update:', {
      firstName,
      lastName,
      mobileNumber,
      email,
      loading
    });
  }, [firstName, lastName, mobileNumber, email, loading]);
  
  const fetchCustomerData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔵 ProfileScreen: Fetching customer data for:', userMobile);
      const result = await capillaryApi.getCustomerByMobile(userMobile);
      console.log('🔵 ProfileScreen: API result:', result);
      
      if (result.customer) {
        console.log('✅ ProfileScreen: Customer found, setting data');
        setCustomerData(result.customer);
        populateFormWithApiData(result.customer);
        // Set loading to false after data is populated
        setLoading(false);
      } else {
        if (result.error?.type === 'not_found') {
          setError('Customer not found');
        } else {
          setError('Failed to load data');
        }
        // Keep fields empty when customer not found
        clearAllFields();
        setLoading(false);
      }
    } catch (err) {
      console.error('Error fetching customer data:', err);
      setError('Failed to load data');
      // Keep fields empty when API fails
      clearAllFields();
      setLoading(false);
    }
  };
  
  const populateFormWithApiData = (data: CustomerData) => {
    console.log('🔵 ProfileScreen: Populating form with data:', data);
    
    // Only set fields if they exist in API, otherwise leave empty
    console.log('🔵 ProfileScreen: Setting firstName:', data.firstname);
    console.log('🔵 ProfileScreen: Setting lastName:', data.lastname);
    const firstName = data.firstname || '';
    const lastName = data.lastname || '';
    setFirstName(firstName);
    setLastName(lastName);
    
    // Format mobile number properly - API already includes country code
    if (data.mobile) {
      // Check if mobile already starts with country code
      if (data.mobile.startsWith('974')) {
        setMobileNumber(`+${data.mobile}`);
      } else {
        setMobileNumber(`+974 ${data.mobile}`);
      }
    } else {
      setMobileNumber('');
    }
    
    setEmail(data.email || '');
    
    // Try to get nationality from custom fields - keep default if not found
    const nationalityField = capillaryApi.getCustomField(data, 'nationality');
    const nationality = nationalityField || 'Qatar';
    setNationality(nationality);
    
    // Try to get date of birth from extended fields - API uses 'dob_date'
    const dobField = capillaryApi.getExtendedField(data, 'dob_date') || 
                     capillaryApi.getExtendedField(data, 'date_of_birth') ||
                     capillaryApi.getCustomField(data, 'date_of_birth');
    let dateOfBirth = '';
    if (dobField) {
      // Parse API date format (YYYY-MM-DD) to display format (DD/MM/YYYY)
      try {
        const dateObj = new Date(dobField);
        if (!isNaN(dateObj.getTime())) {
          setSelectedDate(dateObj);
          dateOfBirth = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`;
          setDateOfBirth(dateOfBirth);
        }
      } catch (e) {
        console.log('Could not parse date:', dobField);
        setDateOfBirth(''); // Leave empty if parsing fails
      }
    } else {
      setDateOfBirth(''); // Leave empty if no date found
    }
    
    // Store original values for change detection
    setOriginalData({
      firstName,
      lastName,
      nationality,
      dateOfBirth
    });
    
    console.log('✅ ProfileScreen: Form population complete');
  };
  
  const clearAllFields = () => {
    setFirstName('');
    setLastName('');
    setMobileNumber('');
    setEmail('');
    setDateOfBirth('');
    setNationality('Qatar'); // Keep default nationality
    setSelectedDate(new Date()); // Keep default date
    
    // Clear original data as well
    setOriginalData({
      firstName: '',
      lastName: '',
      nationality: 'Qatar',
      dateOfBirth: ''
    });
  };

  // Check if any data has actually changed
  const hasDataChanged = () => {
    const currentData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      nationality: nationality.trim(),
      dateOfBirth: dateOfBirth.trim()
    };
    
    const originalDataTrimmed = {
      firstName: originalData.firstName.trim(),
      lastName: originalData.lastName.trim(),
      nationality: originalData.nationality.trim(),
      dateOfBirth: originalData.dateOfBirth.trim()
    };
    
    return (
      currentData.firstName !== originalDataTrimmed.firstName ||
      currentData.lastName !== originalDataTrimmed.lastName ||
      currentData.nationality !== originalDataTrimmed.nationality ||
      currentData.dateOfBirth !== originalDataTrimmed.dateOfBirth
    );
  };

  const handleSave = async () => {
    if (isUpdating) return;
    
    // Check if any data has actually changed
    if (!hasDataChanged()) {
      console.log('🔵 ProfileScreen: No changes detected, skipping API call');
      setAlertMessage({
        title: 'No Changes',
        message: 'No changes were made to your profile.',
        type: 'error'
      });
      setShowSuccessAlert(true);
      return;
    }
    
    setIsUpdating(true);
    console.log('🔵 ProfileScreen: Changes detected, updating profile...');
    
    try {
      // Convert date format from DD/MM/YYYY to YYYY-MM-DD for API
      let apiDateOfBirth = '';
      if (dateOfBirth) {
        const parts = dateOfBirth.split('/');
        if (parts.length === 3) {
          apiDateOfBirth = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
      }
      
      const updateData = {
        firstname: firstName.trim(),
        lastname: lastName.trim(),
        nationality: nationality.trim(),
        dob: apiDateOfBirth
      };
      
      console.log('🔵 ProfileScreen: Update data:', updateData);
      
      const result = await capillaryApi.updateCustomerProfile(userMobile, updateData);
      
      if (result.success) {
        console.log('✅ ProfileScreen: Profile updated successfully');
        setAlertMessage({
          title: 'Success!',
          message: result.message,
          type: 'success'
        });
        setShowSuccessAlert(true);
        
        // Trigger refresh in HomeScreen and other components
        refreshCustomerData();
        
        // Auto-close alert and refresh local data after successful update
        setTimeout(() => {
          setShowSuccessAlert(false);
          fetchCustomerData();
        }, 1500);
      } else {
        console.log('❌ ProfileScreen: Profile update failed');
        setAlertMessage({
          title: 'Update Failed',
          message: result.message,
          type: 'error'
        });
        setShowSuccessAlert(true);
      }
    } catch (error) {
      console.error('🔴 ProfileScreen: Error updating profile:', error);
      setAlertMessage({
        title: 'Error',
        message: 'An unexpected error occurred. Please try again.',
        type: 'error'
      });
      setShowSuccessAlert(true);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDateChange = (event: any, date?: Date) => {
    if (event.type === 'dismissed' || event.type === 'neutralButtonPressed') {
      setShowDatePicker(false);
      return;
    }
    
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (date) {
      setSelectedDate(date);
      const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
      setDateOfBirth(formattedDate);
      
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
    setDateOfBirth(formattedDate);
    setShowDatePicker(false);
  };

  const handleDatePickerCancel = () => {
    if (dateOfBirth) {
      const parts = dateOfBirth.split('/');
      const existingDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
      setSelectedDate(existingDate);
    } else {
      setSelectedDate(new Date());
    }
    setShowDatePicker(false);
  };

  // Show loading indicator
  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol name="arrow.left" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
          <View style={styles.backButton} />
        </View>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F1C229" />
          <Text style={styles.loadingText}>Loading your profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="arrow.left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
        <View style={styles.backButton} />
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.profileSection}>
            <TouchableOpacity 
              style={styles.profileImageContainer}
              onPress={() => {
                setAlertMessage({
                  title: 'Info',
                  message: 'Profile picture change coming soon!',
                  type: 'error'
                });
                setShowSuccessAlert(true);
              }}
            >
              <View style={styles.avatarContainer}>
                <IconSymbol name="person.fill" size={40} color="#666" />
              </View>
              <View style={styles.editIconContainer}>
                <IconSymbol name="camera.fill" size={16} color="white" />
              </View>
            </TouchableOpacity>
            
            {error && (
              <Text style={styles.errorText}>Using offline data</Text>
            )}
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>First name</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.card,
                    color: colors.text,
                    borderColor: colors.border,
                  }
                ]}
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Last name</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.card,
                    color: colors.text,
                    borderColor: colors.border,
                  }
                ]}
                value={lastName}
                onChangeText={setLastName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Mobile number</Text>
              <View style={styles.inputWithIcon}>
                <TextInput
                  style={[
                    styles.input,
                    styles.inputWithLock,
                    {
                      backgroundColor: colors.card,
                      color: colors.text,
                      borderColor: colors.border,
                    }
                  ]}
                  value={mobileNumber}
                  onChangeText={setMobileNumber}
                  editable={false}
                />
                <IconSymbol name="lock.fill" size={16} color={colors.icon} style={styles.lockIcon} />
              </View>
              <Text style={styles.helperText}>Mobile number cannot be changed</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Email</Text>
              <View style={styles.inputWithIcon}>
                <TextInput
                  style={[
                    styles.input,
                    styles.inputWithLock,
                    {
                      backgroundColor: colors.card,
                      color: colors.text,
                      borderColor: colors.border,
                    }
                  ]}
                  value={email}
                  onChangeText={setEmail}
                  editable={false}
                  keyboardType="email-address"
                />
                <IconSymbol name="lock.fill" size={16} color={colors.icon} style={styles.lockIcon} />
              </View>
              <Text style={styles.helperText}>Email cannot be changed</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Nationality</Text>
              <TouchableOpacity 
                style={[
                  styles.dropdownButton,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  }
                ]}
                onPress={() => setShowNationalityDropdown(!showNationalityDropdown)}
              >
                <Text style={[styles.dropdownButtonText, { color: colors.text }]}>{nationality}</Text>
                <IconSymbol name="chevron.down" size={16} color={colors.icon} />
              </TouchableOpacity>
              {showNationalityDropdown && (
                <View style={[styles.dropdownList, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <ScrollView style={styles.dropdownScrollView} nestedScrollEnabled={true}>
                    {nationalityOptions.map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.dropdownItem,
                          nationality === option && styles.dropdownItemSelected
                        ]}
                        onPress={() => {
                          setNationality(option);
                          setShowNationalityDropdown(false);
                        }}
                      >
                        <Text style={[
                          styles.dropdownItemText,
                          { color: colors.text },
                          nationality === option && styles.dropdownItemTextSelected
                        ]}>
                          {option}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Date of Birth</Text>
              <TouchableOpacity 
                style={[
                  styles.datePickerButton,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  }
                ]} 
                onPress={openDatePicker}
                activeOpacity={0.7}
              >
                <Text style={[styles.datePickerText, { color: colors.text }]}>
                  {dateOfBirth || 'Select your date of birth'}
                </Text>
                <IconSymbol name="calendar" size={20} color={colors.icon} />
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

            <TouchableOpacity
              style={[styles.saveButton, isUpdating && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.saveButtonText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      
      {/* iOS Date Picker Modal */}
      {showDatePicker && Platform.OS === 'ios' && (
        <View style={styles.iosDatePickerOverlay}>
          <TouchableOpacity 
            style={styles.iosDatePickerBackground} 
            onPress={handleDatePickerCancel}
          />
          <View style={[styles.iosDatePickerModal, { backgroundColor: colors.card }]}>
            <View style={[styles.datePickerHeader, { backgroundColor: colors.background }]}>
              <TouchableOpacity onPress={handleDatePickerCancel} style={styles.datePickerHeaderButton}>
                <Text style={[styles.datePickerHeaderText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDatePickerDone} style={styles.datePickerHeaderButton}>
                <Text style={[styles.datePickerHeaderText, { color: colors.text }]}>Done</Text>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="spinner"
              onChange={(event, date) => {
                if (date) {
                  setSelectedDate(date);
                }
              }}
              maximumDate={new Date()}
              style={[styles.iosDatePicker, { backgroundColor: colors.card }]}
            />
          </View>
        </View>
      )}
      
      <SuccessAlert
        visible={showSuccessAlert}
        onClose={() => setShowSuccessAlert(false)}
        title={alertMessage.title}
        message={alertMessage.message}
        type={alertMessage.type}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    width: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileSection: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 30,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#F1C229',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    paddingBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    opacity: 0.8,
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 4,
  },
  input: {
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
  },
  inputWithIcon: {
    position: 'relative',
  },
  inputWithLock: {
    paddingRight: 45,
  },
  inputWithCalendar: {
    paddingRight: 45,
  },
  lockIcon: {
    position: 'absolute',
    right: 15,
    top: 17,
  },
  calendarIcon: {
    position: 'absolute',
    right: 15,
    top: 17,
  },
  saveButton: {
    backgroundColor: '#F1C229',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonDisabled: {
    backgroundColor: 'rgba(241, 194, 41, 0.5)',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  dropdownButton: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownButtonText: {
    fontSize: 16,
  },
  dropdownList: {
    position: 'absolute',
    top: 75,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderRadius: 10,
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
  },
  dropdownItemTextSelected: {
    fontWeight: 'bold',
  },
  datePickerButton: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  datePickerText: {
    fontSize: 16,
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
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    fontWeight: '600',
  },
  iosDatePicker: {
    height: 200,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 12,
    color: '#FF6B6B',
    fontStyle: 'italic',
    marginTop: 4,
  },
});