import { apiSlice } from '@api/apiSlice';

export const locationApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    updateLocation: builder.mutation<void, { latitude: number; longitude: number }>({
      query: location => ({
        url: '/location/update', // TODO: Update with your location update endpoint
        method: 'POST',
        body: location,
      }),
    }),
  }),
});

export const { useUpdateLocationMutation } = locationApiSlice;
