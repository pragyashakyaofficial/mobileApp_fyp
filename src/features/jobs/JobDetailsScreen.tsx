import React from 'react';
import { ScrollView, Alert, Linking, Dimensions, View } from 'react-native';
import { 
  Button, 
  Card, 
  Title, 
  Paragraph, 
  Chip, 
  IconButton, 
  useTheme, 
  Avatar, 
  Text,
  ActivityIndicator
} from 'react-native-paper';
import styled from 'styled-components/native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useGetJobDetailsQuery } from './jobApiSlice';
import { format } from 'date-fns';

type RootStackParamList = {
  JobDetails: { jobId: string };
  JobCompletion: { jobId: string };
};

type JobDetailsScreenRouteProp = RouteProp<RootStackParamList, 'JobDetails'>;
type JobDetailsNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width: screenWidth } = Dimensions.get('window');

// Helper function to get initials from name
const getInitials = (name: string) => {
  if (!name) return 'JD';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Helper function to format time from date string
const formatTime = (dateString: string | null) => {
  if (!dateString) return 'N/A';
  try {
    return format(new Date(dateString), 'hh:mm a');
  } catch {
    return 'N/A';
  }
};

// Helper function to format date only
const formatDateOnly = (dateString: string | null) => {
  if (!dateString) return 'N/A';
  try {
    return format(new Date(dateString), 'MMM dd, yyyy');
  } catch {
    return 'N/A';
  }
};

// Interface for DetailCard props
interface DetailCardProps {
  fullWidth?: boolean;
}

const JobDetailsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<JobDetailsNavigationProp>();
  const route = useRoute<JobDetailsScreenRouteProp>();
  const { jobId } = route.params;

  const { data: job, isLoading, isError, error } = useGetJobDetailsQuery(jobId);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    try {
      return format(new Date(dateString), 'PPpp');
    } catch {
      return 'Invalid date';
    }
  };

  const formatShortDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'N/A';
    }
  };

  const formatCurrency = (amount: string | null) => {
    if (!amount) return 'Not specified';
    const parsed = parseFloat(amount);
    if (isNaN(parsed)) return 'Invalid amount';
    return `$${parsed.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getPriorityConfig = (priority: number) => {
    const configs = [
      { label: 'Very Low', color: '#4CAF50', icon: 'arrow-down' as const },
      { label: 'Low', color: '#8BC34A', icon: 'arrow-down' as const },
      { label: 'Medium', color: '#FFC107', icon: 'minus' as const },
      { label: 'High', color: '#FF9800', icon: 'arrow-up' as const },
      { label: 'Urgent', color: '#F44336', icon: 'alert' as const }
    ];
    return configs[priority - 1] || configs[2];
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { label: string; color: string; icon: string }> = {
      pending: { label: 'Pending', color: '#FF9800', icon: 'clock-outline' },
      in_progress: { label: 'In Progress', color: '#2196F3', icon: 'progress-clock' },
      completed: { label: 'Completed', color: '#4CAF50', icon: 'check-circle-outline' },
      cancelled: { label: 'Cancelled', color: '#F44336', icon: 'close-circle-outline' }
    };
    return configs[status] || { label: status, color: '#9E9E9E', icon: 'help-circle-outline' };
  };

  const handleNavigate = () => {
    if (job?.location_lat && job?.location_lng) {
      const url = `https://www.google.com/maps/search/?api=1&query=${job.location_lat},${job.location_lng}`;
      Linking.openURL(url).catch(err => 
        Alert.alert('Navigation Error', 'Could not open maps application')
      );
    }
  };

  if (isLoading) {
    return (
      <Container>
        <LoadingContainer>
          <ActivityIndicator size="large" color={theme.colors?.primary || '#6200ee'} />
          <LoadingText>Loading job details...</LoadingText>
        </LoadingContainer>
      </Container>
    );
  }

  if (isError || !job) {
    return (
      <Container>
        <ErrorContainer>
          <ErrorIcon>
            <IconButton icon="alert-circle-outline" size={64} iconColor={theme.colors?.error || '#d32f2f'} />
          </ErrorIcon>
          <ErrorTitle>Unable to Load Job</ErrorTitle>
          <ErrorDescription>
            {error ? 
              'data' in error ? 
                (error.data as any)?.message || 'An unexpected error occurred' : 
                'Network connection error' 
              : 'Job details not found'}
          </ErrorDescription>
          <Button 
            mode="contained" 
            onPress={() => navigation.goBack()}
            style={{ marginTop: 20 }}
            icon="arrow-left"
          >
            Return to Jobs
          </Button>
        </ErrorContainer>
      </Container>
    );
  }

  const statusConfig = getStatusConfig(job.status);
  const priorityConfig = getPriorityConfig(job.priority);

  return (
    <Container showsVerticalScrollIndicator={false}>
      {/* Top Header with Back Button, Job Number, and Status */}
      <TopHeader>
        <BackButtonContainer>
          <IconButton
            icon="arrow-left"
            size={28}
            iconColor="#FFFFFF"
            onPress={() => navigation.goBack()}
          />
        </BackButtonContainer>
        
        <JobNumberContainer>
          <JobNumberText>Job #{job.id}</JobNumberText>
        </JobNumberContainer>
        
        <StatusContainer>
          <StatusChip style={{ backgroundColor: statusConfig.color }}>
            <StatusText>{statusConfig.label}</StatusText>
          </StatusChip>
        </StatusContainer>
      </TopHeader>

      {/* Hero Header */}
      <HeroHeader>
        <HeroContent>
          <JobTitle>{job.title}</JobTitle>
          
          <JobDescription numberOfLines={3}>
            {job.description || 'No description provided'}
          </JobDescription>
          
          {/* Date, Budget, Priority in single row */}
          <InfoRow>
            <InfoItem>
              <InfoIcon>
                <IconButton icon="calendar-clock" size={20} iconColor="#FFFFFF" />
              </InfoIcon>
              <InfoText>{formatShortDate(job.scheduled_start)}</InfoText>
            </InfoItem>
            
            <InfoItem>
              <InfoIcon>
                <IconButton icon="cash" size={20} iconColor="#FFFFFF" />
              </InfoIcon>
              <InfoText>{formatCurrency(job.budget)}</InfoText>
            </InfoItem>
            
            <InfoItem>
              <InfoIcon>
                <IconButton icon={priorityConfig.icon} size={20} iconColor="#FFFFFF" />
              </InfoIcon>
              <InfoText>{priorityConfig.label}</InfoText>
            </InfoItem>
          </InfoRow>
        </HeroContent>
      </HeroHeader>

      {/* Content Section */}
      <ContentWrapper>
        {/* Quick Actions - Start and Navigate in single row */}
        <QuickActionsCard>
          <CardContent>
            <SectionHeader>
              <IconButton icon="lightning-bolt-outline" size={24} iconColor={theme.colors?.primary || '#6200ee'} />
              <SectionTitle>Quick Actions</SectionTitle>
            </SectionHeader>
            
            <ActionsRow>
              {job.status === 'pending' && (
                <ActionButton
                  mode="contained"
                  onPress={() => {
                    Alert.alert(
                      'Start Job',
                      'Begin working on this job?',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Start Job', onPress: () => {/* API call */} }
                      ]
                    );
                  }}
                  icon="play-circle-outline"
                  style={{ flex: 1, marginRight: 8 }}
                  contentStyle={{ height: 48 }}
                >
                  Start Job
                </ActionButton>
              )}
              
              {job.status === 'in_progress' && (
                <ActionButton
                  mode="contained"
                  onPress={() => navigation.navigate('JobCompletion', { jobId: job.id.toString() })}
                  icon="check-circle-outline"
                  style={{ flex: 1, marginRight: 8 }}
                  contentStyle={{ height: 48 }}
                >
                  Mark Complete
                </ActionButton>
              )}
              
              <SecondaryButton
                mode="outlined"
                onPress={handleNavigate}
                icon="map-marker-radius"
                style={{ flex: 1 }}
                contentStyle={{ height: 48 }}
              >
                Navigate
              </SecondaryButton>
            </ActionsRow>
          </CardContent>
        </QuickActionsCard>

        {/* Room Details */}
        <DetailCard fullWidth>
          <CardContent>
            <DetailHeader>
              <DetailIconContainer style={{ backgroundColor: '#E8F5E9' }}>
                <IconButton icon="home-outline" size={24} iconColor="#4CAF50" />
              </DetailIconContainer>
              <DetailTitle>Room Details</DetailTitle>
            </DetailHeader>
            
            <DetailItem>
              <DetailLabel>Room Type</DetailLabel>
              <DetailValue>{job.room_type || 'Not specified'}</DetailValue>
            </DetailItem>
            
            <DetailItem>
              <DetailLabel>Priority</DetailLabel>
              <DetailValue style={{ color: priorityConfig.color }}>
                {priorityConfig.label}
              </DetailValue>
            </DetailItem>
            
            <DetailItem>
              <DetailLabel>Status</DetailLabel>
              <DetailValue style={{ color: statusConfig.color }}>
                {statusConfig.label}
              </DetailValue>
            </DetailItem>
          </CardContent>
        </DetailCard>

        {/* Schedule */}
        <DetailCard fullWidth>
          <CardContent>
            <DetailHeader>
              <DetailIconContainer style={{ backgroundColor: '#E3F2FD' }}>
                <IconButton icon="calendar-range" size={24} iconColor="#2196F3" />
              </DetailIconContainer>
              <DetailTitle>Schedule</DetailTitle>
            </DetailHeader>
            
            <ScheduleItem>
              <ScheduleIcon>
                <IconButton icon="calendar-start" size={20} iconColor="#666" />
              </ScheduleIcon>
              <ScheduleInfo>
                <ScheduleLabel>Start Date</ScheduleLabel>
                <ScheduleValue>{formatDateOnly(job.scheduled_start)}</ScheduleValue>
              </ScheduleInfo>
            </ScheduleItem>
            
            <ScheduleItem>
              <ScheduleIcon>
                <IconButton icon="calendar-end" size={20} iconColor="#666" />
              </ScheduleIcon>
              <ScheduleInfo>
                <ScheduleLabel>End Date</ScheduleLabel>
                <ScheduleValue>{formatDateOnly(job.scheduled_end)}</ScheduleValue>
              </ScheduleInfo>
            </ScheduleItem>
            
            <ScheduleItem>
              <ScheduleIcon>
                <IconButton icon="clock-outline" size={20} iconColor="#666" />
              </ScheduleIcon>
              <ScheduleInfo>
                <ScheduleLabel>Budget</ScheduleLabel>
                <ScheduleValue style={{ color: '#4CAF50', fontWeight: '600' }}>
                  {formatCurrency(job.budget)}
                </ScheduleValue>
              </ScheduleInfo>
            </ScheduleItem>
          </CardContent>
        </DetailCard>

        {/* Team Section - Both in single row */}
        <DetailCard fullWidth>
          <CardContent>
            <DetailHeader>
              <DetailIconContainer style={{ backgroundColor: '#F3E5F5' }}>
                <IconButton icon="account-group" size={24} iconColor="#9C27B0" />
              </DetailIconContainer>
              <DetailTitle>Team</DetailTitle>
            </DetailHeader>
            
            <TeamRow>
              <TeamMember>
                <MemberAvatar>
                  <Avatar.Text 
                    size={48} 
                    label={getInitials(job.designer.name)}
                    style={{ backgroundColor: '#6366F1' }}
                  />
                </MemberAvatar>
                <MemberInfo>
                  <MemberRole>Designer</MemberRole>
                  <MemberName>{job.designer.name}</MemberName>
                </MemberInfo>
              </TeamMember>
              
              {job.worker && (
                <TeamMember>
                  <MemberAvatar>
                    <Avatar.Text 
                      size={48} 
                      label={getInitials(job.worker.name)}
                      style={{ backgroundColor: '#10B981' }}
                    />
                  </MemberAvatar>
                  <MemberInfo>
                    <MemberRole>Worker</MemberRole>
                    <MemberName>{job.worker.name}</MemberName>
                  </MemberInfo>
                </TeamMember>
              )}
            </TeamRow>
          </CardContent>
        </DetailCard>

        {/* Skills Section - Bullet listed */}
        {job.skills && job.skills.length > 0 && (
          <DetailCard fullWidth>
            <CardContent>
              <DetailHeader>
                <DetailIconContainer style={{ backgroundColor: '#FFF3E0' }}>
                  <IconButton icon="tools" size={24} iconColor="#FF9800" />
                </DetailIconContainer>
                <DetailTitle>Required Skills</DetailTitle>
              </DetailHeader>
              
              <SkillsList>
                {job.skills.map((skill) => (
                  <SkillItem key={skill.id}>
                    <SkillBullet>•</SkillBullet>
                    <SkillName>{skill.name}</SkillName>
                  </SkillItem>
                ))}
              </SkillsList>
            </CardContent>
          </DetailCard>
        )}

        {/* Job Information - Dates and Times */}
        <DetailCard fullWidth>
          <CardContent>
            <DetailHeader>
              <DetailIconContainer style={{ backgroundColor: '#ECEFF1' }}>
                <IconButton icon="information-outline" size={24} iconColor="#607D8B" />
              </DetailIconContainer>
              <DetailTitle>Job Information</DetailTitle>
            </DetailHeader>
            
            <InfoGrid>
              {/* Start Date and Time */}
              <InfoColumn>
                <InfoItemSmall>
                  <InfoIconSmall>
                    <IconButton icon="calendar" size={16} iconColor="#666" />
                  </InfoIconSmall>
                  <InfoContent>
                    <InfoLabelSmall>Start Date</InfoLabelSmall>
                    <InfoValueSmall>{formatDateOnly(job.scheduled_start)}</InfoValueSmall>
                  </InfoContent>
                </InfoItemSmall>
                
                <InfoItemSmall>
                  <InfoIconSmall>
                    <IconButton icon="clock-outline" size={16} iconColor="#666" />
                  </InfoIconSmall>
                  <InfoContent>
                    <InfoLabelSmall>Start Time</InfoLabelSmall>
                    <InfoValueSmall>{formatTime(job.scheduled_start)}</InfoValueSmall>
                  </InfoContent>
                </InfoItemSmall>
              </InfoColumn>
              
              {/* End Date and Time */}
              <InfoColumn>
                <InfoItemSmall>
                  <InfoIconSmall>
                    <IconButton icon="calendar" size={16} iconColor="#666" />
                  </InfoIconSmall>
                  <InfoContent>
                    <InfoLabelSmall>End Date</InfoLabelSmall>
                    <InfoValueSmall>{formatDateOnly(job.scheduled_end)}</InfoValueSmall>
                  </InfoContent>
                </InfoItemSmall>
                
                <InfoItemSmall>
                  <InfoIconSmall>
                    <IconButton icon="clock-outline" size={16} iconColor="#666" />
                  </InfoIconSmall>
                  <InfoContent>
                    <InfoLabelSmall>End Time</InfoLabelSmall>
                    <InfoValueSmall>{formatTime(job.scheduled_end)}</InfoValueSmall>
                  </InfoContent>
                </InfoItemSmall>
              </InfoColumn>
            </InfoGrid>
            
            {/* Additional Metadata */}
            {/* <MetadataRow>
              <MetadataItem>
                <MetaLabel>Job ID</MetaLabel>
                <MetaValue>#{job.id}</MetaValue>
              </MetadataItem>
              
              <MetadataItem>
                <MetaLabel>Created</MetaLabel>
                <MetaValue>{formatShortDate(job.created_at)}</MetaValue>
              </MetadataItem>
            </MetadataRow> */}
          </CardContent>
        </DetailCard>
      </ContentWrapper>
    </Container>
  );
};

