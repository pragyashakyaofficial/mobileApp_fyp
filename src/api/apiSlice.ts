import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '@app/store';

const baseQuery = fetchBaseQuery({
  baseUrl: 'YOUR_API_BASE_URL', // TODO: Replace with your API base URL
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token; // Assuming you have an auth slice
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// TODO: Implement token refresh logic

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Job', 'User'], // Define tags for caching
  endpoints: builder => ({}),
});
