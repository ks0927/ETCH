import StatsCards from "../../organisms/mypage/statsCards";
import MyDocuments from "../../organisms/mypage/myDocuments";
import RecommendedJobs from "../../organisms/mypage/recommendedJobs";
import { mockJobList } from "../../../types/mockJobListData";
import { mockCoverLetters, mockPortfolios } from "../../../types/mockDocumentsData";
import { mockStatsData } from "../../../types/mockStatsData";

const DashboardPage = () => {
  const recommendedJobs = mockJobList.slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <StatsCards stats={mockStatsData} />
      </div>
      <div>
        <MyDocuments 
          coverLetters={mockCoverLetters}
          portfolios={mockPortfolios}
        />
      </div>
      <div>
        <RecommendedJobs jobs={recommendedJobs} />
      </div>
    </div>
  );
};

export default DashboardPage;
