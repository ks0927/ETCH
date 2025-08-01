import type { mockJobData } from "../../../types/mockJobData";
import JobCard from "../../molecules/home/jobCard";

interface Props {
  mockJobs: mockJobData[];
}

function MainJobCard({ mockJobs }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {mockJobs.slice(0, 3).map((job) => (
        <JobCard type="job" {...job} />
      ))}
    </div>
  );
}

export default MainJobCard;
