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
import { router } from 'expo-router';

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
                <Text style={styles.cardBrand}>active</Text>
                <Text style={styles.clubText}>club</Text>
              </View>

              <View style={styles.pointsContainer}>
                <View style={styles.leftSection}>
                  {/* Semicircle progress */}
                  <View style={styles.semicircleContainer}>
                    {/* Background semicircle */}
                    <View style={styles.backgroundSemicircle} />
                    {/* Progress semicircle - yellow portion */}
                    <View style={[styles.progressSemicircle, {
                      transform: [{ rotate: `${-90}deg` }],
                    }]} />
                    
                    {/* Content */}
                    <View style={styles.contentInside}>
                      <Text style={styles.pointsValue}>{membershipData.points.toLocaleString()}</Text>
                      <Text style={styles.pointsLabel}>pts</Text>
                      <Text style={styles.expiryText}>500pts expiring on {membershipData.pointsExpiry}</Text>
                      
                      <Text style={styles.rewardAmount}>{membershipData.rewardAmount}</Text>
                      <Text style={styles.rewardCurrency}>QR</Text>
                      <Text style={styles.rewardLabel}>TOTAL REDEEMABLE REWARD</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.rightSection}>
                  <Text style={styles.nextRewardLabel}>Next Reward</Text>
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
    paddingVertical: 20,
  },
  leftSection: {
    flex: 1,
  },
  semicircleContainer: {
    position: 'relative',
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundSemicircle: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: 'transparent',
    borderLeftColor: '#555',
    borderTopColor: '#555',
    borderBottomColor: '#555',
  },
  progressSemicircle: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: 'transparent',
    borderLeftColor: '#F5A623',
    borderTopColor: '#F5A623',
    borderBottomColor: '#F5A623',
  },
  contentInside: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  pointsValue: {
    color: '#F5A623',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  pointsLabel: {
    color: '#F5A623',
    fontSize: 8,
    marginTop: -2,
    textAlign: 'center',
  },
  expiryText: {
    color: '#999',
    fontSize: 7,
    marginTop: 3,
    marginBottom: 8,
    textAlign: 'center',
    maxWidth: 100,
  },
  rewardAmount: {
    color: '#F5A623',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  rewardCurrency: {
    color: '#F5A623',
    fontSize: 12,
    marginTop: -4,
    textAlign: 'center',
  },
  rewardLabel: {
    color: '#999',
    fontSize: 7,
    marginTop: 2,
    textAlign: 'center',
    maxWidth: 100,
    lineHeight: 9,
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
});