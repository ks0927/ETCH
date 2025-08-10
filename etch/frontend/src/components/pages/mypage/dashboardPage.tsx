import StatsCards from "../../organisms/mypage/statsCards";
import MyDocuments from "../../organisms/mypage/myDocuments";
import RecommendedJobs from "../../organisms/mypage/recommendedJobs";
import { mockJobList } from "../../../types/mock/mockJobListData";
import { mockStatsData } from "../../../types/mock/mockStatsData";
import AllRecommendNews from "../../organisms/news/allRecommendNews";
import { useEffect, useState } from "react";
import { LatestNewsData } from "../../../api/newsApi";
import { useMyDocuments } from "../../../hooks/useMyDocuments"; // Import the new hook

const DashboardPage = () => {
  const [latestNewsData, setLatestNewsData] = useState([]);

  // Use the new custom hook for documents
  const { coverLetters, portfolios, isLoading, error, refetchCoverLetters } = useMyDocuments(); // Destructure refetchCoverLetters

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
        {isLoading ? (
          <p>문서 로딩 중...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          <MyDocuments
            coverLetters={coverLetters}
            portfolios={portfolios}
            refetchCoverLetters={refetchCoverLetters} // Pass refetchCoverLetters
          />
        )}
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