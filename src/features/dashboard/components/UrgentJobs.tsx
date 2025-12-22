import React from 'react';
import JobList from './JobList';
import { Job } from '@types';

interface UrgentJobsProps {
  jobs: Job[];
}

const UrgentJobs: React.FC<UrgentJobsProps> = ({ jobs }) => <JobList jobs={jobs} />;

export default UrgentJobs;
