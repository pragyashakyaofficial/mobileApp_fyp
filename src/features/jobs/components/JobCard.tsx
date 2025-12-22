import React from 'react';
import { View } from 'react-native';
import { Card, Text, Avatar, useTheme } from 'react-native-paper';
import styled from 'styled-components/native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Job } from '@types';
import { RootStackParamList } from '../../../types/navigation';

interface JobCardProps {
  job: Job;
  selectedStatus: 'Pending' | 'Completed';
}

const JobCard: React.FC<JobCardProps> = ({ job, selectedStatus }) => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handlePress = () => {
    navigation.navigate('JobDetails', { jobId: job.id });
  };

  const isPending = selectedStatus === 'Pending';
  const icon = isPending ? 'alert-circle-outline' : 'check-circle-outline';
  const iconContainerColor = isPending ? theme.colors.primary : theme.colors.secondary;

  const timeStatus = job.priority === 'High' ? 'Urgent' : 'Minor';

  const getStatusBackgroundColor = (status: string) => {
    return status === 'Urgent' ? theme.colors.errorContainer : theme.colors.primaryContainer;
  };

  const getStatusColor = (status: string) => {
    return status === 'Urgent' ? theme.colors.onErrorContainer : theme.colors.onPrimaryContainer;
  };

  return (
    <CardContainer>
      <StyledCard onPress={handlePress}>
        <Card.Title
          title={job.title}
          subtitle={`Address: ${job.location.address}`}
          left={(props) => (
            <Avatar.Icon
              {...props}
              icon={icon}
              style={{ backgroundColor: iconContainerColor }}
            />
          )}
          titleStyle={{ fontWeight: 'bold' }}
        />
        <StatusText
          style={{
            backgroundColor: getStatusBackgroundColor(timeStatus),
            color: getStatusColor(timeStatus),
          }}
        >
          {timeStatus}
        </StatusText>
      </StyledCard>
    </CardContainer>
  );
};

const CardContainer = styled.View`
  padding: 5px;
  align-items: center;
  justify-content: center;
`;

const StyledCard = styled(Card)`
  width: 100%;
  margin-bottom: 10px;
  background-color: ${({ theme }) => theme.colors.surface};
`;

const StatusText = styled(Text)`
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: bold;
`;

export default JobCard;
