import { apiSlice } from '@api/apiSlice';

export interface Skill {
  id: number;
  name: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  contact?: string;
  position?: string;
  branch?: string;
  joineddate?: string;
  skills: Skill[];
}

export interface ProfileResponse {
  user: UserProfile;
}

export const profileApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getProfile: builder.query<UserProfile, void>({
      query: () => {
        console.log('Calling GET /api/auth/profile');
        return '/auth/profile';
      },
      transformResponse: (response: ProfileResponse, meta, arg) => {
        console.log('Response from GET /api/auth/profile:', JSON.stringify(response, null, 2));
        return response.user;
      },
    }),
  }),
});

export const {
  useGetProfileQuery,
} = profileApiSlice;
