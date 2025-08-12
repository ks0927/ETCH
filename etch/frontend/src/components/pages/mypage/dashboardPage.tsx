import StatsCards from "../../organisms/mypage/statsCards";
import MyDocuments from "../../organisms/mypage/myDocuments";
import RecommendedJobs from "../../organisms/mypage/recommendedJobs";
import { mockJobList } from "../../../types/mock/mockJobListData";
import { mockStatsData } from "../../../types/mock/mockStatsData";
import AllRecommendNews from "../../organisms/news/allRecommendNews";
import { useEffect, useState } from "react";
import { LatestNewsData } from "../../../api/newsApi";
import type { News } from "../../../types/newsTypes"; // ✅ News 타입 import
import { useMyDocuments } from "../../../hooks/useMyDocuments";

const DashboardPage = () => {
  // ✅ 타입 명시
  const [latestNewsData, setLatestNewsData] = useState<News[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use the new custom hook for documents
  const {
    coverLetters,
    portfolios,
    isLoading,
    error: documentsError,
    refetchCoverLetters,
  } = useMyDocuments();

  useEffect(() => {
    const loadLatestNews = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await LatestNewsData();
        setLatestNewsData(data);
      } catch (err) {
        console.error("뉴스 로딩 실패:", err);
        setError("뉴스 데이터를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadLatestNews();
  }, []);

  const recommendedJobs = mockJobList.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* 통계 카드 섹션 */}
      <div>
        <StatsCards stats={mockStatsData} />
      </div>

      {/* 내 문서 섹션 */}
      <div>
        {isLoading ? (
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">문서 로딩 중...</p>
          </div>
        ) : documentsError ? (
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <p className="text-red-600 font-medium">{documentsError}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
            >
              다시 시도
            </button>
          </div>
        ) : (
          <MyDocuments
            coverLetters={coverLetters}
            portfolios={portfolios}
            refetchCoverLetters={refetchCoverLetters}
          />
        )}
      </div>

      {/* 추천 채용 정보 섹션 */}
      <div>
        <RecommendedJobs jobs={recommendedJobs} />
      </div>

      {/* 추천 뉴스 섹션 */}
      <div>
        {loading ? (
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">뉴스 로딩 중...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <p className="text-red-600 font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
            >
              다시 시도
            </button>
          </div>
        ) : (
          <AllRecommendNews newsData={latestNewsData} />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
