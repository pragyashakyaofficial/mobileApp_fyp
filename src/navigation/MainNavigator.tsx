import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useSelector } from 'react-redux';
import JobDetailsScreen from '@features/jobs/JobDetailsScreen';
import JobCompletionScreen from '@features/jobs/JobCompletionScreen';
import BottomTabNavigator from './BottomTabNavigator';
import LoginScreen from '@features/auth/LoginScreen';
import RegisterScreen from '@features/auth/RegisterScreen';
import ProfileScreen from '@features/profile/ProfileScreen';
import JobListScreen from '@features/jobs/JobListScreen';
import { RootState } from '@app/store';
import { useLocationTracking } from '@hooks/useLocationTracking';

const Stack = createNativeStackNavigator<RootStackParamList>();

const MainNavigator = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  // TODO: Connect this to user preferences
  const isTrackingEnabled = isAuthenticated;
  useLocationTracking(isTrackingEnabled);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Group>
          <Stack.Screen name="Main" component={BottomTabNavigator} />
          <Stack.Screen name="JobDetails" component={JobDetailsScreen} />
          <Stack.Screen name="JobCompletion" component={JobCompletionScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="JobList" component={JobListScreen} />
        </Stack.Group>
      ) : (
        <Stack.Group>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};

export default MainNavigator;
