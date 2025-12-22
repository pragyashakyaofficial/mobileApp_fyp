import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, Dimensions, Pressable, ActivityIndicator, StatusBar, Image } from 'react-native';
import { Text, Card, IconButton, useTheme, Divider, Button, Surface, MD3Theme } from 'react-native-paper';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import styled from 'styled-components/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useGetMyJobsQuery } from '@features/worker/workerApiSlice';
import { LOGO_IMAGE } from '@assets/images';
import { User } from '@types';

type RootStackParamList = {
  Profile: undefined;
  JobList: { filter: 'Pending' | 'Completed' };
};

const { width } = Dimensions.get('window');

const DashboardScreen = () => {
  const theme = useTheme();
  const themedStyles = styles(theme);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { data: jobs, isLoading: isLoadingJobs, isError, error } = useGetMyJobsQuery();
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

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

  if (isLoadingJobs || isLoadingUser) {
    return <CenteredContainer><ActivityIndicator animating={true} size="large" /></CenteredContainer>;
  }

  if (isError) {
    return <CenteredContainer><Text>Error fetching jobs.</Text></CenteredContainer>;
  }

  const jobsData = jobs?.data || [];

  const totalJobsCount = jobsData.length;
  const pendingCount = jobsData.filter((job) => job.status === 'Pending').length;
  const completedCount = jobsData.filter((job) => job.status === 'Completed').length;
  const urgentJobsCount = jobsData.filter((job) => job.priority === 'High' && job.status === 'Pending').length;

  const gotoProfile = () => navigation.navigate('Profile');
  const gotoPendingJobs = () => navigation.navigate('JobList', { filter: 'Pending' });
  const gotoCompletedJobs = () => navigation.navigate('JobList', { filter: 'Completed' });

  return (
    <ScrollView style={themedStyles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <View style={themedStyles.headerContainer}>
        <Image source={LOGO_IMAGE} style={themedStyles.logoImage} resizeMode="contain" />
      </View>

      <View style={themedStyles.viewcard}>
        <Card style={themedStyles.card} onPress={gotoProfile}>
          <View style={themedStyles.userInfo}>
            <IconButton icon="account-box" size={60} iconColor={theme.colors.secondary} onPress={gotoProfile} />
            <View style={themedStyles.textContainer}>
              <Text style={themedStyles.userName}>Hello, {user?.name || 'Designer'}!</Text>
              <Text style={themedStyles.userInfoActive}>Active</Text>
              <Text variant='bodyLarge'>Contact: {user?.contact || 'N/A'}</Text>
              <Text variant='bodyLarge'>Email: {user?.email || 'N/A'}</Text>
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
          <Text style={[themedStyles.statText, { color: theme.colors.onPrimary }]}>Pendings</Text>
          <Text style={[themedStyles.statNumber, { color: theme.colors.onPrimary }]}>{pendingCount}</Text>
        </Card>
        <Card style={[themedStyles.statBox, { borderColor: theme.colors.secondary, borderWidth: 0.5 }]}>
          <Text style={[themedStyles.statText, { color: theme.colors.secondary, fontWeight: 'bold' }]}>Completed</Text>
          <Text style={[themedStyles.statNumber, { color: theme.colors.secondary }]}>{completedCount}</Text>
        </Card>
      </View>

      <View style={themedStyles.viewcard}>
        <Card style={themedStyles.summarycard}>
          <Text style={themedStyles.cardTitle}>Job Summary:</Text>
          <View style={themedStyles.inlineRow}>
            <IconButton icon="calendar-multiple-check" size={20} />
            <Text style={themedStyles.inlineItem}>{user?.position || 'Designer'} since {user?.joineddate || 'N/A'}</Text>
          </View>
          <Divider />
          <View style={themedStyles.inlineRow}>
            <IconButton icon="map-marker-radius" size={20} />
            <Text style={themedStyles.inlineItem}>{user?.branch || 'Main Branch'}</Text>
          </View>
          <Divider />
          <View style={themedStyles.inlineRow}>
            <IconButton icon="format-list-checks" size={20} />
            <Text style={themedStyles.inlineItem}>Total Job done: {completedCount}</Text>
            <View style={themedStyles.buttonContainer}>
              <Button mode="text" onPress={gotoCompletedJobs} labelStyle={{ color: theme.colors.primary }}>
                See details {'>'}
              </Button>
            </View>
          </View>
          <Button mode="text" onPress={gotoProfile} style={themedStyles.exploreButton} labelStyle={themedStyles.exploreLabel}>
            Manage Profile
          </Button>
        </Card>
      </View>

      <Text style={[themedStyles.cardTitle, { textAlign: 'center' }]}>Pick a job:</Text>
      <View style={themedStyles.jobsContainer}>
        <Pressable onPress={gotoPendingJobs}>
          <Surface style={[themedStyles.jobCard, themedStyles.urgentJobCard]}>
            <View style={themedStyles.urgentBadge}>
              <Text style={themedStyles.urgentBadgeText}>Urgent</Text>
            </View>
            <Text style={[themedStyles.jobNumber, { color: theme.colors.secondary }]}>{urgentJobsCount}</Text>
            <Text style={[themedStyles.jobLabel, { color: theme.colors.secondary }]}>Pending Jobs</Text>
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
    padding: 10,
    backgroundColor: '#fff',
  },
   headerContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  logoImage: {
    width: 100,
    height: 50,
  },
  viewcard: {
    padding: 5,
    marginBottom: 10,
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
  },
  cardTitle: {
    ...theme.fonts.titleLarge,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
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
  },
  statBox: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: theme.colors.onPrimary,
  },
  outlinecard: {
    borderWidth: 0.5,
    borderColor: theme.colors.primary,
  },
  pendingJobs: {
    backgroundColor: theme.colors.primary,
  },
  statText: {
    marginBottom: 5,
    textAlign: 'center',
    ...theme.fonts.bodyLarge,
  },
  statNumber: {
    ...theme.fonts.displaySmall,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inlineItem: {
    ...theme.fonts.bodyLarge,
    fontWeight: 'bold',
    paddingVertical: 12,
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
  },
  urgentJobCard: {
    borderWidth: 1,
    borderColor: theme.colors.secondary,
  },
  urgentBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: theme.colors.primary,
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
    color: theme.colors.primary,
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

