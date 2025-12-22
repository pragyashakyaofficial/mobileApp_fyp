import React from 'react';
import { View } from 'react-native';
import { Avatar, Title, Paragraph, List, Switch } from 'react-native-paper';
import styled from 'styled-components/native';

const ProfileScreen = () => {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = React.useState(false);
  const [isLocationSharingEnabled, setIsLocationSharingEnabled] = React.useState(false);

  const onToggleNotifications = () => setIsNotificationsEnabled(!isNotificationsEnabled);
  const onToggleLocationSharing = () => setIsLocationSharingEnabled(!isLocationSharingEnabled);

  return (
    <Container>
      <Header>
        <Avatar.Image size={80} source={{ uri: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }} />
        <UserInfo>
          <Title>Designer Name</Title>
          <Paragraph>Completion Rate: 95%</Paragraph>
          <Paragraph>Rating: 4.5 ★</Paragraph>
        </UserInfo>
      </Header>

      <List.Section title="Skills">
        <List.Item title="Interior Design" left={() => <List.Icon icon="palette" />} />
        <List.Item title="Project Management" left={() => <List.Icon icon="clipboard-check-outline" />} />
      </List.Section>

      <List.Section title="Settings">
        <List.Item
          title="Push Notifications"
          right={() => <Switch value={isNotificationsEnabled} onValueChange={onToggleNotifications} />}
        />
        <List.Item
          title="Location Sharing"
          right={() => <Switch value={isLocationSharingEnabled} onValueChange={onToggleLocationSharing} />}
        />
      </List.Section>
    </Container>
  );
};

const Container = styled.ScrollView`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.base * 2}px;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.base * 3}px;
`;

const UserInfo = styled.View`
  margin-left: ${({ theme }) => theme.spacing.base * 2}px;
`;

export default ProfileScreen;
