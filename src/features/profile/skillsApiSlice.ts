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

export interface UserProfileResponse {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  // ... other fields ...
  skills: Skill[];
}

export const skillsApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getAllSkills: builder.query<Skill[], void>({
      query: () => {
        console.log('Calling GET /api/skills');
        return '/skills';
      },
      transformResponse: (response: Skill[], meta, arg) => {
        console.log('Response from GET /api/skills:', JSON.stringify(response, null, 2));
        return response;
      },
    }),
    // getUserSkills: builder.query<Skill[], void>({
    //   query: () => {
    //     console.log('Calling GET /api/auth/profile for user skills');
    //     return '/auth/profile';
    //   },
    //   transformResponse: (response: UserProfileResponse, meta, arg) => {
    //     console.log('Response from GET /api/auth/profile for user skills:', JSON.stringify(response, null, 2));
    //     // The response IS the user object, and skills are a property of it
    //     return response.skills || [];
    //   },
    // }),

getUserSkills: builder.query<Skill[], void>({
  query: () => {
    console.log('DEBUG - Calling GET /api/auth/profile for user skills');
    return '/auth/profile';
  },
  transformResponse: (response: any, meta, arg) => {
    console.log('DEBUG - Raw response from /auth/profile:', response);
    console.log('DEBUG - Skills from response:', response?.skills);
    // Handle both with and without pivot
    const skills = response?.skills || [];
    return skills.map(skill => ({
      id: skill.id,
      name: skill.name,
      description: skill.description || '',
      created_at: skill.created_at,
      updated_at: skill.updated_at,
      pivot: skill.pivot
    }));
  },
}),
    updateSkills: builder.mutation<UpdateSkillsResponse, UpdateSkillsRequest>({
      query: (skillsData) => {
        console.log('Calling POST /api/skills with payload:', JSON.stringify(skillsData, null, 2));
        return {
          url: '/skills',
          method: 'POST',
          body: skillsData,
        };
      },
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log('Response from POST /api/skills:', JSON.stringify(data, null, 2));
        } catch (err) {
          console.error('Error in POST /api/skills:', err);
        }
      },
    }),
  }),
});

export const {
  useGetAllSkillsQuery,
  useGetUserSkillsQuery,
  useUpdateSkillsMutation,
} = skillsApiSlice;