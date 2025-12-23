import { apiSlice } from '@api/apiSlice';
import { setCredentials, logout } from './authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation({
      query: credentials => {
        console.log('Calling POST /api/auth/login with payload:', JSON.stringify(credentials, null, 2));
        return {
          url: '/auth/login',
          method: 'POST',
          body: credentials,
        };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log('Response from POST /api/auth/login:', JSON.stringify(data, null, 2));
          if (data && data.user && data.access_token) {
            const { user, access_token } = data;
            await AsyncStorage.setItem('user', JSON.stringify(user));
            await AsyncStorage.setItem('token', access_token);
            dispatch(setCredentials({ user, token: access_token }));
          } else {
            throw new Error('Invalid login response from server.');
          }
        } catch (error) {
          console.error('Error in POST /api/auth/login:', error);
        }
      },
    }),
    register: builder.mutation({
      query: (userInfo) => {
        console.log('Calling POST /api/auth/register with payload:', JSON.stringify(userInfo, null, 2));
        return {
          url: '/auth/register',
          method: 'POST',
          body: userInfo,
        };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log('Response from POST /api/auth/register:', JSON.stringify(data, null, 2));
          if (data && data.user && data.access_token) {
            const { user, access_token } = data;
            await AsyncStorage.setItem('user', JSON.stringify(user));
            await AsyncStorage.setItem('token', access_token);
            dispatch(setCredentials({ user, token: access_token }));
          } else {
            throw new Error('Invalid register response from server.');
          }
        } catch (error) {
          console.error('Error in POST /api/auth/register:', error);
        }
      }
    }),
    logout: builder.mutation({
      query: () => {
        console.log('Calling POST /api/auth/logout');
        return {
          url: '/auth/logout',
          method: 'POST',
        };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          console.log('Logout successful');
          await AsyncStorage.multiRemove(['user', 'token']);
          dispatch(logout());
        } catch (error) {
          console.error('Error in POST /api/auth/logout:', error);
          // Still clear local data even if API fails
          await AsyncStorage.multiRemove(['user', 'token']);
          dispatch(logout());
        }
      },
    })
  }),
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation } = authApiSlice;
