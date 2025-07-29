import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  SafeAreaView,
} from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [language] = useState('العربية');

  const SettingsSection = ({ title, icon }: { title: string; icon: string }) => (
    <View style={[styles.sectionHeader, { backgroundColor: colors.background }]}>
      <IconSymbol name={icon as any} size={20} color="#F5A623" />
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
          <IconSymbol name="gearshape.fill" size={24} color="#F5A623" />
          <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
        </View>

        <View style={styles.content}>
          <SettingsSection title="Settings" icon="gearshape.fill" />
          
          <SettingsItem
            title="Email notifications"
            rightElement={
              <Switch
                value={emailNotifications}
                onValueChange={setEmailNotifications}
                trackColor={{ false: '#767577', true: '#F5A623' }}
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
                trackColor={{ false: '#767577', true: '#F5A623' }}
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

          <TouchableOpacity 
            style={[styles.logoutButton, { borderColor: colors.border }]}
            onPress={() => {}}
          >
            <IconSymbol name="arrow.right.square" size={20} color={colors.text} />
            <Text style={[styles.logoutText, { color: colors.text }]}>Logout</Text>
          </TouchableOpacity>
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
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 10,
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
});