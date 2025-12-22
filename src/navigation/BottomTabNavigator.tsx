import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DashboardScreen from '@features/dashboard/DashboardScreen';
import JobListScreen from '@features/jobs/JobListScreen';
import ProfileScreen from '@features/profile/ProfileScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let iconSize = size;
          let iconColor = color;

          // Increase size slightly when focused
          if (focused) {
            iconSize = size * 1.15; // 15% larger
            iconColor = '#4A6FA5'; // Dark blue for active
          } else {
            iconColor = '#63acceff'; // Light blue for inactive
          }

          if (route.name === 'DashboardTab') {
            iconName = 'view-dashboard';
          } else if (route.name === 'JobsTab') {
            iconName = 'briefcase';
          } else if (route.name === 'ProfileTab') {
            iconName = 'account';
          }

          return <MaterialCommunityIcons name={iconName} size={iconSize} color={iconColor} />;
        },
        tabBarActiveTintColor: '#4A6FA5', // Dark color for active tab text
        tabBarInactiveTintColor: '#63acceff', // Blue color for inactive tab text
        tabBarLabelStyle: ({ focused }) => ({
          fontSize: 12,
          fontWeight: focused ? '600' : '400',
          marginBottom: focused ? 4 : 2, // More margin when active
          transform: [{ scale: focused ? 1.05 : 1 }], // Slightly enlarge text when active
        }),
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="DashboardTab"
        component={DashboardScreen}
        options={{ tabBarLabel: 'Dashboard' }}
      />
      <Tab.Screen
        name="JobsTab"
        component={JobListScreen}
        options={{ tabBarLabel: 'Jobs' }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;