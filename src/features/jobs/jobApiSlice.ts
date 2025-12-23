import { apiSlice } from '@api/apiSlice';
import { Job, PaginatedResponse } from '@types';

export const jobApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getJobDetails: builder.query<Job, string>({
      query: jobId => {
        console.log(`Calling GET /api/jobs/${jobId}`);
        return `/jobs/${jobId}`;
      },
      providesTags: (result, error, id) => [{ type: 'Job', id }],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log(`Response from GET /api/jobs/${arg}:`, JSON.stringify(data, null, 2));
        } catch (err) {
          console.error(`Error in GET /api/jobs/${arg}:`, err);
        }
      },
    }),
    listJobs: builder.query<PaginatedResponse<Job>, void>({
      query: () => {
        console.log('Calling GET /api/worker/jobs for job list');
        return '/worker/jobs';
      },
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log('Response from GET /api/worker/jobs for job list:', JSON.stringify(data, null, 2));
        } catch (err) {
          console.error('Error in GET /api/worker/jobs for job list:', err);
        }
      },
      providesTags: (result) => {
        const jobs = result?.data || [];
        return jobs
          ? [...jobs.map(({ id }) => ({ type: 'Job' as const, id })), { type: 'Job', id: 'LIST' }]
          : [{ type: 'Job', id: 'LIST' }];
      },
    }),
    createJob: builder.mutation<Job, Partial<Job>>({
      query: (body) => {
        console.log('Calling POST /api/jobs with payload:', JSON.stringify(body, null, 2));
        return {
          url: '/jobs',
          method: 'POST',
          body,
        };
      },
      invalidatesTags: [{ type: 'Job', id: 'LIST' }],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log('Response from POST /api/jobs:', JSON.stringify(data, null, 2));
        } catch (err) {
          console.error('Error in POST /api/jobs:', err);
        }
      },
    }),
  }),
});

export const { useGetJobDetailsQuery, useListJobsQuery, useCreateJobMutation } = jobApiSlice;
