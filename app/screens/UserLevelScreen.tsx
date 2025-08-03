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
import Svg, { Defs, Path, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg';

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
  progressPercentage: (22426 / 25000) * 100, // ~90%
};

export default function UserLevelScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

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
            <Stop offset="0%" stopColor="#FFCE00" stopOpacity="0.7" />
            <Stop offset="50%" stopColor="#F5A623" stopOpacity="0.9" />
            <Stop offset="100%" stopColor="#FF8C00" stopOpacity="1" />
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
    const levelNumber = level.name === 'ActiveGo' ? '3' : level.name === 'ActiveFit' ? '2' : '1';
    
    return (
      <View style={styles.levelCard}>
        <View style={styles.levelHexagonContainer}>
          <View style={[styles.levelHexagon, { backgroundColor: level.color }]}>
            <View style={styles.levelHexagonInner}>
              <Text style={styles.levelHexagonText}>{levelNumber}</Text>
            </View>
            <View style={[styles.levelHexagonBefore, { borderBottomColor: level.color }]} />
            <View style={[styles.levelHexagonAfter, { borderTopColor: level.color }]} />
          </View>
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
            <View style={styles.hexagonContainer}>
              <View style={styles.hexagon}>
                <View style={styles.hexagonInner}>
                  <Text style={styles.hexagonText}>2</Text>
                </View>
                <View style={styles.hexagonBefore} />
                <View style={styles.hexagonAfter} />
              </View>
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

        {/* Points Arc Section */}
        <View style={[styles.pointsCard, { backgroundColor: colors.card }]}>
          <View style={styles.arcContainer}>
            <ProgressArc percentage={currentUserData.progressPercentage} />
            
            {/* Content Inside Arc */}
            <View style={styles.arcContent}>
              <View style={styles.pointsInfo}>
                <Text style={styles.pointsValue}>{currentUserData.currentPoints.toLocaleString()}</Text>
                <Text style={styles.pointsLabel}>pts</Text>
              </View>
              <Text style={styles.expiryText}>500pts expiring on {currentUserData.expiryDate}</Text>
              
              <View style={styles.rewardInfo}>
                <Text style={styles.rewardValue}>{currentUserData.currentReward}</Text>
                <Text style={styles.rewardCurrency}>QR</Text>
              </View>
              <Text style={styles.rewardLabel}>TOTAL REDEEMABLE REWARD</Text>
            </View>
          </View>
        </View>

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
            <View style={[styles.progressLineFill, { width: '60%' }]} />
          </View>
          <View style={styles.progressDotsContainer}>
            <View style={styles.checkmarkContainer}>
              <IconSymbol name="checkmark.circle.fill" size={24} color="#F5A623" />
            </View>
            <View style={styles.checkmarkContainer}>
              <IconSymbol name="checkmark.circle.fill" size={24} color="#F5A623" />
            </View>
            <View style={styles.emptyDotContainer}>
              <View style={styles.emptyDot} />
            </View>
          </View>
        </View>

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
  hexagonContainer: {
    marginRight: 15,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hexagon: {
    width: 40,
    height: 22,
    backgroundColor: '#C4C4C4',
    position: 'relative',
    marginVertical: 9,
  },
  hexagonInner: {
    width: 40,
    height: 22,
    backgroundColor: '#C4C4C4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hexagonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  hexagonBefore: {
    position: 'absolute',
    top: -9,
    left: 0,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderLeftWidth: 20,
    borderLeftColor: 'transparent',
    borderRightWidth: 20,
    borderRightColor: 'transparent',
    borderBottomWidth: 9,
    borderBottomColor: '#C4C4C4',
  },
  hexagonAfter: {
    position: 'absolute',
    bottom: -9,
    left: 0,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderLeftWidth: 20,
    borderLeftColor: 'transparent',
    borderRightWidth: 20,
    borderRightColor: 'transparent',
    borderTopWidth: 9,
    borderTopColor: '#C4C4C4',
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
  pointsCard: {
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
    color: '#F5A623',
  },
  rewardCurrency: {
    fontSize: 18,
    color: '#F5A623',
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
  levelHexagonContainer: {
    marginBottom: 10,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelHexagon: {
    width: 46,
    height: 26,
    position: 'relative',
    marginVertical: 10,
  },
  levelHexagonInner: {
    width: 46,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelHexagonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  levelHexagonBefore: {
    position: 'absolute',
    top: -10,
    left: 0,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderLeftWidth: 23,
    borderLeftColor: 'transparent',
    borderRightWidth: 23,
    borderRightColor: 'transparent',
    borderBottomWidth: 10,
  },
  levelHexagonAfter: {
    position: 'absolute',
    bottom: -10,
    left: 0,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderLeftWidth: 23,
    borderLeftColor: 'transparent',
    borderRightWidth: 23,
    borderRightColor: 'transparent',
    borderTopWidth: 10,
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
    paddingHorizontal: 20,
  },
  progressLineContainer: {
    position: 'relative',
    height: 4,
    marginBottom: -12,
  },
  progressLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#E0E0E0',
    top: 11,
  },
  progressLineFill: {
    position: 'absolute',
    left: 0,
    height: 2,
    backgroundColor: '#F5A623',
    top: 11,
  },
  progressDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    width: 12,
    height: 12,
    borderRadius: 6,
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