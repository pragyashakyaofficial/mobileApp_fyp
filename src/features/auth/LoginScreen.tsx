import React, { useState } from 'react';
import { StyleSheet, KeyboardAvoidingView, Platform, ScrollView, StatusBar, Image, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import styled from 'styled-components/native';
import { useLoginMutation } from './authApiSlice';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { LOGO_IMAGE } from '@assets/images';

// Enhanced validation schema
const FormSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof FormSchema>;

const LoginScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { 
    control, 
    handleSubmit, 
    formState: { errors, isValid, isDirty } 
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [login, { isLoading }] = useLoginMutation();

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    try {
      await login(data).unwrap();
      // Login successful - navigation will be handled by auth state change
    } catch (err: any) {
      console.error('Failed to login: ', err);
      
      // Handle different error types
      if (err.status === 401) {
        setServerError('Invalid email or password');
      } else if (err.status === 429) {
        setServerError('Too many attempts. Please try again later.');
      } else if (err.status === 500) {
        setServerError('Server error. Please try again later.');
      } else if (err.data?.message) {
        setServerError(err.data.message);
      } else {
        setServerError('Network error. Please check your connection.');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoid}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
     <StatusBar backgroundColor="#fff" barStyle="dark-content" />
        <View style={styles.headerWrapper}>
             <View style={styles.headerContainer}>
               <Image
                 source={LOGO_IMAGE}
                 style={styles.logoImage}
                 resizeMode="contain"
               />
           
               <View>
                 <Text style={[styles.headerText, { color: '#4A6FA5' }]}>Design Ease</Text>
                 <Text style={styles.subHeaderText}>
                   Interior Work Manager
                 </Text>
               </View>
             </View>
           </View>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Container>
          <CenterContent>
            <Animated.View entering={FadeIn.duration(600)} style={styles.animatedContainer}>
              <LogoContainer>
                <LogoText>Welcome Back</LogoText>
                <LogoSubText>Sign in to continue</LogoSubText>
              </LogoContainer>

              <FormContainer>
                {serverError && (
                  <Animated.View entering={FadeInDown.duration(300)}>
                    <ServerErrorContainer>
                      <ServerErrorText>{serverError}</ServerErrorText>
                    </ServerErrorContainer>
                  </Animated.View>
                )}

                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <InputContainer>
                      <StyledInput
                        label="Email"
                        onBlur={onBlur}
                        onChangeText={(text) => {
                          onChange(text);
                          setServerError(null);
                        }}
                        value={value}
                        error={!!errors.email}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        autoComplete="email"
                        left={<TextInput.Icon icon="email" size={20} />}
                        mode="outlined"
                        outlineColor="#e0e0e0"
                        activeOutlineColor="#6200ee"
                        style={styles.input}
                      />
                      {errors.email && (
                        <Animated.View entering={FadeInDown.duration(200)}>
                          <ErrorText>{errors.email.message}</ErrorText>
                        </Animated.View>
                      )}
                    </InputContainer>
                  )}
                />

                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <InputContainer>
                      <StyledInput
                        label="Password"
                        onBlur={onBlur}
                        onChangeText={(text) => {
                          onChange(text);
                          setServerError(null);
                        }}
                        value={value}
                        error={!!errors.password}
                        secureTextEntry={!showPassword}
                        autoComplete="password"
                        left={<TextInput.Icon icon="lock" size={20} />}
                        right={
                          <TextInput.Icon
                            icon={showPassword ? "eye-off" : "eye"}
                            onPress={() => setShowPassword(!showPassword)}
                          />
                        }
                        mode="outlined"
                        outlineColor="#e0e0e0"
                        activeOutlineColor="#6200ee"
                        style={styles.input}
                      />
                      {errors.password && (
                        <Animated.View entering={FadeInDown.duration(200)}>
                          <ErrorText>{errors.password.message}</ErrorText>
                        </Animated.View>
                      )}
                    </InputContainer>
                  )}
                />

                <StyledButton
                  mode="contained"
                  onPress={handleSubmit(onSubmit)}
                  loading={isLoading}
                  disabled={isLoading || !isValid || !isDirty}
                  style={styles.button}
                  labelStyle={styles.buttonLabel}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </StyledButton>

                <TermsContainer>
                  <TermsText>
                    By signing in, you agree to our{' '}
                    <TermsLink>Terms of Service</TermsLink> and{' '}
                    <TermsLink>Privacy Policy</TermsLink>
                  </TermsText>
                </TermsContainer>
              </FormContainer>
            </Animated.View>
          </CenterContent>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  headerWrapper: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#ffffff',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    justifyContent: 'center',
    textAlign: 'center',
    // borderBottomColor: '#4a6ea5ff',
    // borderBottomWidth: 0.40,
  },
  logoImage: {
    width: 68,
    height: 68,
    marginRight: 12,
  },
  headerText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#4A6FA5',
  },
  subHeaderText: {
    fontSize: 16,
    color: '#FF9500',
    marginTop: 2,
  },
  scrollContent: {
    flexGrow: 1,
  },
  input: {
    backgroundColor: 'white',
  },
  button: {
    borderRadius: 8,
    paddingVertical: 10,
    marginTop: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
    paddingVertical: 4,
  },
  animatedContainer: {
    width: '100%',
  },
});

const Container = styled.View`
  flex: 1;
  background-color: #ffffffff;
  min-height: 100%;
`;

const CenterContent = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
  min-height: 100%;
`;

const LogoContainer = styled.View`
  align-items: center;
  margin-bottom: 40px;
`;

const LogoText = styled(Text)`
  font-size: 32px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 8px;
`;

const LogoSubText = styled(Text)`
  font-size: 16px;
  color: #7f8c8d;
`;

const FormContainer = styled.View`
  background-color: white;
  padding: 32px 24px;
  border-radius: 20px;
  width: 100%;
  max-width: 400px;
  border-width: 1px;
  border-color: #e0e0e0;
`;

const InputContainer = styled.View`
  margin-bottom: 20px;
  width: 100%;
`;

const StyledInput = styled(TextInput)`
  background-color: white;
`;

const ErrorText = styled(Text)`
  color: #e74c3c;
  font-size: 12px;
  margin-top: 4px;
  margin-left: 4px;
`;

const ServerErrorContainer = styled.View`
  background-color: #ffeaea;
  padding: 12px;
  border-radius: 8px;
  border-left-width: 4px;
  border-left-color: #e74c3c;
  margin-bottom: 20px;
`;

const ServerErrorText = styled(Text)`
  color: #c0392b;
  font-size: 14px;
  text-align: center;
`;

const StyledButton = styled(Button)`
  border-radius: 8px;
  width: 100%;
`;

const TermsContainer = styled.View`
  margin-top: 24px;
  padding-top: 16px;
  border-top-width: 1px;
  border-top-color: #e0e0e0;
`;

const TermsText = styled(Text)`
  color: #95a5a6;
  font-size: 12px;
  text-align: center;
  line-height: 16px;
`;

const TermsLink = styled(Text)`
  color: #6200ee;
  font-weight: 500;
`;

export default LoginScreen;