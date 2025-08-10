import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Platform,
  StatusBar,
} from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';
import { SvgXml } from 'react-native-svg';
import { ScIconSvg } from '../../assets/ScIcon';
import { LiningIconSvg } from '../../assets/LiningIcon';
import { capillaryApi, Transaction } from '../../services/capillaryApi';
import { useUser } from '../../contexts/UserContext';

interface Activity {
  id: string;
  type: 'earned' | 'spent';
  venue: string;
  amount: string;
  points: string;
  icon: string;
  date: string;
  isToday?: boolean;
  transactionNumber: string;
}

export default function ActivitiesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { phoneNumber } = useUser();
  
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  
  const userMobile = phoneNumber || '97431345557'; // Fallback mobile number
  const LIMIT = 10;

  // Load initial activities
  useEffect(() => {
    loadActivities(true);
  }, [userMobile]);

  const loadActivities = async (isInitial: boolean = false) => {
    if (isInitial) {
      setLoading(true);
      setOffset(0);
      setHasMore(true);
      setError(null);
    } else if (loadingMore || !hasMore) {
      return;
    }

    try {
      if (!isInitial) {
        setLoadingMore(true);
      }

      const currentOffset = isInitial ? 0 : offset;
      const result = await capillaryApi.getCustomerTransactionsPaginated(userMobile, LIMIT, currentOffset);
      
      if (result.transactions.length > 0) {
        const newActivities = capillaryApi.convertTransactionsToActivitiesScreen(result.transactions);
        
        if (isInitial) {
          setActivities(newActivities);
        } else {
          setActivities(prev => [...prev, ...newActivities]);
        }
        
        setOffset(currentOffset + LIMIT);
        setHasMore(result.hasMore);
      } else {
        setHasMore(false);
        if (isInitial) {
          setError('No transactions found');
        }
      }
    } catch (err) {
      console.error('Error loading activities:', err);
      setError('Failed to load activities');
      if (isInitial) {
        // Load fallback data
        setActivities(getFallbackActivities());
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const getFallbackActivities = (): Activity[] => [
    {
      id: '1',
      type: 'earned',
      venue: 'At Sports corner City Center',
      amount: 'QR 21.52',
      points: '+ 1520 pts',
      icon: 'sc',
      date: 'TODAY',
      isToday: true,
      transactionNumber: 'DEMO001',
    },
    {
      id: '2',
      type: 'earned',
      venue: 'At Sports corner City Center',
      amount: 'QR 52.00',
      points: '+ 3265 pts',
      icon: 'sc',
      date: '28/06/2025',
      transactionNumber: 'DEMO002',
    },
    {
      id: '3',
      type: 'spent',
      venue: 'At Li-Ning City Center',
      amount: 'QR 30.50',
      points: '- 2245 pts',
      icon: 'lining',
      date: '27/06/2025',
      transactionNumber: 'DEMO003',
    },
  ];

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadActivities(true).then(() => setRefreshing(false));
  }, [userMobile]);

  const onEndReached = useCallback(() => {
    if (hasMore && !loadingMore) {
      loadActivities(false);
    }
  }, [hasMore, loadingMore, offset]);

  const getActivityIcon = (iconType: string) => {
    switch (iconType) {
      case 'sc':
        return <SvgXml xml={ScIconSvg} width={20} height={20} color="#333" />;
      case 'lining':
        return <SvgXml xml={LiningIconSvg} width={28} height={12} color="#333" />;
      default:
        return <MaterialCommunityIcons name="store" size={20} color="#333" />;
    }
  };

  const ActivityItem = ({ activity }: { activity: Activity }) => (
    <TouchableOpacity style={styles.activityCard}>
      <View style={styles.activityIcon}>
        {getActivityIcon(activity.icon)}
      </View>
      
      <View style={styles.activityInfo}>
        <Text style={[styles.activityType, { color: '#000' }]}>
          {activity.type === 'earned' ? 'Earned' : 'Spend'}
        </Text>
        <Text style={[styles.activityVenue, { color: '#666' }]}>
          {activity.venue}
        </Text>
      </View>
      
      <View style={styles.activityAmount}>
        <Text style={[styles.amountText, { color: '#000' }]}>
          QR {activity.amount}
        </Text>
        <View style={styles.pointsRow}>
          <Text style={[
            styles.pointsAmount,
            { color: activity.type === 'earned' ? '#4CAF50' : '#F44336' }
          ]}>
            {activity.points}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const groupActivitiesByDate = () => {
    const grouped: { [key: string]: Activity[] } = {};
    
    activities.forEach(activity => {
      const dateKey = activity.isToday ? 'TODAY' : activity.date;
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(activity);
    });
    
    // Sort dates so TODAY comes first
    const sortedDates = Object.keys(grouped).sort((a, b) => {
      if (a === 'TODAY') return -1;
      if (b === 'TODAY') return 1;
      return new Date(b.split('/').reverse().join('-')).getTime() - 
             new Date(a.split('/').reverse().join('-')).getTime();
    });
    
    return sortedDates.map(date => ({
      date,
      activities: grouped[date]
    }));
  };

  const renderDateSection = ({ item }: { item: { date: string; activities: Activity[] } }) => (
    <View style={styles.dateSection}>
      <Text style={[styles.dateLabel, { color: '#666' }]}>{item.date}</Text>
      {item.activities.map((activity) => (
        <ActivityItem key={activity.id} activity={activity} />
      ))}
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color="#F1C229" />
        <Text style={[styles.loadingText, { color: colors.icon }]}>Loading more...</Text>
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons name="history" size={48} color={colors.icon} />
        <Text style={[styles.emptyTitle, { color: colors.text }]}>No Activities Yet</Text>
        <Text style={[styles.emptyMessage, { color: colors.icon }]}>
          {error ? error : 'Your transaction history will appear here'}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol name="arrow.left" size={28} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Activities</Text>
          <View style={styles.backButton} />
        </View>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F1C229" />
          <Text style={[styles.loadingText, { color: colors.icon }]}>Loading activities...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="arrow.left" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Activities</Text>
        <View style={styles.backButton} />
      </View>

      <FlatList
        style={[styles.content, { backgroundColor: '#E8E8E8' }]}
        data={groupActivitiesByDate()}
        renderItem={renderDateSection}
        keyExtractor={(item) => item.date}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#F1C229']}
            tintColor="#F1C229"
          />
        }
      />
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
  dateSection: {
    marginBottom: 20,
  },
  dateLabel: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    marginBottom: 10,
    marginLeft: 5,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    marginBottom: 2,
  },
  activityVenue: {
    fontSize: 12,
    marginBottom: 4,
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  pointsText: {
    fontSize: 12,
    fontWeight: '500',
  },
  activityAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  pointsAmount: {
    fontSize: 12,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});