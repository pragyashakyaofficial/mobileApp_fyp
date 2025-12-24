import React, { useState, useEffect } from 'react';
import { 
  View, 
  ScrollView, 
  Alert, 
  StyleSheet, 
  Image, 
  RefreshControl
} from 'react-native';
import {
  Avatar,
  Title,
  Paragraph,
  List,
  Switch,
  Card,
  IconButton,
  useTheme,
  Text,
  Divider,
  Button,
  ActivityIndicator
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import styled from 'styled-components/native';

import { User } from '@types';
import { LOGO_IMAGE } from '@assets/images';
import { RootStackParamList } from '../../types/navigation';
import { useLogoutMutation } from '../auth/authApiSlice';
import { logout } from '../auth/authSlice';
import { useGetProfileQuery, UserProfile } from './profileApiSlice';

const ProfileScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [isLocationSharingEnabled, setIsLocationSharingEnabled] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  
  const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();
  
  // API hook for profile data with refetch function
  const { 
    data: profileData, 
    isLoading: isLoadingProfile, 
    error: profileError, 
    refetch: refetchProfile,
    isFetching: isFetchingProfile
  } = useGetProfileQuery();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
        Alert.alert('Error', 'Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Pull-to-refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Force refetch profile data from API
      const result = await refetchProfile();
      
      // Also refresh AsyncStorage user data
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
      
      console.log('Profile refreshed:', result);
      
    } catch (error) {
      console.error('Refresh error:', error);
      Alert.alert('Error', 'Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };
  
  // Show loading state while fetching profile data
  if (isLoadingProfile && !refreshing) {
    return (
      <Container>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </Container>
    );
  }
  
  // Show error state if API call fails
  if (profileError && !refreshing) {
    return (
      <Container>
        <View style={styles.centered}>
          <Text style={styles.errorText}>Failed to load profile data</Text>
          <Button 
            mode="contained" 
            onPress={() => refetchProfile()}
            style={styles.retryButton}
          >
            Retry
          </Button>
        </View>
      </Container>
    );
  }

  const onToggleNotifications = () => setIsNotificationsEnabled(!isNotificationsEnabled);
  const onToggleLocationSharing = () => setIsLocationSharingEnabled(!isLocationSharingEnabled);

  const handleAddSkills = () => {
    navigation.navigate('AddSkills');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logoutMutation(null).unwrap();
              setTimeout(() => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                });
              }, 100);
            } catch (error) {
              console.error('Logout error:', error);
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            }
          },
        },
      ]
    );
  };

  if (isLoading && !refreshing) {
    return (
      <Container>
        <View style={styles.centered}>
          <Text style={{ color: theme.colors.secondary }}>Loading profile...</Text>
        </View>
      </Container>
    );
  }

  // Use profile data from API if available, fallback to AsyncStorage data
  const displayUser = profileData || user;
  
  // Debug: Log the profile data to see its structure
  console.log('Profile Data:', profileData);
  console.log('User Data:', user);
  console.log('Display User:', displayUser);
  
  // Extract skills from API response - FIXED VERSION
  // Handle different possible structures for skills in the API response
  let skills = [];
  
if (profileData?.skills) {
  console.log('Getting skills from profileData API:', profileData.skills);
  skills = profileData.skills.map((skill, index) => ({
    title: skill.name,
    icon: 'circle',
    id: skill.id?.toString() || index.toString()
  }));
} 
// If API returns data but skills array is empty or undefined in profileData
else if (displayUser?.skills) {
  console.log('Getting skills from displayUser:', displayUser.skills);
  if (Array.isArray(displayUser.skills)) {
    skills = displayUser.skills.map((skill, index) => ({
      title: skill.name || skill.title || skill.skill || `Skill ${index + 1}`,
      icon: 'circle',
      id: skill.id || skill._id || index.toString()
    }));
  }
}

// Debug: Add this to see what's happening
console.log('Final skills array:', skills);
console.log('profileData:', profileData);
console.log('displayUser:', displayUser);

// If still no skills, show defaults
if (skills.length === 0) {
  console.log('No skills found, using defaults');
  skills = [
    { title: 'Interior Design', icon: 'circle', id: '1' },
    { title: displayUser?.role || 'Worker', icon: 'circle', id: '2' },
  ];
}

// If still no skills (unlikely with your API response), show defaults
// if (skills.length === 0) {
//   skills = [
//     { title: 'Interior Design', icon: 'circle', id: '1' },
//     { title: displayUser?.role || 'Worker', icon: 'circle', id: '2' },
//   ];
// }
  
  // Debug: Log the skills being displayed
  console.log('Skills to display:', skills);

  // Update job stats to potentially use real data from API
  const jobStats = [
    { 
      title: 'Total Jobs Done', 
      // value: profileData?.totalJobs?.toString() || displayUser?.totalJobs?.toString() || '15', 
      value: '12',
      icon: 'clipboard-list' 
    },
    { 
      title: 'Completion Rate', 
      // value: profileData?.completionRate?.toString() + '%' || displayUser?.completionRate?.toString() + '%' || '95%', 
      value: '95%',
      icon: 'chart-line' 
    },
    // { 
    //   title: 'Current Rating', 
    //   // value: profileData?.rating?.toString() + ' ★' || displayUser?.rating?.toString() + ' ★' || '4.5 ★', 
    //   value: '4.5 ★',
    //   icon: 'star' 
    // },
  ];

  const personalInfo = [
    { title: 'Branch', value: user?.branch || 'Main Branch', icon: 'office-building' },
    { title: 'Joined Date', value: user?.joineddate || 'N/A', icon: 'calendar' },
  ];

