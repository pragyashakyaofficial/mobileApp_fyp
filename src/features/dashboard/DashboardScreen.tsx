import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, Dimensions, Pressable, StatusBar, Image, RefreshControl } from 'react-native';
import { Text, Card, IconButton, useTheme, Divider, Button, Surface, MD3Theme, ActivityIndicator } from 'react-native-paper';
import { useNavigation, NavigationProp, CommonActions } from '@react-navigation/native';
import styled from 'styled-components/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useGetMyJobsQuery } from '@features/worker/workerApiSlice';
import { LOGO_IMAGE } from '@assets/images';
import { User } from '@types';
import { updateJobsTabParams } from '@navigation/BottomTabNavigator';
import { DashboardSkeleton } from '@components/SkeletonLoader';



type RootStackParamList = {
  Profile: undefined;
  JobList: { filter: 'Pending' | 'Completed' };
  JobsTab: { filter: 'Pending' | 'Completed' };
};

const { width } = Dimensions.get('window');

const DashboardScreen = () => {
  const theme = useTheme();
  const themedStyles = styles(theme);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { data: jobs, isLoading: isLoadingJobs, isError, error, refetch: refetchJobs } = useGetMyJobsQuery();
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (e) {
        console.error('Failed to fetch user from storage', e);
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchUser();
  }, []);
  
  // Pull-to-refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Refetch jobs data
      await refetchJobs();
      
      // Also refresh user data from AsyncStorage
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
      
      console.log('Dashboard refreshed');
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  if (isLoadingJobs || isLoadingUser) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return <CenteredContainer><Text>Error fetching jobs.</Text></CenteredContainer>;
  }

  const jobsData = jobs?.data || [];

  const totalJobsCount = jobsData.length;
  const pendingCount = jobsData.filter((job) => job.status === 'pending' || job.status === 'assigned').length;
  const completedCount = jobsData.filter((job) => job.status === 'completed').length;
  const urgentJobsCount = jobsData.filter((job) => job.priority >= 3 && (job.status === 'pending' || job.status === 'assigned')).length;

  const gotoProfile = () => navigation.navigate('Profile');
  const gotoPendingJobs = () => navigation.navigate('JobsTab', { filter: 'Pending' }); // Changed from JobList
  // const gotoCompletedJobs = () => navigation.navigate('JobsTab', { filter: 'Completed' });

  const gotoCompletedJobs = () => {
    // navigation.navigate('JobsTab', { filter: 'Completed' });
    updateJobsTabParams({ filter: 'Completed' }),
    // Navigate to JobsTab
    navigation.navigate('JobsTab', { filter: 'Completed' });
  };

  return (
    <ScrollView 
      style={themedStyles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme.colors.primary]}
          tintColor={theme.colors.primary}
          progressBackgroundColor="#ffffff"
          title="Refreshing..."
          titleColor={theme.colors.secondary}
        />
      }
    >
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <View style={themedStyles.headerWrapper}>
       <View style={themedStyles.headerContainer}>
         <Image
           source={LOGO_IMAGE}
           style={themedStyles.logoImage}
           resizeMode="contain"
         />
     
         <View>
           <Text style={themedStyles.headerText}>Design Ease</Text>
           <Text style={themedStyles.subHeaderText}>
             Interior Work Manager
           </Text>
         </View>
       </View>
     </View>

      <View style={themedStyles.viewcard}>
        <Card style={themedStyles.card} onPress={gotoProfile}>
          <View style={themedStyles.userInfo}>
            <IconButton icon="account-box" size={60} iconColor={theme.colors.primary} onPress={gotoProfile} />
            <View style={themedStyles.textContainer}>
              <Text style={themedStyles.userName}>Hello, {user?.name || 'Designer'}!</Text>
              <Text style={themedStyles.userInfoActive}>Active</Text>
              <Text variant='bodyLarge' style={[ { color: theme.colors.secondary } ]}>Contact: {user?.contact || 'N/A'}</Text>
              <Text variant='bodyLarge' style={[ { color: theme.colors.secondary } ]}>Email: {user?.email || 'N/A'}</Text>
            </View>
          </View>
        </Card>
      </View>

      <View style={themedStyles.statsContainer}>
        <Card style={[themedStyles.statBox, themedStyles.outlinecard]}>
          <Text style={themedStyles.statText}>Total</Text>
          <Text style={themedStyles.statNumber}>{totalJobsCount}</Text>
        </Card>
        <Card style={[themedStyles.statBox, themedStyles.pendingJobs]} onPress={gotoPendingJobs}>
          <Text style={[themedStyles.statText, { color: theme.colors.accent }]}>Pendings</Text>
          <Text style={[themedStyles.statNumber, { color: theme.colors.accent }]}>{pendingCount}</Text>
        </Card>
        <Card style={[themedStyles.statBox, { borderColor: theme.colors.secondary, borderWidth: 0.5 }]} onPress={gotoCompletedJobs}>
          <Text style={[themedStyles.statText, { color: theme.colors.secondary, fontWeight: 'bold' }]}>Completed</Text>
          <Text style={[themedStyles.statNumber, { color: theme.colors.secondary }]}>{completedCount}</Text>
        </Card>
      </View>

      <View style={themedStyles.viewcard}>
        <Card style={themedStyles.summarycard}>
          <Text style={themedStyles.cardTitle}>Job Summary:</Text>
          <View style={themedStyles.inlineRow}>
            <IconButton icon="calendar-multiple-check" size={20} iconColor={theme.colors.primary}/>
            <Text style={themedStyles.inlineItem}>{user?.position || 'Designer'} since {user?.joineddate || 'N/A'}</Text>
          </View>
          <Divider />
          <View style={themedStyles.inlineRow}>
            <IconButton icon="map-marker-radius" size={20} iconColor={theme.colors.primary}/>
            <Text style={themedStyles.inlineItem}>{user?.branch || 'Main Branch'}</Text>
          </View>
          <Divider />
          <View style={themedStyles.inlineRow}>
            <IconButton icon="format-list-checks" size={20} iconColor={theme.colors.primary}/>
            <Text style={themedStyles.inlineItem}>Total Job done: {completedCount}</Text>
            <View style={themedStyles.buttonContainer}>
              {/* <Button mode="text" onPress={gotoCompletedJobs} labelStyle={{ color: theme.colors.primary }}>
                See details {'>'}
              </Button> */}
            </View>
          </View>
          {/* <Button mode="text" onPress={gotoProfile} style={themedStyles.exploreButton} labelStyle={themedStyles.exploreLabel}>
            Manage Profile
          </Button> */}
        </Card>
      </View>

      <Text style={[themedStyles.cardTitle, { textAlign: 'center' }]}>Pick a job:</Text>
      <View style={themedStyles.jobsContainer}>
        <Pressable onPress={gotoPendingJobs}>
          <Surface style={[themedStyles.jobCard, themedStyles.urgentJobCard]}>
            <View style={themedStyles.urgentBadge}>
              <Text style={themedStyles.urgentBadgeText}>Urgent</Text>
            </View>
            <Text style={[themedStyles.jobNumber, { color: theme.colors.accent }]}>{urgentJobsCount}</Text>
            <Text style={[themedStyles.jobLabel, { color: theme.colors.accent }]}>Urgent Pendings</Text>
          </Surface>
        </Pressable>
        <Pressable onPress={gotoPendingJobs}>
          <Surface style={themedStyles.jobCard}>
            <Text style={[themedStyles.jobNumber, themedStyles.regularJobNumber]}>{pendingCount}</Text>
            <Text style={themedStyles.regularJobLabel}>All Pending Job</Text>
          </Surface>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = (theme: MD3Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerWrapper: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#ffffff',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    justifyContent: 'center',
    textAlign: 'center',
    borderBottomColor: '#4a6ea5ff',
    borderBottomWidth: 0.40,
  },
  logoImage: {
    width: 48,
    height: 48,
    marginRight: 12,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  subHeaderText: {
    fontSize: 11,
    color: '#FF9500',
    marginTop: 2,
  },
  viewcard: {
    padding: 5,
    marginBottom: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  card: {
    backgroundColor: theme.colors.onPrimary,
    borderRadius: 12,
    padding: 10,
  },
  summarycard: {
    backgroundColor: theme.colors.onPrimary,
    borderRadius: 12,
    padding: 20,
    paddingHorizontal: 20,
  },
  cardTitle: {
    ...theme.fonts.titleLarge,
    // fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    color: theme.colors.primary,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    paddingLeft: 10,
  },
  userName: {
    ...theme.fonts.titleMedium,
    fontWeight: 'bold',
    color: theme.colors.secondary
  },
  userInfoActive: {
    ...theme.fonts.labelMedium,
    backgroundColor: theme.colors.primaryContainer,
    color: theme.colors.onPrimaryContainer,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    position: 'absolute',
    top: 5,
    right: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  statBox: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: theme.colors.onPrimary,
    elevation: 0, // Remove shadow on Android
    shadowColor: 'transparent', // Remove shadow on iOS
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  outlinecard: {
    borderWidth: 0.5,
    borderColor: theme.colors.primary,
  },
  pendingJobs: {
    borderWidth: 0.5,
    borderColor: theme.colors.accent,
    // backgroundColor: theme.colors.accent,
  },
  statText: {
    marginBottom: 5,
    textAlign: 'center',
    ...theme.fonts.bodyLarge,
    color: theme.colors.secondary 
  },
  statNumber: {
    ...theme.fonts.displaySmall,
    textAlign: 'center',
    fontWeight: 'bold',
    color: theme.colors.secondary
  },
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inlineItem: {
    ...theme.fonts.bodyLarge,
    paddingVertical: 12, // Removed fontWeight: 'bold'
    color: theme.colors.secondary 
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  exploreButton: {
    marginTop: 10,
    borderRadius: 8,
    backgroundColor: theme.colors.primaryContainer,
  },
  exploreLabel: {
    ...theme.fonts.bodyLarge,
    color: theme.colors.onPrimaryContainer,
  },
  jobsContainer: {
    flexDirection: 'row',
    gap: 16,
    padding: 10,
    justifyContent: 'center',
  },
  jobCard: {
    width: width / 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.onPrimary,
    borderRadius: 16,
    padding: 16,
    height: 120,
    elevation: 0, // Remove shadow on Android
    shadowColor: 'transparent', // Remove shadow on iOS
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    borderWidth: 0.15,
    borderColor: theme.colors.secondary,
  },
  urgentJobCard: {
    borderWidth: 1,
    borderColor: theme.colors.accent,
  },
  urgentBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: theme.colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 8,
  },
  urgentBadgeText: {
    ...theme.fonts.labelLarge,
    color: theme.colors.onPrimary,
  },
  jobNumber: {
    ...theme.fonts.displaySmall,
    fontWeight: 'bold',
    textAlign: 'center',
    color: theme.colors.onPrimaryContainer,
    marginBottom: 4,
  },
  regularJobNumber: {
    color: theme.colors.onPrimaryContainer,
  },
  jobLabel: {
    ...theme.fonts.bodyMedium,
    textAlign: 'center',
  },
  regularJobLabel: {
    ...theme.fonts.bodyMedium,
    textAlign: 'center',
    color: theme.colors.onPrimaryContainer,
  },
});

const CenteredContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export default DashboardScreen;