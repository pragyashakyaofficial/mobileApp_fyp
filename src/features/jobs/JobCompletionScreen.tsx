import React, { useState } from 'react';
import { 
  View, 
  ScrollView, 
  Alert, 
  KeyboardAvoidingView, 
  Platform, 
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { 
  Button, 
  Card, 
  Title, 
  TextInput, 
  Text, 
  ActivityIndicator,
  useTheme,
  IconButton,
  Avatar
} from 'react-native-paper';
import styled from 'styled-components/native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCompleteJobMutation } from './jobApiSlice';
import { updateJobsTabParams } from '../navigation/BottomTabNavigator';

type RootStackParamList = {
  JobCompletion: { jobId: string };
  JobList: { filter?: 'Pending' | 'Completed' };
  Main: undefined;
};

type JobCompletionScreenRouteProp = RouteProp<RootStackParamList, 'JobCompletion'>;
type JobCompletionNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const JobCompletionScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<JobCompletionNavigationProp>();
  const route = useRoute<JobCompletionScreenRouteProp>();
  const { jobId } = route.params;

  const [completeJob, { isLoading }] = useCompleteJobMutation();
  const [customerReview, setCustomerReview] = useState('');
  const [workerNotes, setWorkerNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    Keyboard.dismiss();
    
    if (!customerReview.trim() && !workerNotes.trim()) {
      Alert.alert(
        'Required Information',
        'Please provide at least customer feedback or your work notes before completing the job.',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await completeJob({ 
        jobId, 
        notes: workerNotes.trim() || customerReview.trim() || 'Job completed successfully' 
      }).unwrap();
      
      Alert.alert(
        '🎉 Job Completed!',
        'The job has been successfully marked as completed.',
        [
          { 
            text: 'View Jobs', 
            onPress: () => {
              updateJobsTabParams({ filter: 'Completed' });
              navigation.navigate('Main');
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'Unable to complete the job at this time. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const characterCount = (text: string) => {
    return text.length;
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <StatusBar backgroundColor="#4A6FA5" barStyle="light-content" />
        
        {/* Header */}
        <Header>
          <HeaderLeft>
            <IconButton
              icon="arrow-left"
              size={24}
              iconColor="#FFFFFF"
              onPress={() => navigation.goBack()}
            />
          </HeaderLeft>
          
          <HeaderCenter>
            <HeaderTitle>Complete Job</HeaderTitle>
            <HeaderSubtitle>Job #{jobId}</HeaderSubtitle>
          </HeaderCenter>
          
          <HeaderRight>
            <Avatar.Text 
              size={36} 
              label="✓" 
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} 
            />
          </HeaderRight>
        </Header>

        {/* Progress Indicator */}
        <ProgressContainer>
          <ProgressStep active>
            <StepNumber>1</StepNumber>
            <StepLabel>Review Work</StepLabel>
          </ProgressStep>
          
          <ProgressLine active />
          
          <ProgressStep active>
            <StepNumber>2</StepNumber>
            <StepLabel>Add Notes</StepLabel>
          </ProgressStep>
          
          <ProgressLine active={customerReview.trim() || workerNotes.trim()} />
          
          <ProgressStep active={customerReview.trim() || workerNotes.trim()}>
            <StepNumber>3</StepNumber>
            <StepLabel>Submit</StepLabel>
          </ProgressStep>
        </ProgressContainer>

        <ContentContainer showsVerticalScrollIndicator={false}>
          {/* Hero Card */}
          <HeroCard>
            <HeroContent>
              <IconButton 
                icon="check-circle-outline" 
                size={48} 
                iconColor="#4A6FA5"
                style={{ marginBottom: 16 }}
              />
              <HeroTitle>Job Completion</HeroTitle>
              <HeroDescription>
                Please provide feedback and notes about the completed work. This helps improve our service quality.
              </HeroDescription>
            </HeroContent>
          </HeroCard>

          {/* Customer Feedback Section */}
          <SectionCard>
            <SectionHeader>
              <SectionIcon style={{ backgroundColor: '#E8F5E9' }}>
                <IconButton icon="account-voice" size={20} iconColor="#4CAF50" />
              </SectionIcon>
              <SectionTitle>Customer Feedback</SectionTitle>
            </SectionHeader>
            
            <SectionDescription>
              Share the customer's feedback or review about the completed work.
            </SectionDescription>
            
            <InputContainer>
              <InputLabel>Customer Review (Optional)</InputLabel>
              <StyledTextInput
                mode="outlined"
                value={customerReview}
                onChangeText={setCustomerReview}
                multiline
                numberOfLines={4}
                placeholder="Enter customer feedback or comments..."
                outlineColor="#E5E7EB"
                activeOutlineColor="#4A6FA5"
                style={{ minHeight: 100, textAlignVertical: 'top' }}
              />
              <CharacterCount>
                {characterCount(customerReview)}/500 characters
              </CharacterCount>
            </InputContainer>
          </SectionCard>

          {/* Worker Notes Section */}
          <SectionCard>
            <SectionHeader>
              <SectionIcon style={{ backgroundColor: '#E3F2FD' }}>
                <IconButton icon="clipboard-text-outline" size={20} iconColor="#2196F3" />
              </SectionIcon>
              <SectionTitle>Work Notes</SectionTitle>
            </SectionHeader>
            
            <SectionDescription>
              Add details about the work completed, materials used, or any important notes.
            </SectionDescription>
            
            <InputContainer>
              <InputLabel>Your Notes (Optional)</InputLabel>
              <StyledTextInput
                mode="outlined"
                value={workerNotes}
                onChangeText={setWorkerNotes}
                multiline
                numberOfLines={4}
                placeholder="Describe the work you completed..."
                outlineColor="#E5E7EB"
                activeOutlineColor="#4A6FA5"
                style={{ minHeight: 100, textAlignVertical: 'top' }}
              />
              <CharacterCount>
                {characterCount(workerNotes)}/1000 characters
              </CharacterCount>
            </InputContainer>
          </SectionCard>

          {/* Tips Section */}
          <TipsCard>
            <TipsHeader>
              <IconButton icon="lightbulb-outline" size={20} iconColor="#FF9800" />
              <TipsTitle>Helpful Tips</TipsTitle>
            </TipsHeader>
            <TipsList>
              <TipItem>• Be specific about the work completed</TipItem>
              <TipItem>• Mention any challenges faced and how they were resolved</TipItem>
              <TipItem>• Include notes about materials used</TipItem>
              <TipItem>• Customer feedback helps improve service quality</TipItem>
            </TipsList>
          </TipsCard>

          {/* Action Buttons */}
          <ActionsContainer>
            <CancelButton
              mode="outlined"
              onPress={() => navigation.goBack()}
              icon="close-circle-outline"
              style={{ flex: 1, marginRight: 12 }}
              contentStyle={{ height: 52 }}
            >
              Cancel
            </CancelButton>
            
            <SubmitButton
              mode="contained"
              onPress={handleSubmit}
              loading={isLoading || isSubmitting}
              disabled={isLoading || isSubmitting}
              icon="check-circle"
              style={{ flex: 1 }}
              contentStyle={{ height: 52 }}
            >
              {isLoading || isSubmitting ? 'Completing...' : 'Complete Job'}
            </SubmitButton>
          </ActionsContainer>

          {/* Bottom Note */}
          <BottomNote>
            <IconButton icon="information-outline" size={16} iconColor="#666" />
            <NoteText>
              Once submitted, this job will be marked as completed and moved to your completed jobs list.
            </NoteText>
          </BottomNote>
        </ContentContainer>
      </Container>
    </TouchableWithoutFeedback>
  );
};

// Styled Components
const Container = styled(KeyboardAvoidingView)`
  flex: 1;
  background-color: #F8FAFC;
`;

// Header
const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: #4A6FA5;
`;

const HeaderLeft = styled.View``;

const HeaderCenter = styled.View`
  flex: 1;
  align-items: center;
`;

const HeaderRight = styled.View``;

const HeaderTitle = styled(Text)`
  color: #FFFFFF;
  font-size: 18px;
  font-weight: 700;
`;

const HeaderSubtitle = styled(Text)`
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  margin-top: 2px;
`;

// Progress Indicator
const ProgressContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 20px 16px;
  background-color: #FFFFFF;
`;

interface ProgressStepProps {
  active?: boolean;
}

const ProgressStep = styled.View<ProgressStepProps>`
  align-items: center;
  opacity: ${props => props.active ? 1 : 0.5};
`;

const StepNumber = styled(Text)`
  width: 32px;
  height: 32px;
  background-color: ${props => props.active ? '#4A6FA5' : '#E5E7EB'};
  color: ${props => props.active ? '#FFFFFF' : '#666'};
  border-radius: 16px;
  text-align: center;
  line-height: 32px;
  font-weight: 600;
  font-size: 14px;
`;

const StepLabel = styled(Text)`
  font-size: 10px;
  color: #666;
  margin-top: 4px;
  font-weight: 500;
`;

interface ProgressLineProps {
  active?: boolean;
}

const ProgressLine = styled.View<ProgressLineProps>`
  width: 40px;
  height: 2px;
  background-color: ${props => props.active ? '#4A6FA5' : '#E5E7EB'};
  margin: 0 8px;
`;

// Content
const ContentContainer = styled(ScrollView)`
  flex: 1;
  padding: 16px;
`;

const HeroCard = styled(Card)`
  background-color: #FFFFFF;
  border-radius: 16px;
  elevation: 2;
  margin-bottom: 16px;
  overflow: hidden;
`;

const HeroContent = styled.View`
  padding: 24px;
  align-items: center;
`;

const HeroTitle = styled(Text)`
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
`;

const HeroDescription = styled(Text)`
  font-size: 14px;
  color: #666;
  text-align: center;
  line-height: 20px;
`;

// Section Cards
const SectionCard = styled(Card)`
  background-color: #FFFFFF;
  border-radius: 16px;
  elevation: 2;
  margin-bottom: 16px;
  padding: 20px;
`;

const SectionHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
`;

const SectionIcon = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

const SectionTitle = styled(Text)`
  font-size: 18px;
  font-weight: 700;
  color: #333;
  flex: 1;
`;

const SectionDescription = styled(Text)`
  font-size: 13px;
  color: #666;
  margin-bottom: 16px;
  line-height: 18px;
`;

const InputContainer = styled.View`
  margin-top: 8px;
`;

const InputLabel = styled(Text)`
  font-size: 12px;
  color: #666;
  font-weight: 600;
  margin-bottom: 8px;
  text-transform: uppercase;
`;

const StyledTextInput = styled(TextInput)`
  background-color: #FFFFFF;
`;

const CharacterCount = styled(Text)`
  font-size: 11px;
  color: #999;
  text-align: right;
  margin-top: 4px;
`;

// Tips Card
const TipsCard = styled(Card)`
  background-color: #FFF3E0;
  border-radius: 16px;
  margin-bottom: 16px;
  padding: 16px;
  border-width: 1px;
  border-color: #FFE0B2;
`;

const TipsHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
`;

const TipsTitle = styled(Text)`
  font-size: 16px;
  font-weight: 700;
  color: #333;
  margin-left: 8px;
`;

const TipsList = styled.View`
  padding-left: 8px;
`;

const TipItem = styled(Text)`
  font-size: 13px;
  color: #666;
  margin-bottom: 6px;
  line-height: 18px;
`;

// Actions
const ActionsContainer = styled.View`
  flex-direction: row;
  margin-top: 8px;
  margin-bottom: 20px;
`;

const CancelButton = styled(Button)`
  border-radius: 12px;
  border-width: 2px;
  border-color: #E5E7EB;
`;

const SubmitButton = styled(Button)`
  border-radius: 12px;
  elevation: 3;
  background-color: #4A6FA5;
`;

// Bottom Note
const BottomNote = styled.View`
  flex-direction: row;
  align-items: flex-start;
  background-color: #F3F4F6;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
`;

const NoteText = styled(Text)`
  font-size: 12px;
  color: #666;
  flex: 1;
  margin-left: 8px;
  line-height: 16px;
`;

export default JobCompletionScreen;