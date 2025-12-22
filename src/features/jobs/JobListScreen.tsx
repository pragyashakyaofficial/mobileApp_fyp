import React, { useState, useMemo } from 'react';
import { FlatList, View, StyleSheet, ActivityIndicator, Image, StatusBar } from 'react-native';
import { Text, SegmentedButtons, useTheme, MD3Theme } from 'react-native-paper';
import { useRoute, RouteProp } from '@react-navigation/native';
import styled from 'styled-components/native';

import JobCard from './components/JobCard';
import { useListJobsQuery } from './jobApiSlice';
import { RootStackParamList } from '../../types/navigation';
import { LOGO_IMAGE } from '@assets/images';

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



  return (
    <Container>
      <View style={themedStyles.viewcontainer}>
        <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
         <View style={themedStyles.headerContainer}>
                <Image source={LOGO_IMAGE} style={themedStyles.logoImage} resizeMode="contain" />
              </View>
        <SegmentedButtons
          value={selectedSegment}
          onValueChange={(value) => setSelectedSegment(value as 'Pending' | 'Completed')}
          buttons={[
            {
              value: 'Pending',
              label: 'Pending',
              style: {
                backgroundColor: selectedSegment === 'Pending' ? '#4A6FA5' : theme.colors.surface,
              },
              labelStyle: {
                color: selectedSegment === 'Pending' ? theme.colors.onSecondary : theme.colors.onSurface,
              },
            },
            {
              value: 'Completed',
              label: 'Completed',
              style: {
                backgroundColor: selectedSegment === 'Completed' ? '#4A6FA5' : theme.colors.surface,
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
    // padding: 20,
    flex: 1,
  },
   headerContainer: {
    alignItems: 'center',
    // marginVertical: 10,
  },
  logoImage: {
    width: 200,
    height: 100,
  },
  segmentedButtons: {
    marginTop: 20,
    marginBottom: 20,
    width: '80%',
    alignSelf: 'center',
  },
  list: {
    paddingBottom: 20,
  },
});

const Container = styled.View`
  flex: 1;
   background-color: #ffffff;
`;

const CenteredContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
`;

export default JobListScreen;
