import React from 'react';
import { FlatList } from 'react-native';
import { Searchbar } from 'react-native-paper';
import styled from 'styled-components/native';
import { ActivityIndicator, Text } from 'react-native';
import JobCard from './components/JobCard';
import { useListJobsQuery } from './jobApiSlice';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigation';
import { Job } from '@types';

type JobListScreenRouteProp = RouteProp<RootStackParamList, 'JobList'>;

const JobListScreen = () => {
  const route = useRoute<JobListScreenRouteProp>();
  const filter = route.params?.filter;
  const [searchQuery, setSearchQuery] = React.useState('');
  const { data: jobsResponse, isLoading, isError, error } = useListJobsQuery();

  const onChangeSearch = (query: string) => setSearchQuery(query);

  const filteredJobs = React.useMemo(() => {
    const jobs = jobsResponse?.data || [];
    if (!jobs) return [];

    let jobsToDisplay = jobs;

    if (filter) {
      jobsToDisplay = jobsToDisplay.filter(job => job.status === filter);
    }

    if (searchQuery) {
      jobsToDisplay = jobsToDisplay.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return jobsToDisplay;
  }, [jobsResponse, filter, searchQuery]);

  if (isLoading) {
    return <Container><ActivityIndicator animating={true} /></Container>;
  }

  if (isError) {
    return <Container><Text>Error fetching jobs: {JSON.stringify(error)}</Text></Container>;
  }

  return (
    <Container>
      <Searchbar
        placeholder="Search Jobs"
        onChangeText={onChangeSearch}
        value={searchQuery}
      />
      {/* TODO: Add filter options and implement search */}
      <FlatList
        data={filteredJobs}
        keyExtractor={item => item.id.toString()}
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