// Styled Components
const Container = styled.ScrollView`
  flex: 1;
  background-color: #F8FAFC;
`;

// Top Header with Back, Job Number, and Status
const TopHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: #6366F1;
  z-index: 10;
`;

const BackButtonContainer = styled.View``;

const JobNumberContainer = styled.View`
  flex: 1;
  align-items: center;
`;

const JobNumberText = styled(Text)`
  color: #FFFFFF;
  font-size: 20px;
  font-weight: 700;
`;

const StatusContainer = styled.View``;

const StatusChip = styled.View`
  padding-horizontal: 12px;
  padding-vertical: 6px;
  border-radius: 16px;
  min-width: 80px;
  align-items: center;
  justify-content: center;
`;

const StatusText = styled(Text)`
  color: #FFFFFF;
  font-size: 12px;
  font-weight: 600;
`;

// Hero Header
const HeroHeader = styled.View`
  background-color: #6366F1;
  padding: 24px 16px;
`;

const HeroContent = styled.View``;

const JobTitle = styled(Text)`
  color: #FFFFFF;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 12px;
`;

const JobDescription = styled(Text)`
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  line-height: 24px;
  margin-bottom: 20px;
`;

const InfoRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px;
`;

const InfoItem = styled.View`
  flex: 1;
  align-items: center;
`;

