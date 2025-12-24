import React from 'react';
import { ScrollView } from 'react-native';
import { Button, Card, Title, Paragraph, List } from 'react-native-paper';
import styled from 'styled-components/native';
import MapView, { Marker } from 'react-native-maps';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useGetJobDetailsQuery } from './jobApiSlice';
import { CardSkeleton } from '@components/SkeletonLoader';

type RootStackParamList = {
  JobDetails: { jobId: string };
  JobCompletion: { jobId: string };
};

type JobDetailsScreenRouteProp = RouteProp<RootStackParamList, 'JobDetails'>;

import { Text } from 'react-native-paper';

type JobDetailsNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const JobDetailsScreen = () => {
  const navigation = useNavigation<JobDetailsNavigationProp>();
  const route = useRoute<JobDetailsScreenRouteProp>();
  const { jobId } = route.params;

  const { data: job, isLoading, isError } = useGetJobDetailsQuery(jobId);

  if (isLoading) {
    return <CardSkeleton height={400} />;
  }

  if (isError || !job) {
    return <Text>Error loading job details.</Text>;
  }

  return (
    <Container>
      <Title>{job.title}</Title>
      <Paragraph>Designer: {job.designer.name}</Paragraph>
      <Paragraph>Room Type: {job.room_type}</Paragraph>

      {/* TODO: Handle multiple images */}
      <Card>
        <Card.Cover source={{ uri: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7' }} />
      </Card>

      <SectionTitle>Materials</SectionTitle>
      {/* TODO: Add materials data to Job type */}
      <List.Section>
        <List.Item
          title="Paint"
          left={() => <List.Icon icon="checkbox-marked-outline" />}
        />
      </List.Section>

      <SectionTitle>Location</SectionTitle>
      {/* TODO: Add location data to Job type */}
      <MapContainer>
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker coordinate={{ latitude: 37.78825, longitude: -122.4324 }} />
        </MapView>
      </MapContainer>

      <Button mode="contained" onPress={() => { /* TODO: Navigate */ }}>
        Navigate
      </Button>
      <Button mode="outlined" onPress={() => { /* TODO: Start Job */ }}>
        Start Job
      </Button>
      <Button mode="contained" onPress={() => navigation.navigate('JobCompletion', { jobId: job.id.toString() })} style={{ marginTop: 8 }}>
        Mark Complete
      </Button>
    </Container>
  );
};

const Container = styled.ScrollView`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.base * 2}px;
  background-color: ${({ theme }) => theme.colors.background};
`;

const SectionTitle = styled(Title)`
  margin-top: ${({ theme }) => theme.spacing.base * 2}px;
`;

const MapContainer = styled.View`
  height: 200px;
  margin-vertical: ${({ theme }) => theme.spacing.base * 2}px;
`;

export default JobDetailsScreen;
