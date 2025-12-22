import { apiSlice } from '@api/apiSlice';
import { Job } from '@types';

export const jobApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getJobDetails: builder.query<Job, string>({
      query: jobId => `/jobs/${jobId}`,
      providesTags: (result, error, id) => [{ type: 'Job', id }],
    }),
    listJobs: builder.query<Job[], void>({
        query: () => '/jobs',
        providesTags: (result) =>
            result
                ? [...result.map(({ id }) => ({ type: 'Job' as const, id })), { type: 'Job', id: 'LIST' }]
                : [{ type: 'Job', id: 'LIST' }],
    }),
    createJob: builder.mutation<Job, Partial<Job>>({
        query: (body) => ({
            url: '/jobs',
            method: 'POST',
            body,
        }),
        invalidatesTags: [{ type: 'Job', id: 'LIST' }],
    }),
  }),
});

export const { useGetJobDetailsQuery, useListJobsQuery, useCreateJobMutation } = jobApiSlice;
