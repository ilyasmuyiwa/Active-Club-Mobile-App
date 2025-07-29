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

interface LevelTier {
  id: string;
  name: string;
  points: string;
  icon: string;
  color: string;
  isActive: boolean;
  isCompleted: boolean;
}

const levelTiers: LevelTier[] = [
  {
    id: '1',
    name: 'ActiveGo',
    points: '0 pts',
    icon: 'numeric-3-circle',
    color: '#FF9800',
    isActive: false,
    isCompleted: true,
  },
  {
    id: '2',
    name: 'ActiveFit',
    points: '15,000 pts',
    icon: 'numeric-2-circle',
    color: '#9E9E9E',
    isActive: true,
    isCompleted: false,
  },
  {
    id: '3',
    name: 'ActivePro',
    points: '25,000 pts',
    icon: 'numeric-1-circle',
    color: '#FFD700',
    isActive: false,
    isCompleted: false,
  },
];

const currentUserData = {
  currentPoints: 22426,
  currentReward: 736,
  currentLevel: 'ActiveFit',
  expiryDate: '03/2025',
};

export default function UserLevelScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const LevelCard = ({ level }: { level: LevelTier }) => (
    <TouchableOpacity 
      style={[
        styles.levelCard,
        { 
          backgroundColor: colors.card,
          borderColor: level.isActive ? '#F5A623' : 'transparent',
          borderWidth: level.isActive ? 2 : 0,
        }
      ]}
    >
      <View style={[styles.levelIcon, { backgroundColor: level.color + '20' }]}>
        <MaterialCommunityIcons 
          name={level.icon as any} 
          size={32} 
          color={level.color} 
        />
      </View>
      
      <View style={styles.levelInfo}>
        <Text style={[styles.levelName, { color: colors.text }]}>
          {level.name}
        </Text>
        <Text style={[styles.levelPoints, { color: colors.icon }]}>
          {level.points}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const ProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: '60%' }]} />
      </View>
      <View style={styles.progressDots}>
        <View style={[styles.dot, styles.completedDot]} />
        <View style={[styles.dot, styles.activeDot]} />
        <View style={[styles.dot, styles.inactiveDot]} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>User Level</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Current Level Status */}
        <View style={[styles.statusCard, { backgroundColor: colors.card }]}>
          <View style={styles.statusHeader}>
            <View style={styles.statusIcon}>
              <MaterialCommunityIcons 
                name="numeric-2-circle" 
                size={32} 
                color="#9E9E9E" 
              />
            </View>
            <View style={styles.statusInfo}>
              <Text style={[styles.statusLabel, { color: colors.icon }]}>
                You are an Active Club
              </Text>
              <Text style={[styles.statusLevel, { color: colors.text }]}>
                ActiveFit
              </Text>
              <TouchableOpacity>
                <Text style={styles.pointsActivity}>Points activity</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Points Circle */}
        <View style={styles.pointsSection}>
          <View style={styles.pointsCircle}>
            <Text style={styles.pointsValue}>{currentUserData.currentPoints.toLocaleString()}</Text>
            <Text style={styles.pointsUnit}>pts</Text>
            <Text style={styles.expiryText}>500pts expiring on {currentUserData.expiryDate}</Text>
          </View>
          
          <View style={styles.rewardDisplay}>
            <Text style={styles.rewardValue}>{currentUserData.currentReward}</Text>
            <Text style={styles.rewardCurrency}>QR</Text>
            <Text style={styles.rewardLabel}>TOTAL REDEEMABLE REWARD</Text>
          </View>
        </View>

        {/* Level Tiers */}
        <View style={styles.levelsSection}>
          {levelTiers.map((level) => (
            <LevelCard key={level.id} level={level} />
          ))}
        </View>

        <ProgressBar />

        <Text style={[styles.disclaimerText, { color: colors.icon }]}>
          Redeeming points has no effect on your level advancement
        </Text>

        {/* How it works */}
        <View style={styles.howItWorksSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            How it works
          </Text>
          
          <View style={styles.workItem}>
            <IconSymbol name="star.fill" size={24} color="#F5A623" />
            <Text style={[styles.workText, { color: colors.text }]}>
              Earned points for every order
            </Text>
          </View>
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
  statusCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    marginRight: 15,
  },
  statusInfo: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 14,
    marginBottom: 2,
  },
  statusLevel: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  pointsActivity: {
    fontSize: 14,
    color: '#F5A623',
    textDecorationLine: 'underline',
  },
  pointsSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  pointsCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 8,
    borderColor: '#F5A623',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  pointsValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F5A623',
  },
  pointsUnit: {
    fontSize: 14,
    color: '#F5A623',
    marginTop: -5,
  },
  expiryText: {
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
    marginTop: 5,
  },
  rewardDisplay: {
    alignItems: 'center',
  },
  rewardValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#F5A623',
  },
  rewardCurrency: {
    fontSize: 16,
    color: '#F5A623',
    marginTop: -10,
  },
  rewardLabel: {
    fontSize: 10,
    color: '#999',
    marginTop: 5,
  },
  levelsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  levelCard: {
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
  },
  levelIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  levelInfo: {
    alignItems: 'center',
  },
  levelName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  levelPoints: {
    fontSize: 11,
    textAlign: 'center',
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#F5A623',
    borderRadius: 2,
  },
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  completedDot: {
    backgroundColor: '#F5A623',
  },
  activeDot: {
    backgroundColor: '#F5A623',
  },
  inactiveDot: {
    backgroundColor: '#E0E0E0',
  },
  disclaimerText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.7,
  },
  howItWorksSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  workItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  workText: {
    fontSize: 16,
    flex: 1,
  },
});