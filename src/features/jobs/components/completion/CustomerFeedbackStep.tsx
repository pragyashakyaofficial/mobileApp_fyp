import React from 'react';
import { View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import styled from 'styled-components/native';

const CustomerFeedbackStep = () => {
  return (
    <Container>
      <Text>Please get customer feedback.</Text>
      {/* TODO: Implement star rating */}
      <StyledInput label="Customer Review" multiline numberOfLines={4} />
      {/* TODO: Implement signature capture */}
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
`;

const StyledInput = styled(TextInput)`
  margin-top: ${({ theme }) => theme.spacing.base * 2}px;
`;

export default CustomerFeedbackStep;
