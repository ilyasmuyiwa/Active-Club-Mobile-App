import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';

interface Partner {
  id: string;
  name: string;
  storeCount: string;
  icon: string;
  description?: string;
}

const partnersData: Partner[] = [
  {
    id: '1',
    name: 'Sports Corner',
    storeCount: '10 Stores',
    icon: 'play',
  },
  {
    id: '2',
    name: 'RKN',
    storeCount: '1 Store',
    icon: 'dumbbell',
  },
  {
    id: '3',
    name: 'Li-Ning',
    storeCount: '1 Store',
    icon: 'shoe-print',
  },
];

export default function PartnersScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const PartnerCard = ({ partner }: { partner: Partner }) => (
    <TouchableOpacity style={[styles.partnerCard, { backgroundColor: colors.card }]}>
      <View style={styles.partnerIcon}>
        <MaterialCommunityIcons 
          name={partner.icon as any} 
          size={32} 
          color="#333" 
        />
      </View>
      
      <View style={styles.partnerInfo}>
        <Text style={[styles.partnerName, { color: colors.text }]}>
          {partner.name}
        </Text>
        <Text style={[styles.storeCount, { color: colors.icon }]}>
          {partner.storeCount}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Partners</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.loyaltySection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Loyalty Partners
          </Text>
          <Text style={[styles.sectionDescription, { color: colors.icon }]}>
            We've teamed up with top sportswear brands to bring you even more ways to enjoy your loyalty benefits. Earn points as you shop with our trusted partners and stay tuned, more exciting names are on the way.
          </Text>
        </View>

        <View style={styles.partnersGrid}>
          {partnersData.map((partner) => (
            <PartnerCard key={partner.id} partner={partner} />
          ))}
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
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  loyaltySection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 15,
  },
  sectionDescription: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  partnersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  partnerCard: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 15,
  },
  partnerIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  partnerInfo: {
    alignItems: 'center',
  },
  partnerName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  storeCount: {
    fontSize: 11,
    textAlign: 'center',
  },
});