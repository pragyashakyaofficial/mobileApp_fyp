import { apiSlice } from '@api/apiSlice';
import { Job, PaginatedResponse } from '@types';

// export const workerApiSlice = apiSlice.injectEndpoints({
//   endpoints: builder => ({
//     getMyJobs: builder.query<Job[], void>({
//       query: () => '/worker/jobs',
//       providesTags: (result) =>
//         result
//           ? [...result.map(({ id }) => ({ type: 'Job' as const, id })), { type: 'Job', id: 'MY_JOBS_LIST' }]
//           : [{ type: 'Job', id: 'MY_JOBS_LIST' }],
//     }),
//     completeJob: builder.mutation<Job, { jobId: string; data: FormData }>({
//       query: ({ jobId, data }) => ({
//         url: `/worker/jobs/${jobId}/complete`,
//         method: 'POST',
//         body: data,
//       }),
//       invalidatesTags: (result, error, { jobId }) => [{ type: 'Job', id: jobId }, { type: 'Job', id: 'MY_JOBS_LIST' }],
//     }),
//   }),
// });
export const workerApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getMyJobs: builder.query<PaginatedResponse<Job>, void>({
      query: () => '/worker/jobs',
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          console.log('✅ getMyJobs successful:', result);
        } catch (error) {
          console.error('❌ getMyJobs failed:', error);
        }
      },
      providesTags: (result) => {
        console.log('📊 getMyJobs result:', result);
        const jobs = result?.data || [];
        return jobs
          ? [...jobs.map(({ id }) => ({ type: 'Job' as const, id })), { type: 'Job', id: 'MY_JOBS_LIST' }]
          : [{ type: 'Job', id: 'MY_JOBS_LIST' }];
      },
    }),
    completeJob: builder.mutation<Job, { jobId: string; data: FormData }>({
      query: ({ jobId, data }) => ({
        url: `/worker/jobs/${jobId}/complete`,
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        console.log('🚀 Starting completeJob:', arg);
        try {
          const result = await queryFulfilled;
          console.log('✅ completeJob successful:', result);
        } catch (error) {
          console.error('❌ completeJob failed:', error);
        }
      },
      invalidatesTags: (result, error, { jobId }) => {
        console.log('🔄 Invalidating tags for job:', jobId);
        return [{ type: 'Job', id: jobId }, { type: 'Job', id: 'MY_JOBS_LIST' }];
      },
    }),
  }),
});

export const { useGetMyJobsQuery, useCompleteJobMutation } = workerApiSlice;
