import { apiSlice } from '@api/apiSlice';
import { Job } from '@types';

export const workerApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getMyJobs: builder.query<Job[], void>({
      query: () => '/worker/jobs',
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Job' as const, id })), { type: 'Job', id: 'MY_JOBS_LIST' }]
          : [{ type: 'Job', id: 'MY_JOBS_LIST' }],
    }),
    completeJob: builder.mutation<Job, { jobId: string; data: FormData }>({
      query: ({ jobId, data }) => ({
        url: `/worker/jobs/${jobId}/complete`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { jobId }) => [{ type: 'Job', id: jobId }, { type: 'Job', id: 'MY_JOBS_LIST' }],
    }),
  }),
});

export const { useGetMyJobsQuery, useCompleteJobMutation } = workerApiSlice;
