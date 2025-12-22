import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert, StyleSheet, Image } from 'react-native';
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
  Divider
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';

import { User } from '@types';
import { LOGO_IMAGE } from '@assets/images';
import { RootStackParamList } from '../../types/navigation';

const ProfileScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [isLocationSharingEnabled, setIsLocationSharingEnabled] = useState(false);

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

  const onToggleNotifications = () => setIsNotificationsEnabled(!isNotificationsEnabled);
  const onToggleLocationSharing = () => setIsLocationSharingEnabled(!isLocationSharingEnabled);

  const handleAddSkills = () => {
    navigation.navigate('AddSkills');
  };

  if (isLoading) {
    return (
      <Container>
        <View style={styles.centered}>
          <Text style={{ color: theme.colors.secondary }}>Loading profile...</Text>
        </View>
      </Container>
    );
  }

  const skills = [
    { title: 'Interior Design', icon: 'palette' },
    { title: 'Project Management', icon: 'clipboard-check-outline' },
    { title: user?.position || 'Designer', icon: 'badge-account' },
  ];

  const jobStats = [
    { title: 'Total Jobs Done', value: '15', icon: 'clipboard-list' },
    { title: 'Completion Rate', value: '95%', icon: 'chart-line' },
    { title: 'Current Rating', value: '4.5 ★', icon: 'star' },
  ];

  const personalInfo = [
    { title: 'Branch', value: user?.branch || 'Main Branch', icon: 'office-building' },
    { title: 'Joined Date', value: user?.joineddate || 'N/A', icon: 'calendar' },
  ];

  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
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
                <Avatar.Image
                  size={80}
                  source={{ uri: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }}
                />
                <IconButton
                  icon="pencil"
                  size={20}
                  onPress={handleAddSkills}
                  style={styles.editButton}
                  iconColor={theme.colors.primary}
                />
              </View>
              <View style={styles.userInfo}>
                <Title style={[styles.userName, { color: theme.colors.secondary }]}>{user?.name || 'Designer Name'}</Title>
                <Paragraph style={[styles.userContact, { color: theme.colors.secondary }]}>Contact: {user?.contact || 'N/A'}</Paragraph>
                <Paragraph style={[styles.userEmail, { color: theme.colors.secondary }]}>Email: {user?.email || 'N/A'}</Paragraph>
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
            <Title style={[styles.sectionTitle, { color: theme.colors.secondary }]}>Skills & Expertise:</Title>
            {skills.map((skill, index) => (
              <List.Item
                key={index}
                title={skill.title}
                left={props => <List.Icon {...props} icon={skill.icon} color={theme.colors.primary} />}
                style={styles.listItem}
                titleStyle={[styles.listItemTitle, { color: theme.colors.secondary }]}
              />
            ))}
          </Card.Content>
        </Card>

         {/* <Card style={[styles.card, { backgroundColor: theme.colors.onPrimary, borderColor: '#000',
          borderWidth: 0.5, }]}
          >
          <Card.Content>
            <List.Item
              title="Add Skills & Expertise"
              description="Add or update your skills"
              left={props => <List.Icon {...props} icon="plus-circle-outline" color={theme.colors.primary} />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={handleAddSkills}
              style={styles.listItem}
              titleStyle={[styles.listItemTitle, { color: theme.colors.secondary }]}
              descriptionStyle={{ color: theme.colors.secondary }}
            />
          </Card.Content>
        </Card> */}
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
    // borderColor: '#000',
    // borderWidth: 0.20,
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
});

const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
`;

export default ProfileScreen;