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

export default function TermsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="arrow.left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Terms and Conditions</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Active Club Rewards Program</Text>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Terms & Conditions</Text>
        
        <Text style={[styles.sectionHeader, { color: colors.text }]}>Program Overview</Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>• Operated by The Blue Insights (TBI)</Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>• Free loyalty program for individuals 18 years and older</Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>• Earn points through purchases at participating outlets</Text>
        
        <Text style={[styles.sectionHeader, { color: colors.text }]}>Membership Tiers</Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>• Active Go (0-9,999 QAR spend)</Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>• Active Fit (10,000-29,999 QAR spend)</Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>• Active Pro (30,000+ QAR spend)</Text>
        
        <Text style={[styles.sectionHeader, { color: colors.text }]}>Point Earning Rules</Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>• Points credited after in-store or online purchases</Text>
        <Text style={[styles.text, { color: colors.text }]}>Point rates vary by tier:</Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>• Active Go: 1 point per 3 QAR</Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>• Active Fit: 1 point per 2 QAR</Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>• Active Pro: 1 point per 1 QAR</Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>• Points valid for 12 months</Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>• Half points during sales</Text>
        
        <Text style={[styles.sectionHeader, { color: colors.text }]}>Key Restrictions</Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>• Membership is non-transferable</Text>
        <Text style={[styles.text, { color: colors.text }]}>TBI can cancel membership for:</Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>• Fraud</Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>• Inactivity (12 months)</Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>• Misuse of membership</Text>
        
        <Text style={[styles.sectionHeader, { color: colors.text }]}>Data and Privacy</Text>
        <Text style={[styles.text, { color: colors.text }]}>TBI can collect and use member information for:</Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>• Program management</Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>• Marketing</Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>• Research</Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>• Communication</Text>
        
        <Text style={[styles.sectionHeader, { color: colors.text }]}>Redemption Guidelines</Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>• Minimum 300 points for redemption</Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>• Points cannot be exchanged for cash</Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>• No redemptions during sales periods</Text>
        
        <Text style={[styles.sectionHeader, { color: colors.text }]}>Important Notes</Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>• Terms subject to change</Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>• Governed by Qatar laws</Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>• TBI reserves right to modify program without notice</Text>
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