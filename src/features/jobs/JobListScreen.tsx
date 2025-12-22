import React from 'react';
import { FlatList } from 'react-native';
import { Searchbar } from 'react-native-paper';
import styled from 'styled-components/native';
import { ActivityIndicator, Text } from 'react-native';
import JobCard from './components/JobCard';
import { useListJobsQuery } from './jobApiSlice';

const JobListScreen = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const { data: jobs, isLoading, isError, error } = useListJobsQuery();

  const onChangeSearch = (query: string) => setSearchQuery(query);

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
        data={jobs}
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
