import { apiSlice } from '@api/apiSlice';
import { setCredentials } from './authSlice';

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
          dispatch(setCredentials({ token: data.access_token }));
        } catch (error) {
          // TODO: Handle login error
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
                dispatch(setCredentials({ token: data.access_token }));
            } catch (error) {
                // TODO: Handle registration error
            }
        }
    })
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApiSlice;
