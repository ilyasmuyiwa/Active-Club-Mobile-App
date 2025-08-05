import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useUser } from '../../contexts/UserContext';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { logout, phoneNumber, isAuthenticated } = useUser();
  
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [language] = useState('English');

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              // Navigate to login screen
              router.replace('/screens/LoginScreen');
            } catch (error) {
              console.error('Error during logout:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ],
    );
  };

  const SettingsSection = ({ title, icon }: { title: string; icon: string }) => (
    <View style={[styles.sectionHeader, { backgroundColor: colors.background }]}>
      <IconSymbol name={icon as any} size={20} color="#F1C229" />
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
    </View>
  );

  const SettingsItem = ({ 
    title, 
    onPress, 
    rightElement 
  }: { 
    title: string; 
    onPress?: () => void; 
    rightElement?: React.ReactNode;
  }) => (
    <TouchableOpacity 
      style={[styles.settingsItem, { backgroundColor: colors.background }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <Text style={[styles.itemText, { color: colors.text }]}>{title}</Text>
      {rightElement || (
        <IconSymbol name="chevron.right" size={20} color={colors.icon} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol name="arrow.left" size={28} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
          <View style={styles.backButton} />
        </View>

        <View style={styles.content}>
          <SettingsSection title="Settings" icon="gearshape.fill" />
          
          <SettingsItem
            title="Email notifications"
            rightElement={
              <Switch
                value={emailNotifications}
                onValueChange={setEmailNotifications}
                trackColor={{ false: '#767577', true: '#F1C229' }}
                thumbColor={emailNotifications ? '#FFF' : '#f4f3f4'}
              />
            }
          />
          
          <SettingsItem
            title="SMS notifications"
            rightElement={
              <Switch
                value={smsNotifications}
                onValueChange={setSmsNotifications}
                trackColor={{ false: '#767577', true: '#F1C229' }}
                thumbColor={smsNotifications ? '#FFF' : '#f4f3f4'}
              />
            }
          />
          
          <SettingsItem
            title="Language"
            rightElement={
              <Text style={[styles.languageText, { color: colors.text }]}>
                {language}
              </Text>
            }
            onPress={() => {}}
          />
          
          <SettingsItem
            title="My Level & Rewards"
            onPress={() => router.push('/user-level')}
          />

          <SettingsSection title="Help" icon="questionmark.circle.fill" />
          
          <SettingsItem
            title="FAQs"
            onPress={() => router.push('/faq')}
          />
          
          <SettingsItem
            title="Contact us"
            onPress={() => router.push('/contact')}
          />

          <SettingsSection title="Legal" icon="doc.text.fill" />
          
          <SettingsItem
            title="Terms and conditions"
            onPress={() => router.push('/terms')}
          />
          
          <SettingsItem
            title="Privacy policy"
            onPress={() => router.push('/privacy')}
          />

          {/* Show logout button only if authenticated */}
          {isAuthenticated && (
            <>
              {/* Session Info */}
              <SettingsSection title="Account" icon="person.fill" />
              
              <SettingsItem
                title="Phone Number"
                rightElement={
                  <Text style={[styles.phoneText, { color: colors.icon }]}>
                    {phoneNumber ? `${phoneNumber}` : 'Not set'}
                  </Text>
                }
              />
              
              <TouchableOpacity 
                style={[styles.logoutButton, { borderColor: '#FF6B6B' }]}
                onPress={handleLogout}
              >
                <IconSymbol name="arrow.right.square" size={20} color="#FF6B6B" />
                <Text style={[styles.logoutText, { color: '#FF6B6B' }]}>Logout</Text>
              </TouchableOpacity>
            </>
          )}
          
          {!isAuthenticated && (
            <TouchableOpacity 
              style={[styles.loginButton, { backgroundColor: '#F1C229' }]}
              onPress={() => router.push('/screens/LoginScreen')}
            >
              <IconSymbol name="arrow.right.square" size={20} color="#000" />
              <Text style={[styles.loginText, { color: '#000' }]}>Login</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
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
    fontSize: 24,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 15,
    paddingHorizontal: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 1,
    borderRadius: 10,
  },
  itemText: {
    fontSize: 16,
  },
  languageText: {
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 15,
    marginTop: 30,
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 10,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
  },
  phoneText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 15,
    marginTop: 30,
    marginBottom: 20,
    borderRadius: 10,
  },
  loginText: {
    fontSize: 16,
    fontWeight: '600',
  },
});