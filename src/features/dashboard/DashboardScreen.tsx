import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { Avatar, Card, Title, Paragraph, Text } from 'react-native-paper';
import { TabView, SceneMap } from 'react-native-tab-view';
import styled from 'styled-components/native';
import UrgentJobs from './components/UrgentJobs';
import TodaysJobs from './components/TodaysJobs';
import UpcomingJobs from './components/UpcomingJobs';

const renderScene = SceneMap({
  urgent: UrgentJobs,
  today: TodaysJobs,
  upcoming: UpcomingJobs,
});

const DashboardScreen = () => {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'urgent', title: 'Urgent' },
    { key: 'today', title: 'Today' },
    { key: 'upcoming', title: 'Upcoming' },
  ]);
  return (
    <Container>
      <Header>
        <Avatar.Image size={64} source={{ uri: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }} />
        <UserInfo>
          <Title>Hello, Designer!</Title>
          <Paragraph>4.5 ★</Paragraph>
        </UserInfo>
      </Header>

      <StatsContainer>
        <StatCard>
          <Card.Content>
            <Title>12</Title>
            <Paragraph>Total Jobs</Paragraph>
          </Card.Content>
        </StatCard>
        <StatCard>
          <Card.Content>
            <Title>5</Title>
            <Paragraph>In Progress</Paragraph>
          </Card.Content>
        </StatCard>
        <StatCard>
          <Card.Content>
            <Title>7</Title>
            <Paragraph>Completed</Paragraph>
          </Card.Content>
        </StatCard>
        <StatCard>
          <Card.Content>
            <Title>2</Title>
            <Paragraph>Urgent</Paragraph>
          </Card.Content>
        </StatCard>
      </StatsContainer>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: 360 }}
      />
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

const StatsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.base * 3}px;
`;

const StatCard = styled(Card)`
  width: 48%;
  margin-bottom: ${({ theme }) => theme.spacing.base * 2}px;
`;

export default DashboardScreen;

