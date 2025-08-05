import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Defs, Path, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg';
import { useUser } from '../../contexts/UserContext';
import { capillaryApi, CustomerData } from '../../services/capillaryApi';

interface LevelTier {
  id: string;
  name: string;
  points: string;
  pointsThreshold: number;
  isActive: boolean;
  isCompleted: boolean;
}

export default function UserLevelScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { phoneNumber } = useUser();
  
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use phone number from context, fallback to demo number
  const userMobile = phoneNumber || '98988787';
  
  // Tier definitions with thresholds
  const getTierDefinitions = (): LevelTier[] => [
    {
      id: '1',
      name: 'ActiveGo',
      points: '0 pts',
      pointsThreshold: 0,
      isActive: false,
      isCompleted: false,
    },
    {
      id: '2',
      name: 'ActiveFit',
      points: '15,000 pts',
      pointsThreshold: 15000,
      isActive: false,
      isCompleted: false,
    },
    {
      id: '3',
      name: 'ActivePro',
      points: '25,000 pts',
      pointsThreshold: 25000,
      isActive: false,
      isCompleted: false,
    },
  ];
  
  // Fallback data for when API fails or no customer data
  const fallbackData = {
    currentPoints: 22426,
    currentReward: 736,
    currentLevel: 'ActiveFit',
    expiryDate: '03/2025',
    progressPercentage: (22426 / 25000) * 100,
  };
  
  useEffect(() => {
    if (userMobile) {
      fetchCustomerData();
    }
  }, [userMobile]);
  
  const fetchCustomerData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔵 UserLevelScreen: Fetching customer data for:', userMobile);
      const result = await capillaryApi.getCustomerByMobile(userMobile);
      console.log('🔵 UserLevelScreen: API result:', result);
      
      if (result.customer) {
        console.log('✅ UserLevelScreen: Customer found:', result.customer);
        console.log('🔵 UserLevelScreen: Points:', result.customer.loyalty_points);
        console.log('🔵 UserLevelScreen: Tier:', result.customer.current_slab);
        setCustomerData(result.customer);
      } else {
        console.log('❌ UserLevelScreen: Customer not found or error');
        if (result.error?.type === 'not_found') {
          setError('Customer not found');
        } else {
          setError('Failed to load data');
        }
      }
    } catch (err) {
      console.error('Error fetching customer data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate membership data from API or use fallback
  const getMembershipData = () => {
    if (!customerData) {
      console.log('⚠️ UserLevelScreen: No customer data, using fallback');
      return fallbackData;
    }

    console.log('🔵 UserLevelScreen: Using API data for customer:', customerData);
    const points = capillaryApi.getCustomerPoints(customerData);
    const tier = capillaryApi.getCustomerTier(customerData);
    const { percentage, nextTarget } = capillaryApi.calculateProgress(points, tier);
    const rewardAmount = capillaryApi.calculateRewardAmount(points);

    console.log('🔵 UserLevelScreen: Calculated data:', { points, tier, percentage, rewardAmount });

    return {
      currentPoints: points,
      currentReward: rewardAmount,
      currentLevel: tier,
      expiryDate: '03/2025', // This could be calculated from API if available
      progressPercentage: percentage,
      nextTarget,
    };
  };
  
  const membershipData = getMembershipData();
  
  // Calculate tier status based on current points and level
  const getTierStatus = () => {
    const tiers = getTierDefinitions();
    const currentPoints = membershipData.currentPoints;
    const currentTier = membershipData.currentLevel;
    
    return tiers.map(tier => {
      // Handle tier comparison with or without "Active" prefix
      const normalizedCurrentTier = currentTier.replace('Active', '');
      const normalizedTierName = tier.name.replace('Active', '');
      const isCurrentTier = normalizedTierName === normalizedCurrentTier;
      const isCompleted = currentPoints >= tier.pointsThreshold && !isCurrentTier;
      
      return {
        ...tier,
        isActive: isCurrentTier,
        isCompleted: isCompleted,
      };
    });
  };
  
  const levelTiers = getTierStatus();

  // Progress Arc Component - Same as HomePage
  const ProgressArc = ({ percentage }: { percentage: number }) => {
    const size = 220;
    const strokeWidth = 6;
    const radius = (size - strokeWidth) / 2;
    const startAngle = -210; // Start at -210 degrees (7:30 position)
    const endAngle = 30; // End at 30 degrees (4:30 position)
    const totalAngle = 240; // Total arc span in degrees
    
    // Convert angles to radians
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;
    
    // Calculate arc endpoints
    const startX = size / 2 + radius * Math.cos(startAngleRad);
    const startY = size / 2 + radius * Math.sin(startAngleRad);
    const endX = size / 2 + radius * Math.cos(endAngleRad);
    const endY = size / 2 + radius * Math.sin(endAngleRad);
    
    // Calculate progress endpoint
    const progressAngle = startAngle + (totalAngle * percentage) / 100;
    const progressAngleRad = (progressAngle * Math.PI) / 180;
    const progressX = size / 2 + radius * Math.cos(progressAngleRad);
    const progressY = size / 2 + radius * Math.sin(progressAngleRad);

    return (
      <Svg width={size} height={size * 0.75}>
        <Defs>
          <SvgLinearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#F8E8A6" stopOpacity="1" />
            <Stop offset="50%" stopColor="#F5D762" stopOpacity="1" />
            <Stop offset="100%" stopColor="#F1C229" stopOpacity="1" />
          </SvgLinearGradient>
        </Defs>
        
        {/* Background Arc - 240 degrees */}
        <Path
          d={`M ${startX} ${startY} A ${radius} ${radius} 0 1 1 ${endX} ${endY}`}
          fill="none"
          stroke="#E0E0E0"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Progress Arc with gradient */}
        <Path
          d={`M ${startX} ${startY} A ${radius} ${radius} 0 ${percentage > 50 ? 1 : 0} 1 ${progressX} ${progressY}`}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      </Svg>
    );
  };

  const LevelCard = ({ level }: { level: LevelTier }) => {
    const getStarImage = () => {
      // star_third.png for Go, star_second.png for Fit, star_first.png for Pro
      if (level.name === 'ActiveGo') return require('../../assets/notifications/star_third.png');
      if (level.name === 'ActiveFit') return require('../../assets/notifications/star_second.png');
      return require('../../assets/notifications/star_first.png'); // ActivePro
    };
    
    return (
      <View style={styles.levelCard}>
        <View style={[styles.levelStarContainer, styles.levelCardBackground, level.isActive && styles.activeStarContainer]}>
          <Image
            source={getStarImage()}
            style={{ 
              width: 60, 
              height: 60,
              opacity: level.isActive ? 1 : (level.isCompleted ? 0.8 : 0.4)
            }}
            resizeMode="contain"
          />
        </View>
        
        <Text style={[styles.levelName, { color: colors.text }]}>
          {level.name}
        </Text>
        <Text style={[styles.levelPoints, { color: colors.icon }]}>
          {level.points}
        </Text>
      </View>
    );
  };

  // Show loading indicator
  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol name="arrow.left" size={28} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>User Level</Text>
        </View>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F1C229" />
          <Text style={styles.loadingText}>Loading your level...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="arrow.left" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>User Level</Text>
      </View>

      <ScrollView 
        style={[styles.content, { backgroundColor: '#E8E8E8' }]} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Current Level Status */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={styles.starContainer}>
              <Image
                source={
                  (membershipData.currentLevel === 'ActiveGo' || membershipData.currentLevel === 'Go') ? require('../../assets/notifications/star_third.png') :
                  (membershipData.currentLevel === 'ActiveFit' || membershipData.currentLevel === 'Fit') ? require('../../assets/notifications/star_second.png') :
                  require('../../assets/notifications/star_first.png')
                }
                style={{ width: 60, height: 60 }}
                resizeMode="contain"
              />
            </View>
            <View style={styles.statusInfo}>
              <Text style={[styles.statusLabel, { color: colors.icon }]}>
                You are an Active Club
              </Text>
              <Text style={[styles.statusLevel, { color: colors.text }]}>
                {membershipData.currentLevel.startsWith('Active') ? membershipData.currentLevel : `Active${membershipData.currentLevel}`}
              </Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/activities')}>
                <Text style={styles.pointsActivity}>Points activity</Text>
              </TouchableOpacity>
              {error && (
                <Text style={styles.errorText}>Using offline data</Text>
              )}
            </View>
          </View>
        </View>

        {/* Combined Points Arc and Level Progress Card */}
        <View style={styles.combinedProgressCard}>
          {/* Points Arc Section */}
          <View style={styles.arcContainer}>
            <ProgressArc percentage={membershipData.progressPercentage} />
            
            {/* Content Inside Arc */}
            <View style={styles.arcContent}>
              <View style={styles.pointsInfo}>
                <Text style={styles.pointsValue}>{membershipData.currentPoints.toLocaleString()}</Text>
                <Text style={styles.pointsLabel}>pts</Text>
              </View>
              <Text style={styles.expiryText}>500pts expiring on {membershipData.expiryDate}</Text>
              
              <View style={styles.rewardInfo}>
                <Text style={styles.rewardValue}>{membershipData.currentReward}</Text>
                <Text style={styles.rewardCurrency}>QR</Text>
              </View>
              <Text style={styles.rewardLabel}>TOTAL REDEEMABLE REWARD</Text>
            </View>
          </View>

          {/* Horizontal separator */}
          <View style={styles.horizontalSeparator} />

          {/* Level Tiers */}
          <View style={styles.levelsSection}>
            {levelTiers.map((level) => (
              <LevelCard key={level.id} level={level} />
            ))}
          </View>

          {/* Progress Bar with dots */}
          <View style={styles.progressSection}>
            <View style={styles.progressLineContainer}>
              <View style={styles.progressLine} />
              <View style={[styles.progressLineFill, { width: `${Math.min(membershipData.progressPercentage / 100 * 65, 65)}%` }]} />
            </View>
            <View style={styles.progressDotsContainer}>
              <View style={styles.checkmarkContainer}>
                <IconSymbol 
                  name={levelTiers[0].isCompleted ? "checkmark.circle.fill" : "circle"} 
                  size={24} 
                  color={levelTiers[0].isCompleted ? "#F1C229" : "#E0E0E0"} 
                />
              </View>
              <View style={styles.checkmarkContainer}>
                <IconSymbol 
                  name={levelTiers[1].isCompleted || levelTiers[1].isActive ? "checkmark.circle.fill" : "circle"} 
                  size={24} 
                  color={levelTiers[1].isCompleted || levelTiers[1].isActive ? "#F1C229" : "#E0E0E0"} 
                />
              </View>
              <View style={styles.emptyDotContainer}>
                {levelTiers[2].isCompleted || levelTiers[2].isActive ? (
                  <IconSymbol name="checkmark.circle.fill" size={24} color="#F1C229" />
                ) : (
                  <View style={styles.emptyDot} />
                )}
              </View>
            </View>
          </View>

          <Text style={[styles.disclaimerText, { color: colors.icon }]}>
            Redeeming points has no effect on your level advancement
          </Text>
        </View>

        {/* How it works */}
        <View style={styles.howItWorksCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            How it works
          </Text>
          
          <View style={styles.workItem}>
            <View style={styles.iconContainer}>
              <IconSymbol name="star.fill" size={20} color="#F1C229" />
            </View>
            <Text style={[styles.workText, { color: colors.text }]}>
              Earned points for every order
            </Text>
          </View>
          
          <View style={styles.workItem}>
            <View style={styles.iconContainer}>
              <IconSymbol name="gift.fill" size={20} color="#F1C229" />
            </View>
            <Text style={[styles.workText, { color: colors.text }]}>
              Redeem existing points
            </Text>
          </View>
          
          <View style={styles.workItem}>
            <View style={styles.iconContainer}>
              <IconSymbol name="crown.fill" size={20} color="#F1C229" />
            </View>
            <Text style={[styles.workText, { color: colors.text }]}>
              Level up & enjoy exclusive benefits
            </Text>
          </View>
          
          <View style={styles.descriptionSection}>
            <Text style={[styles.descriptionText, { color: colors.text }]}>
              You have been added to active points at no cost.
            </Text>
            <Text style={[styles.descriptionText, { color: colors.text }]}>
              You&apos;ll start at bronze level. Use active points more & earn points to reach higher levels
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
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    width: 40,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 20,
  },
  statusCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    marginRight: 15,
  },
  starContainer: {
    marginRight: 15,
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
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
    color: '#F1C229',
    textDecorationLine: 'underline',
  },
  combinedProgressCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  horizontalSeparator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 20,
    marginHorizontal: -20,
  },
  arcContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arcContent: {
    position: 'absolute',
    top: 40,
    alignItems: 'center',
    justifyContent: 'center',
    width: 250,
  },
  pointsInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  pointsValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  pointsLabel: {
    fontSize: 14,
    color: '#333',
    marginLeft: 3,
    textTransform: 'lowercase',
  },
  expiryText: {
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
    marginBottom: 10,
  },
  rewardInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  rewardValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#F1C229',
  },
  rewardCurrency: {
    fontSize: 18,
    color: '#F1C229',
    marginLeft: 3,
  },
  rewardLabel: {
    fontSize: 10,
    color: '#999',
    marginTop: 5,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  levelsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  levelCard: {
    alignItems: 'center',
    width: '30%',
  },
  levelIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  levelStarContainer: {
    marginBottom: 10,
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeStarContainer: {
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
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
  progressSection: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  progressLineContainer: {
    position: 'relative',
    height: 8,
    marginBottom: -6,
  },
  progressLine: {
    position: 'absolute',
    left: 35,
    right: 35,
    height: 4,
    backgroundColor: '#E0E0E0',
    top: 10,
    borderRadius: 2,
  },
  progressLineFill: {
    position: 'absolute',
    left: 35,
    height: 4,
    backgroundColor: '#F1C229',
    top: 10,
    width: '40%',
    borderRadius: 2,
  },
  progressDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 23,
    marginTop: -2,
  },
  checkmarkContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
  },
  emptyDotContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
  },
  emptyDot: {
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: '#E0E0E0',
  },
  disclaimerText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.7,
  },
  howItWorksCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  workItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FFF9E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  workText: {
    fontSize: 16,
    flex: 1,
  },
  descriptionSection: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
    opacity: 0.8,
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
  levelCardBackground: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
});