const getInitials = (name: string): string => {
  if (!name) return '?';
  
  const nameParts = name.trim().split(' ');
  // Take only the first letter of the first name
  return nameParts[0][0].toUpperCase();
};

  return (
    <Container>
      <ScrollView 
        showsVerticalScrollIndicator={false}
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
       <View style={styles.headerWrapper}>
        <View style={styles.headerContainer}>
          <Image
            source={LOGO_IMAGE}
            style={styles.logoImage}
            resizeMode="contain"
          />
      
          <View>
            <Text style={[styles.headerText, { color: theme.colors.secondary }]}>Design Ease</Text>
            <Text style={styles.subHeaderText}>
              Interior Work Manager
            </Text>
          </View>
        </View>
      </View>

        <Card style={[styles.card, { 
          backgroundColor: theme.colors.onPrimary, 
         }]}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.userHeader}>
              <View style={styles.avatarContainer}>
                {/* <Avatar.Image
                  size={80}
                  source={{ uri: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }}
                /> */}
                <Avatar.Text
    size={80}
    label={getInitials(displayUser?.name || user?.name || 'Designer Name')}
    style={{ backgroundColor: theme.colors.primary }}
    color="#FFFFFF"
  />
                {/* <IconButton
                  icon="pencil"
                  size={20}
                  onPress={handleAddSkills}
                  style={styles.editButton}
                  iconColor={theme.colors.primary}
                /> */}
              </View>
              <View style={styles.userInfo}>
                <Title style={[styles.userName, { color: theme.colors.secondary }]}>
                  {displayUser?.name || user?.name || 'Designer Name'}
                </Title>
                <Paragraph style={[styles.userContact, { color: theme.colors.secondary }]}>
                  Contact: {displayUser?.contact || user?.contact || 'N/A'}
                </Paragraph>
                <Paragraph style={[styles.userEmail, { color: theme.colors.secondary }]}>
                  Email: {displayUser?.email || user?.email || 'N/A'}
                </Paragraph>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={[styles.statsCard, { backgroundColor: theme.colors.onPrimary }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: theme.colors.secondary }]}>Job Statistics</Title>
            <View style={styles.statsGrid}>
              {jobStats.map((stat, index) => (
                <View key={index} style={styles.statItem}>
                  <IconButton
                    icon={stat.icon}
                    size={24}
                    iconColor={theme.colors.primary}
                    style={styles.statIcon}
                  />
                  <Text style={[styles.statValue, { color: theme.colors.secondary }]}>{stat.value}</Text>
                  <Text style={[styles.statLabel, { color: theme.colors.secondary }]}>{stat.title}</Text>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>

        <Card style={[styles.card, { backgroundColor: theme.colors.onPrimary }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: theme.colors.secondary }]}>
              Skills & Expertise ({skills.length})
            </Title>
            <View style={styles.skillsContainer}>
              {skills.map((skill, index) => (
                <View key={skill.id || index} style={styles.skillItem}>
                  <View style={[styles.skillBullet, { backgroundColor: theme.colors.primary }]}>
                    <Text style={styles.skillBulletText}>•</Text>
                  </View>
                  <Text style={[styles.skillName, { color: theme.colors.secondary }]}>
                    {skill.title}
                  </Text>
                </View>
              ))}
            </View>
            
            {/* Show a message if no skills */}
            {skills.length === 0 && (
              <View style={styles.noSkillsContainer}>
                <Text style={[styles.noSkillsText, { color: theme.colors.secondary }]}>
                  No skills added yet. Tap "Add Skills & Expertise" below to add your skills.
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>

         <Card style={[styles.card, styles.smallCard, { 
          backgroundColor: theme.colors.onPrimary, 
          borderColor: theme.colors.secondary,
          borderWidth: 0.5, 
        }]}>
          <Card.Content style={styles.smallCardContent}>
            <List.Item
              title="Add Skills & Expertise"
              description="Add or update your skills"
              left={props => <List.Icon {...props} icon="plus-circle-outline" color={theme.colors.primary} />}
              right={props => <List.Icon {...props} icon="chevron-right" color={theme.colors.primary} />}
              onPress={handleAddSkills}
              style={styles.listItem}
              titleStyle={[styles.listItemTitle, { color: theme.colors.secondary }]}
              descriptionStyle={{ color: theme.colors.secondary, fontSize: 12 }}
            />
          </Card.Content>
        </Card>
        
        {/* Pretty Logout Button */}
        <View style={styles.logoutContainer}>
          <Button
            mode="outlined"
            onPress={handleLogout}
            loading={isLoggingOut}
            disabled={isLoggingOut}
            style={styles.logoutButton}
            contentStyle={styles.logoutButtonContent}
            labelStyle={styles.logoutButtonLabel}
            icon="logout-variant"
          >
            {isLoggingOut ? 'Logging Out...' : 'Logout'}
          </Button>
        </View>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  subHeaderText: {
    fontSize: 11,
    color: '#FF9500',
    marginTop: 2,
  },
  card: {
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 0,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  smallCard: {
    padding: 0,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  smallCardContent: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  statsCard: {
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 0,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  cardContent: {
    paddingVertical: 16,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'white',
    elevation: 0,
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userContact: {
    fontSize: 14,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    margin: 0,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
  },
  listItem: {
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  listItemTitle: {
    fontSize: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoIcon: {
    margin: 0,
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    marginVertical: 4,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#ff4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 20,
  },
  skillsContainer: {
    paddingHorizontal: 8,
  },
  skillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  skillBullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  skillBulletText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 20,
  },
  skillName: {
    fontSize: 16,
    flex: 1,
  },
  logoutContainer: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  logoutButton: {
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#4A6FA5',
    width: '100%',
  },
  logoutButtonContent: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  logoutButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  noSkillsContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noSkillsText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    opacity: 0.7,
  },
});

const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
`;

export default ProfileScreen;