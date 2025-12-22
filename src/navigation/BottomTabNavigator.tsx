import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DashboardScreen from '@features/dashboard/DashboardScreen';
import JobListScreen from '@features/jobs/JobListScreen';
import ProfileScreen from '@features/profile/ProfileScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="DashboardTab"
        component={DashboardScreen}
        options={{
          // tabBarLabel: 'Dashboard',
          // tabBarIcon: ({ color, size }) => (
          //   <MaterialCommunityIcons name="view-dashboard" color={color} size={size} />
          // ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="JobsTab"
        component={JobListScreen}
        options={{
          tabBarLabel: 'Jobs',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="briefcase" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
