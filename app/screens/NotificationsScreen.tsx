import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';

interface Notification {
  id: string;
  type: 'achievement' | 'points';
  title: string;
  time: string;
  date?: string;
  isRead: boolean;
}

const notificationsData: Notification[] = [
  {
    id: '1',
    type: 'achievement',
    title: 'Congratulations! You have reached ActivePro Tier',
    time: 'Today at 12:31pm',
    isRead: false,
  },
  {
    id: '2',
    type: 'points',
    title: 'You have earned 1520 new points for your purchase at LI-Ning City Center',
    time: 'Today at 12:31pm',
    isRead: false,
  },
  {
    id: '3',
    type: 'points',
    title: 'You have earned 3210 new points for your purchase at Sports Corner Salwa',
    time: 'Today at 12:31pm',
    date: 'YESTERDAY',
    isRead: false,
  },
  {
    id: '4',
    type: 'points',
    title: 'You have earned 2010 new points for your purchase at Sports Corner Salwa',
    time: 'Today at 12:31pm',
    date: '03/07/2025',
    isRead: false,
  },
  {
    id: '5',
    type: 'points',
    title: 'You have earned 1890 new points for your purchase at RKN Musheireb',
    time: 'Today at 12:31pm',
    date: '28/06/2025',
    isRead: false,
  },
  {
    id: '6',
    type: 'points',
    title: 'You have earned 1520 new points for your purchase at LI-Ning City Center',
    time: 'Today at 12:31pm',
    date: '22/06/2025',
    isRead: false,
  },
];

export default function NotificationsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getNotificationIcon = (type: string) => {
    if (type === 'achievement') {
      return (
        <View style={styles.achievementIcon}>
          <IconSymbol name="star.fill" size={20} color="#F5A623" />
        </View>
      );
    }
    return (
      <View style={styles.pointsIcon}>
        <IconSymbol name="gift.fill" size={16} color="#999" />
      </View>
    );
  };

  const renderDateSeparator = (date: string) => (
    <View style={styles.dateSeparator}>
      <Text style={[styles.dateText, { color: colors.text }]}>{date}</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.markAllContainer}>
        <TouchableOpacity>
          <Text style={styles.markAllText}>Mark all as read</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderDateSeparator('TODAY')}
        
        {notificationsData.slice(0, 2).map((notification) => (
          <View 
            key={notification.id}
            style={[
              styles.notificationItem,
              { backgroundColor: colors.card }
            ]}
          >
            {getNotificationIcon(notification.type)}
            <View style={styles.notificationContent}>
              <Text style={[styles.notificationTitle, { color: colors.text }]}>
                {notification.title}
              </Text>
              <View style={styles.notificationMeta}>
                <IconSymbol name="star.fill" size={12} color="#F5A623" />
                <Text style={[styles.notificationTime, { color: colors.text }]}>
                  {notification.time}
                </Text>
              </View>
            </View>
          </View>
        ))}

        {renderDateSeparator('YESTERDAY')}
        
        {notificationsData.slice(2, 3).map((notification) => (
          <View 
            key={notification.id}
            style={[
              styles.notificationItem,
              { backgroundColor: colors.card }
            ]}
          >
            {getNotificationIcon(notification.type)}
            <View style={styles.notificationContent}>
              <Text style={[styles.notificationTitle, { color: colors.text }]}>
                {notification.title}
              </Text>
              <View style={styles.notificationMeta}>
                <IconSymbol name="star.fill" size={12} color="#F5A623" />
                <Text style={[styles.notificationTime, { color: colors.text }]}>
                  {notification.time}
                </Text>
              </View>
            </View>
          </View>
        ))}

        {notificationsData.slice(3).map((notification) => (
          <View key={notification.id}>
            {notification.date && renderDateSeparator(notification.date)}
            <View 
              style={[
                styles.notificationItem,
                { backgroundColor: colors.card || '#f5f5f5' }
              ]}
            >
              {getNotificationIcon(notification.type)}
              <View style={styles.notificationContent}>
                <Text style={[styles.notificationTitle, { color: colors.text }]}>
                  {notification.title}
                </Text>
                <View style={styles.notificationMeta}>
                  <IconSymbol name="star.fill" size={12} color="#F5A623" />
                  <Text style={[styles.notificationTime, { color: colors.text }]}>
                    {notification.time}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))}
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
  markAllContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  markAllText: {
    color: '#F5A623',
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  dateSeparator: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    opacity: 0.6,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    alignItems: 'flex-start',
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF5E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  pointsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  notificationTime: {
    fontSize: 12,
    opacity: 0.6,
  },
});