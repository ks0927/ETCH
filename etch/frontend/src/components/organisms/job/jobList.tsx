import JobListItem from "../../molecules/job/jobListItem";
import type { JobItemProps } from "../../atoms/listItem";

interface JobListProps {
  jobs: JobItemProps[];
  onJobClick?: (jobId: string) => void;
}

export default function JobList({ jobs, onJobClick }: JobListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {jobs.map(job => (
        <JobListItem
          key={job.id}
          {...job}
          onClick={onJobClick}
        />
      ))}
    </div>
  );
}