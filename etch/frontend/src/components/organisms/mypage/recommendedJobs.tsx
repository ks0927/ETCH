import JobListItem from "../../molecules/job/jobListItem";
import type { JobItemProps } from "../../atoms/listItem";

interface RecommendedJobsProps {
  jobs: JobItemProps[];
}

const RecommendedJobs = ({ jobs }: RecommendedJobsProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold">추천 채용 공고</h3>
        <p className="text-sm text-gray-500">
          당신의 관심사와 지원 이력을 바탕으로 추천드립니다
        </p>
      </div>
      <div className="p-6">
        <div className="space-y-3">
          {jobs.map((job) => (
            <JobListItem
              key={job.id}
              {...job}
              onClick={(id) => console.log(`Job ${id} clicked`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecommendedJobs;