const InfoIcon = styled.View`
  margin-bottom: 4px;
`;

const InfoText = styled(Text)`
  color: #FFFFFF;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
`;

// Content Section
const ContentWrapper = styled.View`
  padding: 24px 16px;
  background-color: #F8FAFC;
`;

const QuickActionsCard = styled(Card)`
  background-color: #FFFFFF;
  border-radius: 16px;
  elevation: 4;
  margin-bottom: 20px;
`;

const CardContent = styled.View`
  padding: 20px;
`;

const SectionHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`;

const SectionTitle = styled(Text)`
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin-left: 12px;
`;

const ActionsRow = styled.View`
  flex-direction: row;
`;

const ActionButton = styled(Button)`
  border-radius: 12px;
`;

const SecondaryButton = styled(Button)`
  border-radius: 12px;
  border-width: 2px;
`;

// Detail Cards
const DetailCard = styled(Card)<DetailCardProps>`
  background-color: #FFFFFF;
  border-radius: 16px;
  elevation: 2;
  margin-bottom: 16px;
`;

const DetailHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`;

const DetailIconContainer = styled.View`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
`;

const DetailTitle = styled(Text)`
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin-left: 12px;
  flex: 1;
`;

const DetailItem = styled.View`
  margin-bottom: 16px;
`;

