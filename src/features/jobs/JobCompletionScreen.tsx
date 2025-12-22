import React, { useState } from 'react';
import { View } from 'react-native';
import { ProgressBar, Button } from 'react-native-paper';
import styled from 'styled-components/native';

// Import steps
import PhotoEvidenceStep from '@features/jobs/components/completion/PhotoEvidenceStep';
import CustomerFeedbackStep from '@features/jobs/components/completion/CustomerFeedbackStep';
import AdditionalDetailsStep from '@features/jobs/components/completion/AdditionalDetailsStep';
import ReviewSubmitStep from '@features/jobs/components/completion/ReviewSubmitStep';

const steps = [
  'Photo Evidence',
  'Customer Feedback',
  'Additional Details',
  'Review & Submit',
];

const JobCompletionScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <PhotoEvidenceStep />;
      case 1:
        return <CustomerFeedbackStep />;
      case 2:
        return <AdditionalDetailsStep />;
      case 3:
        return <ReviewSubmitStep />;
      default:
        return null;
    }
  };

  return (
    <Container>
      <ProgressBar progress={(currentStep + 1) / steps.length} />
      <StepContainer>{renderStep()}</StepContainer>
      <ButtonContainer>
        {currentStep > 0 && <Button onPress={handleBack}>Back</Button>}
        <Button mode="contained" onPress={handleNext}>
          {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
        </Button>
      </ButtonContainer>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.base * 2}px;
  background-color: ${({ theme }) => theme.colors.background};
`;

const StepContainer = styled.View`
  flex: 1;
  margin-vertical: ${({ theme }) => theme.spacing.base * 2}px;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
`;

export default JobCompletionScreen;
