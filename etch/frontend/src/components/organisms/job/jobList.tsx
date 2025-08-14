import JobListItem from "../../molecules/job/jobListItem";
import type { JobItemProps } from "../../atoms/listItem";
import { useLikedJobs } from "../../../hooks/useLikedItems";

interface JobListProps {
  jobs: JobItemProps[];
  onJobClick?: (jobId: string) => void;
}

export default function JobList({ jobs, onJobClick }: JobListProps) {
  const { isJobLiked, addLikedJob, removeLikedJob } = useLikedJobs();

  const handleLikeStateChange = (jobId: number, isLiked: boolean) => {
    if (isLiked) {
      addLikedJob(jobId);
    } else {
      removeLikedJob(jobId);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
      {jobs.map((job) => (
        <JobListItem
          key={job.id}
          {...job}
          onClick={onJobClick}
          isLiked={isJobLiked(Number(job.id))}
          onLikeStateChange={handleLikeStateChange}
        />
      ))}
    </div>
  );
}