const DetailLabel = styled(Text)`
  font-size: 12px;
  color: #666;
  font-weight: 600;
  margin-bottom: 4px;
  text-transform: uppercase;
`;

const DetailValue = styled(Text)`
  font-size: 16px;
  color: #333;
  font-weight: 500;
`;

// Schedule Components
const ScheduleItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
`;

const ScheduleIcon = styled.View`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background-color: #F5F5F5;
  align-items: center;
  justify-content: center;
`;

const ScheduleInfo = styled.View`
  margin-left: 12px;
  flex: 1;
`;

const ScheduleLabel = styled(Text)`
  font-size: 12px;
  color: #666;
  margin-bottom: 2px;
`;

const ScheduleValue = styled(Text)`
  font-size: 14px;
  color: #333;
  font-weight: 500;
`;

// Team Components
const TeamRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const TeamMember = styled.View`
  flex: 1;
  align-items: center;
  padding: 12px;
  background-color: #F8FAFC;
  border-radius: 12px;
  margin-right: 8px;
`;

const MemberAvatar = styled.View`
  margin-bottom: 8px;
`;

const MemberInfo = styled.View`
  align-items: center;
`;

const MemberRole = styled(Text)`
  font-size: 12px;
  color: #666;
  font-weight: 600;
  margin-bottom: 4px;
