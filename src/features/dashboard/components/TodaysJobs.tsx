import React from 'react';
import JobList from './JobList';
import { Job } from '@types';

interface TodaysJobsProps {
  jobs: Job[];
}

const TodaysJobs: React.FC<TodaysJobsProps> = ({ jobs }) => <JobList jobs={jobs} />;

export default TodaysJobs;
