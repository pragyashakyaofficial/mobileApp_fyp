import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import styled from 'styled-components/native';
import { useRegisterMutation } from './authApiSlice';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';

const FormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  password_confirmation: z.string(),
}).refine(data => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ['password_confirmation'],
});

type FormData = z.infer<typeof FormSchema>;

const RegisterScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
  });

  const [register, { isLoading }] = useRegisterMutation();

  const onSubmit = async (data: FormData) => {
    try {
      await register(data).unwrap();
    } catch (err) {
      console.error('Failed to register: ', err);
      // TODO: Show error message to user
    }
  };

  return (
    <Container>
      <Title>Register</Title>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <StyledInput
            label="Name"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.name}
          />
        )}
      />
      {errors.name && <ErrorText>{errors.name.message}</ErrorText>}

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <StyledInput
            label="Email"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.email}
            autoCapitalize="none"
          />
        )}
      />
      {errors.email && <ErrorText>{errors.email.message}</ErrorText>}

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <StyledInput
            label="Password"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.password}
            secureTextEntry
          />
        )}
      />
      {errors.password && <ErrorText>{errors.password.message}</ErrorText>}

      <Controller
        control={control}
        name="password_confirmation"
        render={({ field: { onChange, onBlur, value } }) => (
          <StyledInput
            label="Confirm Password"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.password_confirmation}
            secureTextEntry
          />
        )}
      />
      {errors.password_confirmation && <ErrorText>{errors.password_confirmation.message}</ErrorText>}

      <StyledButton mode="contained" onPress={handleSubmit(onSubmit)} loading={isLoading} disabled={isLoading}>
        Register
      </StyledButton>

      <SignInContainer onPress={() => navigation.navigate('Login')}>
        <SignInText>Already have an account? Sign In</SignInText>
      </SignInContainer>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  justify-content: center;
  padding: 16px;
  background-color: #fff;
`;

const Title = styled(Text)`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 24px;
`;

const StyledInput = styled(TextInput)`
  margin-bottom: 16px;
`;

const StyledButton = styled(Button)`
  margin-top: 16px;
`;

const ErrorText = styled(Text)`
  color: red;
  margin-bottom: 8px;
`;

const SignInContainer = styled.TouchableOpacity`
  margin-top: 16px;
  align-items: center;
`;

const SignInText = styled(Text)`
  color: #6200ee;
`;

export default RegisterScreen;
