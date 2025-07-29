import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Linking,
} from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';

export default function ContactScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleCallSupport = () => {
    Linking.openURL('tel:+1234567890');
  };

  const handleGetInTouch = () => {
    router.push('/(tabs)/contact-form' as any);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Contact us</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.content}>
        <TouchableOpacity 
          style={[styles.contactOption, { backgroundColor: colors.card }]}
          onPress={handleCallSupport}
        >
          <IconSymbol name="phone.fill" size={24} color="#F5A623" />
          <Text style={[styles.optionText, { color: colors.text }]}>
            Reach our customer support
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.contactOption, { backgroundColor: colors.card }]}
          onPress={handleGetInTouch}
        >
          <IconSymbol name="envelope.fill" size={24} color="#F5A623" />
          <Text style={[styles.optionText, { color: colors.text }]}>
            Get in touch
          </Text>
        </TouchableOpacity>
      </View>
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
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  contactOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginBottom: 15,
    borderRadius: 10,
    gap: 15,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
  },
});