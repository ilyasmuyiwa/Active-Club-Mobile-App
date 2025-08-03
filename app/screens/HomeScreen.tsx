import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Defs, Path, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const membershipData = {
    points: 22426,
    pointsExpiry: '03/2025',
    rewardAmount: 736,
    nextRewardTarget: 25000,
    progressPercentage: (22426 / 25000) * 100, // ~90%
  };

  const activities = [
    {
      id: 1,
      type: 'earned',
      venue: 'At Sports corner City Center',
      points: '21.52',
      pointsAdded: '1520 pts',
      icon: 'basketball',
      date: 'TODAY',
    },
    {
      id: 2,
      type: 'earned',
      venue: 'At Sports corner City Center',
      points: '52.00',
      pointsAdded: '5265 pts',
      icon: 'play',
      date: '28/06/2025',
    },
    {
      id: 3,
      type: 'spent',
      venue: 'At Sports corner City Center',
      points: '30.50',
      pointsDeducted: '3060 pts',
      icon: 'shoe-print',
      date: '28/06/2025',
    },
  ];

  // Progress Arc Component
  const ProgressArc = ({ percentage }: { percentage: number }) => {
    const size = 180;
    const strokeWidth = 5;
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
          stroke="#444"
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5A623" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <LinearGradient
          colors={['#F5A623', '#F5A623']}
          style={styles.headerSection}
        >
          <View style={styles.header}>
            <View style={styles.profileInfo}>
              <TouchableOpacity 
                style={styles.avatarContainer}
                onPress={() => router.push('/profile')}
                activeOpacity={0.7}
              >
                <Image
                  source={{ uri: 'https://i.pravatar.cc/100?img=3' }}
                  style={styles.avatar}
                />
              </TouchableOpacity>
              <View style={styles.welcomeText}>
                <Text style={styles.welcomeLabel}>Welcome back,</Text>
                <Text style={styles.userName}>Jhon Smith</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => router.push('/settings')}>
              <Ionicons name="ellipsis-vertical" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Membership Card */}
          <View style={styles.cardContainer}>
            <LinearGradient
              colors={['#2C2C2C', '#1A1A1A']}
              style={styles.membershipCard}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardLogo}>
                  <MaterialCommunityIcons name="hexagon" size={24} color="white" />
                  <Text style={styles.cardLogoText}>ActiveFit</Text>
                </View>
                <View style={styles.brandContainer}>
                  <Text style={styles.cardBrand}>active</Text>
                  <Text style={styles.clubText}>club</Text>
                </View>
              </View>

              <View style={styles.pointsContainer}>
                {/* Centered Arc Section */}
                <View style={styles.arcWrapper}>
                  <View style={styles.arcContainer}>
                    <ProgressArc percentage={membershipData.progressPercentage} />
                    
                    {/* Content Inside Arc - Tappable */}
                    <TouchableOpacity 
                      style={styles.arcContent}
                      onPress={() => router.push('/user-level')}
                      activeOpacity={0.8}
                    >
                      <View style={styles.pointsInfo}>
                        <Text style={styles.pointsValue}>{membershipData.points.toLocaleString()}</Text>
                        <Text style={styles.pointsLabel}>pts</Text>
                      </View>
                      <Text style={styles.expiryText}>500pts expiring on {membershipData.pointsExpiry}</Text>
                      
                      <View style={styles.rewardInfo}>
                        <Text style={styles.rewardAmount}>{membershipData.rewardAmount}</Text>
                        <Text style={styles.rewardCurrency}>QR</Text>
                      </View>
                      <Text style={styles.rewardLabel}>TOTAL REDEEMABLE REWARD</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                {/* Next Reward in bottom right */}
                <View style={styles.nextRewardContainer}>
                  <Text style={styles.nextRewardLabel}>Unlock Active Pro</Text>
                  <Text style={styles.nextRewardValue}>{membershipData.points.toLocaleString()}/{membershipData.nextRewardTarget.toLocaleString()}</Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        </LinearGradient>

        {/* Barcode Section */}
        <View style={styles.barcodeSection}>
          <Text style={styles.scanText}>Scan and collect rewards</Text>
          <Image
            source={{ uri: 'https://barcode.tec-it.com/barcode.ashx?data=1234567890123&code=Code128&dpi=300' }}
            style={styles.barcode}
            resizeMode="contain"
          />
        </View>

        {/* Latest Activities */}
        <View style={styles.activitiesSection}>
          <Text style={styles.sectionTitle}>Latest activities</Text>
          
          {activities.map((activity, index) => (
            <View key={activity.id}>
              <Text style={styles.dateLabel}>{activity.date}</Text>
              <TouchableOpacity style={styles.activityCard}>
                <View style={styles.activityIcon}>
                  <MaterialCommunityIcons 
                    name={activity.icon as any} 
                    size={24} 
                    color="#333" 
                  />
                </View>
                
                <View style={styles.activityInfo}>
                  <Text style={styles.activityType}>
                    {activity.type === 'earned' ? 'Earned' : 'Spend'}
                  </Text>
                  <Text style={styles.activityVenue}>{activity.venue}</Text>
                  {activity.type === 'earned' && (
                    <Text style={styles.activityPoints}>+ {activity.pointsAdded}</Text>
                  )}
                </View>
                
                <View style={styles.activityAmount}>
                  <Text style={styles.amountText}>QR {activity.points}</Text>
                  {activity.type === 'earned' && (
                    <Text style={styles.pointsAddedText}>+ {activity.pointsAdded}</Text>
                  )}
                  {activity.type === 'spent' && (
                    <Text style={styles.pointsDeductedText}>- {activity.pointsDeducted}</Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerSection: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    padding: 2,
    marginRight: 12,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
  },
  welcomeText: {
    justifyContent: 'center',
  },
  welcomeLabel: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  cardContainer: {
    marginTop: 10,
  },
  membershipCard: {
    borderRadius: 20,
    padding: 20,
    minHeight: 240,
    position: 'relative',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cardLogo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardLogoText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '600',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  cardBrand: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  clubText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 4,
  },
  pointsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -10,
  },
  arcWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  arcContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arcContent: {
    position: 'absolute',
    top: 35,
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
  },
  nextRewardContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    alignItems: 'flex-end',
  },
  pointsInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  pointsValue: {
    color: '#F5A623',
    fontSize: 24,
    fontWeight: 'bold',
  },
  pointsLabel: {
    color: '#F5A623',
    fontSize: 12,
    marginLeft: 3,
  },
  expiryText: {
    color: '#888',
    fontSize: 9,
    marginBottom: 8,
    textAlign: 'center',
  },
  rewardInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  rewardAmount: {
    color: '#F5A623',
    fontSize: 40,
    fontWeight: 'bold',
  },
  rewardCurrency: {
    color: '#F5A623',
    fontSize: 16,
    marginLeft: 3,
  },
  rewardLabel: {
    color: '#888',
    fontSize: 9,
    marginTop: 2,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  nextRewardLabel: {
    color: '#888',
    fontSize: 7,
    marginBottom: 2,
  },
  nextRewardValue: {
    color: 'white',
    fontSize: 8,
  },
  barcodeSection: {
    backgroundColor: 'white',
    marginTop: -20,
    paddingVertical: 20,
    alignItems: 'center',
    borderRadius: 20,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scanText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  barcode: {
    width: width - 80,
    height: 60,
  },
  activitiesSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  dateLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 10,
    marginBottom: 5,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  activityVenue: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  activityPoints: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 2,
  },
  activityAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  pointsAddedText: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 2,
  },
  pointsDeductedText: {
    fontSize: 12,
    color: '#F44336',
    marginTop: 2,
  },
});