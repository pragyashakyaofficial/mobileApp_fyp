import React from 'react';
import { FlatList } from 'react-native';
import { Searchbar } from 'react-native-paper';
import styled from 'styled-components/native';
import JobCard from './components/JobCard';
import { Job } from '@types';

// Placeholder data
const jobs: Job[] = [
  {
    id: '1',
    title: 'Living Room Redesign',
    client: 'John Doe',
    priority: 'High',
    status: 'In Progress',
    distance: '5km',
    time: '10:00 AM',
    location: { latitude: 37.78825, longitude: -122.4324 },
    materials: ['Paint', 'Brushes', 'Wallpaper'],
    images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7'],
  },
  {
    id: '2',
    title: 'Kitchen Remodel',
    client: 'Jane Smith',
    priority: 'Medium',
    status: 'Pending',
    distance: '12km',
    time: '2:00 PM',
    location: { latitude: 37.78825, longitude: -122.4324 },
    materials: ['Tiles', 'Grout', 'Sink'],
    images: ['https://images.unsplash.com/photo-1567016432779-170799a98343'],
  },
];

const JobListScreen = () => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const onChangeSearch = (query: string) => setSearchQuery(query);

  return (
    <Container>
      <Searchbar
        placeholder="Search Jobs"
        onChangeText={onChangeSearch}
        value={searchQuery}
      />
      {/* TODO: Add filter options */}
      <FlatList
        data={jobs}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <JobCard job={item} />}
      />
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.base}px;
  background-color: ${({ theme }) => theme.colors.background};
`;

export default JobListScreen;
