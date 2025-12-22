import React from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import JobCard from '@features/jobs/components/JobCard';
import { Job } from '@types';

interface JobListProps {
  jobs: Job[];
}

const JobList: React.FC<JobListProps> = ({ jobs }) => {
  return (
    <Container>
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

export default JobList;
