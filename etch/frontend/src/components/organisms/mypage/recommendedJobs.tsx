import JobListItem from "../../molecules/job/jobListItem";
import { mockJobList } from "../../../types/mockJobListData";

const RecommendedJobs = () => {
  const recommendedJobs = mockJobList.slice(0, 3);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="border-b border-gray-200 p-6">
        <h3 className="text-lg font-semibold">추천 채용 공고</h3>
        <p className="text-sm text-gray-500">당신의 관심사와 지원 이력을 바탕으로 추천드립니다</p>
      </div>
      <div className="p-6">
        <div className="space-y-3">
          {recommendedJobs.map((job) => (
            <JobListItem
              key={job.id}
              id={job.id}
              company={job.company}
              location={job.location}
              deadline={job.deadline}
              tags={job.tags}
              onClick={(id) => console.log(`Job ${id} clicked`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecommendedJobs;