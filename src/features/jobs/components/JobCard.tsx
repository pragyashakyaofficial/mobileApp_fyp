import React from 'react';
import { Pressable } from 'react-native';
import { Card, Title, Paragraph, Badge } from 'react-native-paper';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { Job } from '@types';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('JobDetails', { jobId: job.id });
  };
  return (
    <Pressable onPress={handlePress}>
      <StyledCard>
      <Card.Content>
        <Title>{job.title}</Title>
        <Paragraph>{job.client}</Paragraph>
        <InfoContainer>
          <Badge>{job.priority}</Badge>
          <StatusBadge>{job.status}</StatusBadge>
        </InfoContainer>
        <DetailsContainer>
          <Paragraph>{job.distance}</Paragraph>
          <Paragraph>{job.time}</Paragraph>
        </DetailsContainer>
      </Card.Content>
    </StyledCard>
    </Pressable>
  );
};

const StyledCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.base * 2}px;
`;

const InfoContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing.base}px;
`;

const StatusBadge = styled(Badge)`
  background-color: ${({ theme }) => theme.colors.accent};
`;

const DetailsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing.base}px;
`;

export default JobCard;
