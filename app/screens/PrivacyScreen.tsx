import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';

export default function PrivacyScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="arrow.left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Privacy Policy</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Privacy Policy</Text>
        
        <Text style={[styles.sectionHeader, { color: colors.text }]}>Consent and Information Collection</Text>
        <Text style={[styles.text, { color: colors.text }]}>By enrolling in the Active Club Program, you grant TBI consent to collect, retain, use, and disclose your personal information including:</Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>• Name</Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>• Email</Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>• Addresses</Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>• Contact numbers</Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>• Date of birth</Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>• Transaction details</Text>
        
        <Text style={[styles.sectionHeader, { color: colors.text }]}>Purposes of Information Use</Text>
        <Text style={[styles.text, { color: colors.text }]}>Your information will be used for the following purposes:</Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>• Efficiently run the Program</Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>• Provide Program information</Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>• Develop and offer new products and services</Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>• Accounting and audit purposes</Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>• Marketing and market research</Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>• Legal disclosure requirements</Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>• Send communications about promotions</Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>• Assist in Program planning and implementation</Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>• Share with Program Partners</Text>
        
        <Text style={[styles.sectionHeader, { color: colors.text }]}>Consent Duration</Text>
        <Text style={[styles.text, { color: colors.text }]}>Your consent continues in effect unless withdrawn in writing. Please note that:</Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>• Withdrawal may result in service limitations</Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>• TBI can terminate membership at its discretion</Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>• Consent is unconditional</Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>• Information may be shared with Program Partners</Text>
        
        <Text style={[styles.text, { color: colors.text }]}>Users can withdraw consent by providing written notice to TBI. We recommend that you carefully review this policy and understand the implications of your consent.</Text>
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
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  bulletPoint: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 5,
    marginLeft: 10,
  },
});