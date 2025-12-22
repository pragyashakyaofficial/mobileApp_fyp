import React from 'react';
import { View, useWindowDimensions, ActivityIndicator } from 'react-native';
import { Avatar, Card, Title, Paragraph, Text } from 'react-native-paper';
import { TabView } from 'react-native-tab-view';
import styled from 'styled-components/native';
import UrgentJobs from './components/UrgentJobs';
import TodaysJobs from './components/TodaysJobs';
import UpcomingJobs from './components/UpcomingJobs';
import { useGetMyJobsQuery } from '@features/worker/workerApiSlice';
import { Job } from '@types';

const DashboardScreen = () => {
  const layout = useWindowDimensions();
  const { data: jobs, isLoading, isError, error } = useGetMyJobsQuery();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'urgent', title: 'Urgent' },
    { key: 'today', title: 'Today' },
    { key: 'upcoming', title: 'Upcoming' },
  ]);

  if (isLoading) {
    return <CenteredContainer><ActivityIndicator animating={true} /></CenteredContainer>;
  }

  if (isError) {
    return <CenteredContainer><Text>Error fetching jobs: {JSON.stringify(error)}</Text></CenteredContainer>;
  }

  const urgentJobs = jobs?.filter(job => job.priority === 'High') || [];
  const todaysJobs = jobs || []; // Assuming all jobs are for today
  const upcomingJobs: Job[] = []; // No upcoming jobs data available

  const renderScene = ({ route }: { route: { key: string } }) => {
    switch (route.key) {
      case 'urgent':
        return <UrgentJobs jobs={urgentJobs} />;
      case 'today':
        return <TodaysJobs jobs={todaysJobs} />;
      case 'upcoming':
        return <UpcomingJobs jobs={upcomingJobs} />;
      default:
        return null;
    }
  };

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
            <Title>{jobs?.length || 0}</Title>
            <Paragraph>Total Jobs</Paragraph>
          </Card.Content>
        </StatCard>
        <StatCard>
          <Card.Content>
            <Title>{jobs?.filter(j => j.status === 'In Progress').length || 0}</Title>
            <Paragraph>In Progress</Paragraph>
          </Card.Content>
        </StatCard>
        <StatCard>
          <Card.Content>
            <Title>{jobs?.filter(j => j.status === 'Completed').length || 0}</Title>
            <Paragraph>Completed</Paragraph>
          </Card.Content>
        </StatCard>
        <StatCard>
          <Card.Content>
            <Title>{urgentJobs.length}</Title>
            <Paragraph>Urgent</Paragraph>
          </Card.Content>
        </StatCard>
      </StatsContainer>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
    </Container>
  );
};

const CenteredContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Container = styled.ScrollView`
  flex: 1;
  padding: 16px;
  background-color: #fff;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 24px;
`;

const UserInfo = styled.View`
  margin-left: 16px;
`;

const StatsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const StatCard = styled(Card)`
  width: 48%;
  margin-bottom: 16px;
`;

export default DashboardScreen;

