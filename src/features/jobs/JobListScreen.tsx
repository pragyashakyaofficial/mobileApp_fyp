import React, { useState, useMemo } from 'react';
import { FlatList, View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text, SegmentedButtons, useTheme, MD3Theme } from 'react-native-paper';
import { useRoute, RouteProp } from '@react-navigation/native';
import styled from 'styled-components/native';

import JobCard from './components/JobCard';
import { useListJobsQuery } from './jobApiSlice';
import { RootStackParamList } from '../../types/navigation';

type JobListScreenRouteProp = RouteProp<RootStackParamList, 'JobList'>;

const JobListScreen = () => {
  const theme = useTheme();
  const themedStyles = styles(theme);
  const route = useRoute<JobListScreenRouteProp>();
  const initialFilter = route.params?.filter || 'Pending';

  const [selectedSegment, setSelectedSegment] = useState<'Pending' | 'Completed'>(initialFilter);
  const { data: jobsResponse, isLoading, isError, error } = useListJobsQuery();

  const filteredJobs = useMemo(() => {
    const jobs = jobsResponse?.data || [];
    return jobs.filter(job => job.status === selectedSegment);
  }, [jobsResponse, selectedSegment]);

  if (isLoading) {
    return <CenteredContainer><ActivityIndicator animating={true} size="large" /></CenteredContainer>;
  }

  if (isError) {
    return <CenteredContainer><Text>Error fetching jobs.</Text></CenteredContainer>;
  }

  return (
    <Container>
      <View style={themedStyles.viewcontainer}>
        <SegmentedButtons
          value={selectedSegment}
          onValueChange={(value) => setSelectedSegment(value as 'Pending' | 'Completed')}
          buttons={[
            {
              value: 'Pending',
              label: 'Pending',
              style: {
                backgroundColor: selectedSegment === 'Pending' ? theme.colors.secondary : theme.colors.surface,
              },
              labelStyle: {
                color: selectedSegment === 'Pending' ? theme.colors.onSecondary : theme.colors.onSurface,
              },
            },
            {
              value: 'Completed',
              label: 'Completed',
              style: {
                backgroundColor: selectedSegment === 'Completed' ? theme.colors.secondary : theme.colors.surface,
              },
              labelStyle: {
                color: selectedSegment === 'Completed' ? theme.colors.onSecondary : theme.colors.onSurface,
              },
            },
          ]}
          style={themedStyles.segmentedButtons}
        />

        <FlatList
          data={filteredJobs}
          renderItem={({ item }) => <JobCard job={item} selectedStatus={selectedSegment} />}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={themedStyles.list}
        />
      </View>
    </Container>
  );
};

const styles = (theme: MD3Theme) => StyleSheet.create({
  viewcontainer: {
    padding: 20,
    flex: 1,
  },
  segmentedButtons: {
    marginBottom: 20,
  },
  list: {
    paddingBottom: 20,
  },
});

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const CenteredContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background};
`;

export default JobListScreen;
