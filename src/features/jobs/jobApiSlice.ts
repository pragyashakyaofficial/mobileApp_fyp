import { apiSlice } from '@api/apiSlice';
import { Job } from '@types';

export const jobApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getJobDetails: builder.query<Job, string>({
      query: jobId => `/jobs/${jobId}`, // TODO: Update with your job details endpoint
      providesTags: (result, error, id) => [{ type: 'Job', id }],
    }),
  }),
});

export const { useGetJobDetailsQuery } = jobApiSlice;
