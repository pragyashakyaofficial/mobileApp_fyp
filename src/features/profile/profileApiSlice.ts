import { apiSlice } from '@api/apiSlice';

export interface Skill {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  pivot?: {
    user_id: number;
    skill_id: number;
  };
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  fcm_token: string | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  skills: Skill[];
}

export const profileApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getProfile: builder.query<UserProfile, void>({
      query: () => {
        console.log('Calling GET /api/auth/profile');
        return '/auth/profile';
      },
      // REMOVE transformResponse entirely since API returns user directly
      // transformResponse: (response: ProfileResponse, meta, arg) => {
      //   console.log('Response from GET /api/auth/profile:', JSON.stringify(response, null, 2));
      //   return response.user; // THIS IS WRONG - response is already the user
      // },
    }),
  }),
});

export const {
  useGetProfileQuery,
} = profileApiSlice;