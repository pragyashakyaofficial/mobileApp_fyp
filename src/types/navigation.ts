export type RootStackParamList = {
  Main: undefined;
  JobDetails: { jobId: string };
  JobCompletion: { jobId: string };
  Login: undefined;
  Register: undefined;
  Profile: undefined;
  JobList: { filter?: 'Pending' | 'Completed' };
  AddSkills: undefined;
};
