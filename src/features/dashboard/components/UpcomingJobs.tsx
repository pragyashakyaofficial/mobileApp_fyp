import React from 'react';
import JobList from './JobList';
import { Job } from '@types';

interface UpcomingJobsProps {
  jobs: Job[];
}

const UpcomingJobs: React.FC<UpcomingJobsProps> = ({ jobs }) => <JobList jobs={jobs} />;

export default UpcomingJobs;
