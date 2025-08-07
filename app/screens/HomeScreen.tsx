import { IconSymbol } from '@/components/ui/IconSymbol';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Svg, { Defs, Path, Stop, LinearGradient as SvgLinearGradient, SvgXml } from 'react-native-svg';
import { ActiveClubLogoWhiteSvg } from '../../assets/ActiveClubLogoWhite';
import { ScIconSvg } from '../../assets/ScIcon';
import { useUser } from '../../contexts/UserContext';
import { capillaryApi, CustomerData } from '../../services/capillaryApi';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const { phoneNumber, isAuthenticated, isLoading: userLoading, onCustomerDataRefresh } = useUser();

  // No fallback data - return null when API data is not available

  // Use phone number from context, fallback to demo number
  const userMobile = phoneNumber || '98988787';


  useEffect(() => {
    // Only fetch customer data if user is authenticated and has a phone number
    if (isAuthenticated && userMobile && !userLoading) {
      console.log('🔵 HomeScreen: User authenticated, fetching customer data');
      fetchCustomerData();
    } else if (!isAuthenticated && !userLoading) {
      console.log('⚠️ HomeScreen: User not authenticated, skipping data fetch');
    }
  }, [isAuthenticated, userMobile, userLoading]);

  // Listen for customer data refresh events
  useEffect(() => {
    const unsubscribe = onCustomerDataRefresh(() => {
      console.log('🔄 HomeScreen: Received customer data refresh event');
      if (isAuthenticated && userMobile && !userLoading) {
        fetchCustomerData();
      }
    });

    return unsubscribe;
  }, [isAuthenticated, userMobile, userLoading, onCustomerDataRefresh]);

  const fetchCustomerData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First, fetch customer data
      console.log('🔵 HomeScreen: Fetching customer data...');
      const customerResult = await capillaryApi.getCustomerByMobile(userMobile);
      
      if (customerResult.customer) {
        console.log('✅ HomeScreen: Customer data received successfully');
        setCustomerData(customerResult.customer);
        
        // Only fetch transactions after successful customer details response
        console.log('🔵 HomeScreen: Fetching transactions after successful customer response...');
        try {
          const transactionResult = await capillaryApi.getCustomerTransactionsPaginated(userMobile, 5, 0);
          
          if (transactionResult.transactions && transactionResult.transactions.length > 0) {
            console.log('✅ HomeScreen: Transactions received successfully');
            setTransactions(transactionResult.transactions);
          } else {
            console.log('⚠️ HomeScreen: No transactions found');
            setTransactions([]);
          }
        } catch (transactionError) {
          console.error('🔴 HomeScreen: Error fetching transactions after successful customer fetch:', transactionError);
          setTransactions([]);
          // Don't set error for customer data since that was successful
        }
      } else {
        console.log('❌ HomeScreen: Customer not found or error occurred');
        if (customerResult.error?.type === 'not_found') {
          setError('Customer not found');
        } else {
          setError('Failed to load customer data');
        }
        setTransactions([]); // Clear transactions if customer not found
      }
    } catch (err) {
      console.error('🔴 HomeScreen: Error fetching customer data:', err);
      setError('Failed to load customer data');
      setTransactions([]); // Clear transactions if customer fetch failed
    } finally {
      setLoading(false);
    }
  };

  // Calculate points expiry from transaction data
  const calculatePointsExpiry = () => {
    if (!transactions || transactions.length === 0) {
      return null; // No expiry info when no transactions
    }

    // Calculate expiry for each transaction (billing_time + 12 months)
    const transactionsWithExpiry = transactions.map(transaction => {
      const billingDate = new Date(transaction.billing_time);
      const expiryDate = new Date(billingDate);
      expiryDate.setFullYear(billingDate.getFullYear() + 1); // Add 12 months
      
      const pointsEarned = parseFloat(transaction.points.issued) || 0;
      
      return {
        transaction,
        expiryDate,
        pointsEarned,
        billingDate
      };
    });

    // Filter to only transactions with earned points
    const earningTransactions = transactionsWithExpiry.filter(t => t.pointsEarned > 0);
    
    if (earningTransactions.length === 0) {
      return null; // No expiry info when no earning transactions
    }

    // Sort by expiry date (earliest first)
    earningTransactions.sort((a, b) => a.expiryDate.getTime() - b.expiryDate.getTime());
    
    // Get the transaction closest to expiry
    const closestToExpiry = earningTransactions[0];
    
    // Format expiry date as MM/YYYY
    const formattedExpiry = `${String(closestToExpiry.expiryDate.getMonth() + 1).padStart(2, '0')}/${closestToExpiry.expiryDate.getFullYear()}`;
    
    console.log('🔵 Points expiry calculation:', {
      totalTransactions: transactions.length,
      earningTransactions: earningTransactions.length,
      closestExpiry: formattedExpiry,
      pointsAmount: Math.round(closestToExpiry.pointsEarned),
      billingDate: closestToExpiry.billingDate.toDateString()
    });
    
    return {
      pointsAmount: Math.round(closestToExpiry.pointsEarned),
      expiryDate: formattedExpiry
    };
  };

  // Calculate membership data from API only - no fallback
  const getMembershipData = () => {
    if (!customerData) {
      return null;
    }

    const points = capillaryApi.getCustomerPoints(customerData);
    const lifetimePurchases = capillaryApi.getCustomerLifetimePurchases(customerData);
    const tier = capillaryApi.getCustomerTier(customerData);
    const { percentage, nextTarget } = capillaryApi.calculateTierProgress(lifetimePurchases, tier);
    const rewardAmount = capillaryApi.calculateRewardAmount(points);
    const userName = capillaryApi.getCustomerFullName(customerData);
    const pointsExpiry = calculatePointsExpiry();

    return {
      points,
      lifetimePurchases,
      pointsExpiry: pointsExpiry?.expiryDate || null,
      pointsExpiryAmount: pointsExpiry?.pointsAmount || null,
      rewardAmount,
      nextRewardTarget: nextTarget,
      progressPercentage: percentage,
      userName,
      tier,
    };
  };

  const membershipData = getMembershipData();

  // Show error state when no customer data and not loading
  if (!loading && !membershipData) {
    return (
      <LinearGradient 
        colors={['#F1C229', '#F1C229', '#F5F5F5']} 
        locations={[0, 0.35, 0.35]}
        style={styles.container}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Account not available</Text>
            <Text style={styles.errorSubtitle}>Unable to load your account information</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={fetchCustomerData}
            >
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // Get card image based on tier
  const getCardImage = (tier: string) => {
    switch (tier) {
      case 'ActiveGo':
      case 'Go':
        return require('../../assets/images/card-3.png'); // Go tier
      case 'ActiveFit':
      case 'Fit':
        return require('../../assets/images/card-2.png'); // Fit tier
      case 'ActivePro':
      case 'Pro':
        return require('../../assets/images/card-1.png'); // Pro tier
      default:
        return require('../../assets/images/card-3.png'); // Default to Go tier
    }
  };

  // Get star icon based on tier
  const getStarIcon = (tier: string) => {
    switch (tier) {
      case 'ActiveGo':
      case 'Go':
        return require('../../assets/notifications/star_third.png'); // Go tier
      case 'ActiveFit':
      case 'Fit':
        return require('../../assets/notifications/star_second.png'); // Fit tier
      case 'ActivePro':
      case 'Pro':
        return require('../../assets/notifications/star_first.png'); // Pro tier
      default:
        return require('../../assets/notifications/star_third.png'); // Default to Go tier
    }
  };

  // Show loading indicator
  if (loading) {
    return (
      <LinearGradient 
        colors={['#F1C229', '#F1C229', '#F5F5F5']} 
        locations={[0, 0.35, 0.35]}
        style={styles.container}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#F1C229" />
            <Text style={styles.loadingText}>Loading your account...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // Get real activities from API or fallback to static data
  const getActivities = () => {
    if (transactions && transactions.length > 0) {
      const activities = capillaryApi.convertTransactionsToActivities(transactions);
      
      // If we have API activities, use them
      if (activities.length > 0) {
        return activities;
      }
    }
    
    // Return empty array if no API data - don't show demo data
    return [];
  };

  const activities = getActivities();

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
            <Stop offset="0%" stopColor="#F8E8A6" stopOpacity="1" />
            <Stop offset="50%" stopColor="#F5D762" stopOpacity="1" />
            <Stop offset="100%" stopColor="#F1C229" stopOpacity="1" />
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
    <LinearGradient 
      colors={['#F1C229', '#F1C229', '#F5F5F5']} 
      locations={[0, 0.35, 0.35]}
      style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" backgroundColor="#F1C229" />
        
        <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.header}>
            <View style={styles.profileInfo}>
              <TouchableOpacity 
                style={styles.avatarContainer}
                onPress={() => router.push('/profile')}
                activeOpacity={0.7}
              >
                <View style={styles.avatar}>
                  <IconSymbol name="person.fill" size={24} color="#666" />
                </View>
              </TouchableOpacity>
              <View style={styles.welcomeText}>
                <Text style={styles.welcomeLabel}>Welcome back,</Text>
                <Text style={styles.userName}>{membershipData?.userName || 'User'}</Text>
                {error && (
                  <Text style={styles.errorText}>Using offline data</Text>
                )}
              </View>
            </View>
            <TouchableOpacity onPress={() => router.push('/settings')}>
              <Ionicons name="ellipsis-vertical" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Membership Card */}
          <View style={styles.cardContainer}>
            <TouchableOpacity 
              style={styles.membershipCard}
              onPress={() => router.push('/user-level')}
              activeOpacity={0.95}
            >
              <Image
                source={getCardImage(membershipData?.tier || 'Go')}
                style={styles.cardBackground}
                resizeMode="cover"
              />
              <View style={styles.cardOverlay}>
              <View style={styles.cardHeader}>
                <View style={styles.cardLogo}>
                  <Image
                    source={getStarIcon(membershipData?.tier || 'Go')}
                    style={{ width: 32, height: 32 }}
                    resizeMode="contain"
                  />
                  <Text style={styles.cardLogoText}>Active{membershipData?.tier || 'Go'}</Text>
                </View>
                <View style={styles.brandContainer}>
                  <SvgXml 
                    xml={ActiveClubLogoWhiteSvg} 
                    width={90} 
                    height={35}
                    onError={(e) => console.log('SVG Error:', e)}
                  />
                </View>
              </View>

              <View style={styles.pointsContainer}>
                {/* Centered Arc Section */}
                <View style={styles.arcWrapper}>
                  <View style={styles.arcContainer}>
                    <ProgressArc percentage={membershipData?.progressPercentage || 0} />
                    
                    {/* Content Inside Arc */}
                    <View style={styles.arcContent}>
                      <View style={styles.pointsInfo}>
                        <Text style={styles.pointsValue}>{membershipData?.points?.toLocaleString() || '0'}</Text>
                        <Text style={styles.pointsLabel}>pts</Text>
                      </View>
                      {membershipData?.pointsExpiryAmount && membershipData?.pointsExpiry && (
                        <Text style={styles.expiryText}>{membershipData.pointsExpiryAmount}pts expiring on {membershipData.pointsExpiry}</Text>
                      )}
                      
                      <View style={styles.rewardInfo}>
                        <Text style={styles.rewardAmount}>{membershipData?.rewardAmount || '0'}</Text>
                        <Text style={styles.rewardCurrency}>QR</Text>
                      </View>
                      <Text style={styles.rewardLabel}>TOTAL REDEEMABLE REWARD</Text>
                    </View>
                  </View>
                </View>
                
                {/* Next Reward in bottom right */}
                <View style={styles.nextRewardContainer}>
                  <Text style={styles.nextRewardLabel}>{
                    membershipData?.tier === 'ActiveGo' || membershipData?.tier === 'Go' ? 'Unlock ActiveFit' :
                    membershipData?.tier === 'ActiveFit' || membershipData?.tier === 'Fit' ? 'Unlock ActivePro' :
                    'ActivePro Member'
                  }</Text>
                  {membershipData?.nextRewardTarget ? (
                    <Text style={styles.nextRewardValue}>
                      {membershipData?.lifetimePurchases?.toLocaleString() || '0'}/{membershipData.nextRewardTarget.toLocaleString()}
                    </Text>
                  ) : (
                    <Text style={styles.nextRewardValue}>
                      {membershipData?.lifetimePurchases?.toLocaleString() || '0'}
                    </Text>
                  )}
                </View>
              </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Barcode Section */}
        <View style={styles.barcodeSection}>
          <Text style={styles.scanText}>Scan and collect rewards</Text>
          <TouchableOpacity 
            style={styles.barcodeContainer}
            onPress={() => setQrModalVisible(true)}
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: 
                `https://barcodeapi.org/api/128/${customerData?.mobile || userMobile}?text=none`
               }}
              style={styles.barcode}
              resizeMode="contain"
              onError={(e) => {
                console.log('Barcode loading error:', e.nativeEvent.error);
              }}
              onLoad={() => {
                console.log('Barcode loaded successfully');
              }}
            />

          </TouchableOpacity>
          {error && (
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={fetchCustomerData}
            >
              <Text style={styles.retryText}>Retry Loading Data</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Latest Activities */}
        <View style={styles.activitiesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Latest activities</Text>
          </View>
          
          {activities.length > 0 ? (
            activities.map((activity) => (
            <View key={activity.id}>
              <Text style={styles.dateLabel}>{activity.date}</Text>
              <TouchableOpacity style={styles.activityCard}>
                <View style={styles.activityIcon}>
                  <SvgXml 
                    xml={ScIconSvg} 
                    width={20} 
                    height={20} 
                    color="#333"
                  />
                </View>
                
                <View style={styles.activityInfo}>
                  <Text style={styles.activityType}>
                    {activity.type === 'earned' ? 'Earned' : 'Spend'}
                  </Text>
                  <Text style={styles.activityVenue}>{activity.venue}</Text>
                  {activity.type === 'earned' && activity.pointsAdded && (
                    <Text style={styles.activityPoints}>+ {activity.pointsAdded}</Text>
                  )}
                </View>
                
                <View style={styles.activityAmount}>
                  <Text style={styles.amountText}>QR {activity.points}</Text>
                  {activity.type === 'earned' && activity.pointsAdded && (
                    <Text style={styles.pointsAddedText}>+ {activity.pointsAdded}</Text>
                  )}
                  {activity.type === 'spent' && activity.pointsDeducted && (
                    <Text style={styles.pointsDeductedText}>- {activity.pointsDeducted}</Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          ))
          ) : (
            <View style={styles.noActivitiesContainer}>
              <Text style={styles.noActivitiesText}>No activities yet</Text>
              <Text style={styles.noActivitiesSubtext}>Your transaction history will appear here</Text>
            </View>
          )}
          
          {/* Load More Link */}
          {activities.length > 0 && (
            <TouchableOpacity 
              style={styles.loadMoreContainer}
              onPress={() => router.push('/activities')}
              activeOpacity={0.7}
            >
              <Text style={styles.loadMoreText}>View all activities</Text>
              <Ionicons name="chevron-forward" size={16} color="#F1C229" />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
      </SafeAreaView>

      {/* Barcode Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={qrModalVisible}
        onRequestClose={() => setQrModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Membership Barcode</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setQrModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.largeBarcodeContainer}>
              <Image
                source={{ uri: 
                  `https://barcodeapi.org/api/128/${customerData?.mobile || userMobile}`
                 }}
                style={styles.largeBarcodeImage}
                resizeMode="contain"
              />
            </View>
            
            <Text style={styles.modalInstruction}>
              Show this barcode to the cashier to collect rewards
            </Text>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
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
    minHeight: 240,
    position: 'relative',
    overflow: 'hidden',
  },
  cardBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  cardOverlay: {
    padding: 20,
    flex: 1,
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
    marginLeft: 1,
    fontWeight: '600',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    color: '#F1C229',
    fontSize: 24,
    fontWeight: 'bold',
  },
  pointsLabel: {
    color: '#F1C229',
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
    color: '#F1C229',
    fontSize: 40,
    fontWeight: 'bold',
  },
  rewardCurrency: {
    color: '#F1C229',
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
    paddingHorizontal: 20,
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
    marginBottom: 2,
    textAlign: 'center',
  },
  barcodeContainer: {
    width: '100%',
    height: 80,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  barcode: {
    width: '400%',
    height: '100%',
  },
  activitiesSection: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
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
  loadMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    marginTop: 10,
    backgroundColor: 'rgba(241, 194, 41, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(241, 194, 41, 0.3)',
  },
  loadMoreText: {
    fontSize: 14,
    color: '#F1C229',
    fontWeight: '600',
    marginRight: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  errorText: {
    fontSize: 12,
    color: '#FF6B6B',
    fontStyle: 'italic',
  },
  retryButton: {
    backgroundColor: '#F1C229',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
    alignSelf: 'center',
  },
  retryText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 380,
    alignItems: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  largeQrContainer: {
    width: 250,
    height: 250,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  largeQrCode: {
    width: '100%',
    height: '100%',
  },
  largeBarcodeContainer: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  largeBarcodeImage: {
    width: '100%',
    height: 170,
  },
  barcodeNumber: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  modalInstruction: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  noActivitiesContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noActivitiesText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
    marginBottom: 8,
  },
  noActivitiesSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});