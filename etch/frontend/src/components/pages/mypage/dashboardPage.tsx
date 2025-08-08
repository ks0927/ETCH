import StatsCards from "../../organisms/mypage/statsCards";
import MyDocuments from "../../organisms/mypage/myDocuments";
import RecommendedJobs from "../../organisms/mypage/recommendedJobs";
import { mockJobList } from "../../../types/mock/mockJobListData";
import {
  mockCoverLetters,
  mockPortfolios,
} from "../../../types/mock/mockDocumentsData";
import { mockStatsData } from "../../../types/mock/mockStatsData";
import AllRecommendNews from "../../organisms/news/allRecommendNews";
import { useEffect, useState } from "react";
import { LatestNewsData } from "../../../api/newsApi";

const DashboardPage = () => {
  const [latestNewsData, setLatestNewsData] = useState([]);

  useEffect(() => {
    const loadLatestNews = async () => {
      const data = await LatestNewsData();
      setLatestNewsData(data);
    };

    loadLatestNews();
  }, []);
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
      <div>
        <AllRecommendNews newsData={latestNewsData} />
      </div>
    </div>
  );
};

export default DashboardPage;