`;

const MemberName = styled(Text)`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  text-align: center;
`;

// Skills Components
const SkillsList = styled.View`
  margin-top: 8px;
`;

const SkillItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
  padding-left: 4px;
`;

const SkillBullet = styled(Text)`
  font-size: 16px;
  color: #4CAF50;
  margin-right: 12px;
  font-weight: bold;
`;

const SkillName = styled(Text)`
  font-size: 16px;
  color: #333;
  font-weight: 500;
`;

// Job Information Components
const InfoGrid = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const InfoColumn = styled.View`
  flex: 1;
  margin-right: 16px;
`;

const InfoItemSmall = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
  padding: 8px;
  background-color: #F8FAFC;
  border-radius: 8px;
`;

const InfoIconSmall = styled.View`
  margin-right: 8px;
`;

const InfoContent = styled.View`
  flex: 1;
`;

const InfoLabelSmall = styled(Text)`
  font-size: 11px;
  color: #666;
  font-weight: 600;
  margin-bottom: 2px;
  text-transform: uppercase;
`;

const InfoValueSmall = styled(Text)`
  font-size: 14px;
  color: #333;
  font-weight: 500;
`;

// Metadata Components
const MetadataRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 16px;
  padding-top: 16px;
  border-top-width: 1px;
  border-top-color: #E5E7EB;
`;

const MetadataItem = styled.View`
  flex: 1;
`;

const MetaLabel = styled(Text)`
  font-size: 11px;
  color: #666;
  font-weight: 600;
  margin-bottom: 4px;
  text-transform: uppercase;
`;

const MetaValue = styled(Text)`
  font-size: 14px;
  color: #333;
  font-weight: 500;
`;

// Loading and Error Components
const LoadingContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
`;

const LoadingText = styled(Text)`
  margin-top: 16px;
  color: #666;
  font-size: 16px;
`;

const ErrorContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
`;

const ErrorIcon = styled.View`
  margin-bottom: 24px;
`;

const ErrorTitle = styled(Text)`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 12px;
  text-align: center;
`;

const ErrorDescription = styled(Text)`
  font-size: 16px;
  color: #666;
  text-align: center;
  line-height: 24px;
  margin-bottom: 8px;
`;

export default JobDetailsScreen;