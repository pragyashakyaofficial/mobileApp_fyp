import React from 'react';
import { View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import styled from 'styled-components/native';

const AdditionalDetailsStep = () => {
  return (
    <Container>
      <Text>Add any additional details.</Text>
      <StyledInput label="Worker Notes" multiline numberOfLines={4} />
      {/* TODO: Implement materials used confirmation */}
      {/* TODO: Implement additional time reporting */}
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
`;

const StyledInput = styled(TextInput)`
  margin-top: ${({ theme }) => theme.spacing.base * 2}px;
`;

export default AdditionalDetailsStep;
