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

interface Activity {
  id: string;
  type: 'earned' | 'spent';
  venue: string;
  amount: string;
  points: string;
  icon: string;
  date?: string;
  isToday?: boolean;
}

const activitiesData: Activity[] = [
  {
    id: '1',
    type: 'earned',
    venue: 'At Sports corner City Center',
    amount: 'QR 21.52',
    points: '+ 1520 pts',
    icon: 'basketball',
    isToday: true,
  },
  {
    id: '2',
    type: 'earned',
    venue: 'At Sports corner City Center',
    amount: 'QR 52.00',
    points: '+ 3265 pts',
    icon: 'play',
    date: '28/06/2025',
  },
  {
    id: '3',
    type: 'spent',
    venue: 'At Li-Ning City Center',
    amount: 'QR 30.50',
    points: '- 2245 pts',
    icon: 'shoe-print',
  },
  {
    id: '4',
    type: 'earned',
    venue: 'At Sports corner City Center',
    amount: 'QR 52.00',
    points: '+ 3265 pts',
    icon: 'play',
    date: '23/06/2025',
  },
  {
    id: '5',
    type: 'earned',
    venue: 'At Sports corner City Center',
    amount: 'QR 52.00',
    points: '+ 3265 pts',
    icon: 'play',
  },
  {
    id: '6',
    type: 'earned',
    venue: 'At Sports corner City Center',
    amount: 'QR 52.00',
    points: '+ 3265 pts',
    icon: 'play',
  },
];

export default function ActivitiesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const ActivityItem = ({ activity }: { activity: Activity }) => (
    <TouchableOpacity style={[styles.activityCard, { backgroundColor: colors.card }]}>
      <View style={styles.activityIcon}>
        <MaterialCommunityIcons 
          name={activity.icon as any} 
          size={24} 
          color="#333" 
        />
      </View>
      
      <View style={styles.activityInfo}>
        <Text style={[styles.activityType, { color: colors.text }]}>
          {activity.type === 'earned' ? 'Earned' : 'Spend'}
        </Text>
        <Text style={[styles.activityVenue, { color: colors.icon }]}>
          {activity.venue}
        </Text>
        <View style={styles.pointsRow}>
          <IconSymbol 
            name={activity.type === 'earned' ? 'arrow.down' : 'arrow.up'} 
            size={12} 
            color={activity.type === 'earned' ? '#4CAF50' : '#F44336'} 
          />
          <Text style={[
            styles.pointsText,
            { color: activity.type === 'earned' ? '#4CAF50' : '#F44336' }
          ]}>
            {activity.points}
          </Text>
        </View>
      </View>
      
      <View style={styles.activityAmount}>
        <Text style={[styles.amountText, { color: colors.text }]}>
          {activity.amount}
        </Text>
        <Text style={[
          styles.pointsAmount,
          { color: activity.type === 'earned' ? '#4CAF50' : '#F44336' }
        ]}>
          {activity.points}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderActivitiesByDate = () => {
    const todayActivities = activitiesData.filter(activity => activity.isToday);
    const dateActivities = activitiesData.filter(activity => activity.date);
    const otherActivities = activitiesData.filter(activity => !activity.isToday && !activity.date);
    
    return (
      <>
        {todayActivities.length > 0 && (
          <View style={styles.dateSection}>
            <Text style={[styles.dateLabel, { color: colors.icon }]}>TODAY</Text>
            {todayActivities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </View>
        )}
        
        {dateActivities.map((activity) => (
          <View key={activity.id} style={styles.dateSection}>
            <Text style={[styles.dateLabel, { color: colors.icon }]}>{activity.date}</Text>
            <ActivityItem activity={activity} />
          </View>
        ))}
        
        {otherActivities.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Activities</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderActivitiesByDate()}
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
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
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
    marginBottom: 2,
  },
  activityVenue: {
    fontSize: 12,
    marginBottom: 4,
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
    marginBottom: 2,
  },
  pointsAmount: {
    fontSize: 12,
    fontWeight: '500',
  },
});