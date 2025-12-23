import { apiSlice } from '@api/apiSlice';

export interface Skill {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface SkillsResponse {
  skills: Skill[];
}

export interface UpdateSkillsRequest {
  skills: number[];
}

export interface UpdateSkillsResponse {
  message: string;
}

export const skillsApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getAllSkills: builder.query<Skill[], void>({
      query: () => '/skills',
    }),
    getUserSkills: builder.query<Skill[], void>({
      query: () => '/auth/profile',
      transformResponse: (response: { user: { skills: Skill[] } }) => response.user.skills || [],
    }),
    updateSkills: builder.mutation<UpdateSkillsResponse, UpdateSkillsRequest>({
      query: (skillsData) => ({
        url: '/skills',
        method: 'POST',
        body: skillsData,
      }),
    }),
  }),
});

export const {
  useGetAllSkillsQuery,
  useGetUserSkillsQuery,
  useUpdateSkillsMutation,
} = skillsApiSlice;
