import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabIcon from '@/components/TabIcon';

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#F1C229',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.5)',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '400',
        },
        tabBarStyle: Platform.select({
          ios: {
            backgroundColor: '#000000',
            borderTopWidth: 0,
            height: 85,
            paddingBottom: 25,
            paddingTop: 10,
          },
          default: {
            backgroundColor: '#000000',
            borderTopWidth: 0,
            height: 70,
            paddingBottom: 10,
            paddingTop: 10,
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabIcon icon="home" color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="activities"
        options={{
          title: 'Activity',
          tabBarIcon: ({ color }) => <TabIcon icon="activity" color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="partners"
        options={{
          title: 'Partners',
          tabBarIcon: ({ color }) => <TabIcon icon="partners" color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color }) => <TabIcon icon="notifications" color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
