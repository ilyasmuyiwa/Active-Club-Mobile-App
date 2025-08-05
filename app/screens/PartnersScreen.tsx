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
import { SvgXml } from 'react-native-svg';
import { ScIconSvg } from '../../assets/ScIcon';
import { RknIconSvg } from '../../assets/RknIcon';
import { LiningIconSvg } from '../../assets/LiningIcon';

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
    icon: 'sc',
  },
  {
    id: '2',
    name: 'RKN',
    storeCount: '1 Store',
    icon: 'rkn',
  },
  {
    id: '3',
    name: 'Li-Ning',
    storeCount: '1 Store',
    icon: 'lining',
  },
];

export default function PartnersScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getPartnerIcon = (iconType: string) => {
    switch (iconType) {
      case 'sc':
        return <SvgXml xml={ScIconSvg} width={28} height={28} color="#333" />;
      case 'rkn':
        return <SvgXml xml={RknIconSvg} width={32} height={26} color="#333" />;
      case 'lining':
        return <SvgXml xml={LiningIconSvg} width={40} height={16} color="#333" />;
      default:
        return <MaterialCommunityIcons name="store" size={28} color="#333" />;
    }
  };

  const PartnerCard = ({ partner }: { partner: Partner }) => (
    <TouchableOpacity style={styles.partnerCard}>
      <View style={styles.partnerIcon}>
        {getPartnerIcon(partner.icon)}
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
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="arrow.left" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Partners</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView 
        style={[styles.content, { backgroundColor: '#E8E8E8' }]} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.loyaltySection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Loyalty Partners
          </Text>
          <Text style={[styles.sectionDescription, { color: colors.icon }]}>
            We&apos;ve teamed up with top sportswear brands to bring you even more ways to enjoy your loyalty benefits. Earn points as you shop with our trusted partners and stay tuned, more exciting names are on the way.
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
    paddingTop: 15,
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
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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