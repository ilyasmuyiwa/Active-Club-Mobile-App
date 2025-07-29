import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const membershipData = {
    points: 22426,
    pointsExpiry: '03/2025',
    rewardAmount: 736,
    nextReward: 22426 / 25000,
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
              <View style={styles.avatarContainer}>
                <Image
                  source={{ uri: 'https://i.pravatar.cc/100?img=3' }}
                  style={styles.avatar}
                />
              </View>
              <View style={styles.welcomeText}>
                <Text style={styles.welcomeLabel}>Welcome back,</Text>
                <Text style={styles.userName}>Jhon Smith</Text>
              </View>
            </View>
            <TouchableOpacity>
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
                <Text style={styles.cardBrand}>active</Text>
                <Text style={styles.clubText}>club</Text>
              </View>

              <View style={styles.pointsContainer}>
                <View style={styles.pointsCircle}>
                  <Text style={styles.pointsValue}>{membershipData.points.toLocaleString()}</Text>
                  <Text style={styles.pointsLabel}>pts</Text>
                  <Text style={styles.expiryText}>500pts expiring on {membershipData.pointsExpiry}</Text>
                </View>
                
                <View style={styles.rewardInfo}>
                  <Text style={styles.rewardAmount}>{membershipData.rewardAmount}</Text>
                  <Text style={styles.rewardCurrency}>QR</Text>
                  <Text style={styles.rewardLabel}>TOTAL REDEEMABLE REWARD</Text>
                  
                  <View style={styles.nextRewardContainer}>
                    <Text style={styles.nextRewardLabel}>Next Reward</Text>
                    <Text style={styles.nextRewardValue}>22,426/25,000</Text>
                  </View>
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

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color="#F5A623" />
          <Text style={[styles.navText, styles.activeNavText]}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="grid-outline" size={24} color="#999" />
          <Text style={styles.navText}>Activity</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="star-outline" size={24} color="#999" />
          <Text style={styles.navText}>Partners</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="notifications-outline" size={24} color="#999" />
          <Text style={styles.navText}>Notifications</Text>
        </TouchableOpacity>
      </View>
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
    minHeight: 200,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
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
  cardBrand: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 'auto',
  },
  clubText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 4,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pointsCircle: {
    alignItems: 'center',
  },
  pointsValue: {
    color: '#F5A623',
    fontSize: 36,
    fontWeight: 'bold',
  },
  pointsLabel: {
    color: '#F5A623',
    fontSize: 14,
    marginTop: -5,
  },
  expiryText: {
    color: '#999',
    fontSize: 10,
    marginTop: 5,
  },
  rewardInfo: {
    alignItems: 'flex-end',
  },
  rewardAmount: {
    color: '#F5A623',
    fontSize: 48,
    fontWeight: 'bold',
  },
  rewardCurrency: {
    color: '#F5A623',
    fontSize: 16,
    marginTop: -10,
  },
  rewardLabel: {
    color: '#999',
    fontSize: 10,
    marginTop: 5,
  },
  nextRewardContainer: {
    marginTop: 10,
    alignItems: 'flex-end',
  },
  nextRewardLabel: {
    color: '#999',
    fontSize: 10,
  },
  nextRewardValue: {
    color: 'white',
    fontSize: 12,
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
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  activeNavText: {
    color: '#F5A623',
  },
});