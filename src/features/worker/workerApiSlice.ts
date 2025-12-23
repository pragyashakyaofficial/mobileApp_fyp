import { apiSlice } from '@api/apiSlice';
import { Job, PaginatedResponse } from '@types';

export const workerApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getMyJobs: builder.query<PaginatedResponse<Job>, void>({
      query: () => {
        console.log('Calling GET /api/worker/jobs');
        return '/worker/jobs';
      },
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log('Response from GET /api/worker/jobs:', JSON.stringify(data, null, 2));
        } catch (err) {
          console.error('Error in GET /api/worker/jobs:', err);
        }
      },
      providesTags: (result) => {
        const jobs = result?.data || [];
        return jobs
          ? [...jobs.map(({ id }) => ({ type: 'Job' as const, id })), { type: 'Job', id: 'MY_JOBS_LIST' }]
          : [{ type: 'Job', id: 'MY_JOBS_LIST' }];
      },
    }),
    completeJob: builder.mutation<Job, { jobId: string; data: FormData }>({
      query: ({ jobId, data }) => {
        console.log(`Calling POST /api/worker/jobs/${jobId}/complete with payload:`, data);
        return {
          url: `/worker/jobs/${jobId}/complete`,
          method: 'POST',
          body: data,
        };
      },
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log(`Response from POST /api/worker/jobs/${arg.jobId}/complete:`, JSON.stringify(data, null, 2));
        } catch (err) {
          console.error(`Error in POST /api/worker/jobs/${arg.jobId}/complete:`, err);
        }
      },
      invalidatesTags: (result, error, { jobId }) => {
        return [{ type: 'Job', id: jobId }, { type: 'Job', id: 'MY_JOBS_LIST' }];
      },
    }),
  }),
});

export const { useGetMyJobsQuery, useCompleteJobMutation } = workerApiSlice;
