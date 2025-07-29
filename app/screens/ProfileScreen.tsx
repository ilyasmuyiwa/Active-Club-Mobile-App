import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Smith');
  const [mobileNumber, setMobileNumber] = useState('+974 98988787');
  const [email, setEmail] = useState('john_smith@gmail.com');
  const [nationality, setNationality] = useState('Qatar');
  const [dateOfBirth, setDateOfBirth] = useState('12/03/1998');

  const handleSave = () => {
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleChangeProfilePicture = () => {
    Alert.alert('Info', 'Profile picture change coming soon!');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
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
              onPress={handleChangeProfilePicture}
            >
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' }}
                style={styles.profileImage}
              />
              <View style={styles.editIconContainer}>
                <IconSymbol name="camera.fill" size={16} color="white" />
              </View>
            </TouchableOpacity>
            
            <View style={styles.customerInfo}>
              <Text style={[styles.customerIdLabel, { color: colors.text }]}>Customer ID</Text>
              <Text style={[styles.customerId, { color: colors.text }]}>3213554</Text>
            </View>
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
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Nationality</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.card,
                    color: colors.text,
                    borderColor: colors.border,
                  }
                ]}
                value={nationality}
                onChangeText={setNationality}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Date of Birth</Text>
              <View style={styles.inputWithIcon}>
                <TextInput
                  style={[
                    styles.input,
                    styles.inputWithCalendar,
                    {
                      backgroundColor: colors.card,
                      color: colors.text,
                      borderColor: colors.border,
                    }
                  ]}
                  value={dateOfBirth}
                  onChangeText={setDateOfBirth}
                />
                <IconSymbol name="calendar" size={16} color={colors.icon} style={styles.calendarIcon} />
              </View>
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#F5A623',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customerInfo: {
    alignItems: 'center',
  },
  customerIdLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 2,
  },
  customerId: {
    fontSize: 20,
    fontWeight: '600',
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
    backgroundColor: '#F5A623',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});