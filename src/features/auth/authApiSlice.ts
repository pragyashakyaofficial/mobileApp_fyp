import { apiSlice } from '@api/apiSlice';
import { setCredentials } from './authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation({
      query: credentials => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log('Login response data:', data);

          if (data && data.user && data.access_token) {
            const { user, access_token } = data;
            await AsyncStorage.setItem('user', JSON.stringify(user));
            await AsyncStorage.setItem('token', access_token);
            dispatch(setCredentials({ user, token: access_token }));
          } else {
            throw new Error('Invalid login response from server.');
          }
        } catch (error) {
          console.error('Login failed:', error);
        }
      },
    }),
    register: builder.mutation({
        query: (userInfo) => ({
            url: '/auth/register',
            method: 'POST',
            body: userInfo,
        }),
        async onQueryStarted(arg, { dispatch, queryFulfilled }) {
            try {
                const { data } = await queryFulfilled;
                console.log('Register response data:', data);

                if (data && data.user && data.access_token) {
                  const { user, access_token } = data;
                  await AsyncStorage.setItem('user', JSON.stringify(user));
                  await AsyncStorage.setItem('token', access_token);
                  dispatch(setCredentials({ user, token: access_token }));
                } else {
                  throw new Error('Invalid register response from server.');
                }
            } catch (error) {
                console.error('Registration failed:', error);
            }
        }
    })
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApiSlice;
