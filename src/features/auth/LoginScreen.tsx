import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import styled from 'styled-components/native';
import { useLoginMutation } from './authApiSlice';

const FormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof FormSchema>;

const LoginScreen = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
  });

  const [login, { isLoading }] = useLoginMutation();

  const onSubmit = async (data: FormData) => {
    try {
      await login(data).unwrap();
    } catch (err) {
      console.error('Failed to login: ', err);
      // TODO: Show error message to user
    }
  };

  return (
    <Container>
      <Title>Login</Title>
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

      <StyledButton mode="contained" onPress={handleSubmit(onSubmit)} loading={isLoading} disabled={isLoading}>
        Login
      </StyledButton>

      <ForgotPassword>
        Forgot Password?
      </ForgotPassword>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.base * 2}px;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Title = styled(Text)`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.base * 3}px;
  color: ${({ theme }) => theme.colors.primary};
`;

const StyledInput = styled(TextInput)`
  margin-bottom: ${({ theme }) => theme.spacing.base * 2}px;
`;

const StyledButton = styled(Button)`
  margin-top: ${({ theme }) => theme.spacing.base * 2}px;
`;

const ErrorText = styled(Text)`
  color: ${({ theme }) => theme.colors.error};
  margin-bottom: ${({ theme }) => theme.spacing.base}px;
`;

const ForgotPassword = styled(Text)`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.base * 2}px;
  color: ${({ theme }) => theme.colors.primary};
`;

export default LoginScreen;
