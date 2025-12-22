import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import styled from 'styled-components/native';

const ReviewSubmitStep = () => {
  return (
    <Container>
      <Text>Review all the information before submitting.</Text>
      {/* TODO: Display summary of all information */}
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
`;

export default ReviewSubmitStep;
