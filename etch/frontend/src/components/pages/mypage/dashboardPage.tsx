import StatsCards from "../../organisms/mypage/statsCards";
import MyDocuments from "../../organisms/mypage/myDocuments";
import RecommendedJobs from "../../organisms/mypage/recommendedJobs";
import AllRecommendNews from "../../organisms/news/allRecommendNews";
import { useEffect, useState } from "react";
import { LatestNewsData } from "../../../api/newsApi";
import type { News } from "../../../types/newsTypes";
import type { JobItemProps } from "../../atoms/listItem";
import { useMyDocuments } from "../../../hooks/useMyDocuments";
import { useUserStats } from "../../../hooks/useUserStats";
import type { StatsCardData } from "../../atoms/card";

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
    refetchPortfolios, // 추가: 포트폴리오 리페치 함수
  } = useMyDocuments();

  // 사용자 통계 데이터
  const { stats, isLoading: statsLoading, error: statsError } = useUserStats();

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

  const recommendedJobs: JobItemProps[] = []; // mockJobList 제거됨

  // 통계 데이터를 StatsCardData 형태로 변환
  const statsCardData: StatsCardData[] = [
    {
      title: "진행중인 지원",
      type: "stats" as const,
      value: stats.applicationCount,
      icon: "🏢",
      color: "text-blue-600",
    },
    {
      title: "관심 기업",
      type: "stats" as const,
      value: stats.favoriteCompanyCount,
      icon: "❤️",
      color: "text-green-600",
    },
    {
      title: "등록한 프로젝트",
      type: "stats" as const,
      value: stats.projectCount,
      icon: "📁",
      color: "text-purple-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* 통계 카드 섹션 */}
      <div>
        {statsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-6 bg-white rounded-lg shadow-sm animate-pulse"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gray-300 rounded"></div>
                  <div className="flex-1">
                    <div className="w-20 h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="w-8 h-6 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : statsError ? (
          <div className="p-6 text-center bg-white rounded-lg shadow-sm">
            <div className="mb-4 text-4xl text-red-500">📊</div>
            <p className="font-medium text-red-600">{statsError}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 mt-4 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600"
            >
              다시 시도
            </button>
          </div>
        ) : (
          <StatsCards stats={statsCardData} />
        )}
      </div>

      {/* 내 문서 섹션 */}
      <div>
        {isLoading ? (
          <div className="p-6 text-center bg-white rounded-lg">
            <div className="w-8 h-8 mx-auto mb-4 border-b-2 border-blue-600 rounded-full animate-spin"></div>
            <p className="text-gray-600">문서 로딩 중...</p>
          </div>
        ) : documentsError ? (
          <div className="p-6 text-center bg-white rounded-lg">
            <div className="mb-4 text-4xl text-red-500">⚠️</div>
            <p className="font-medium text-red-600">{documentsError}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 mt-4 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600"
            >
              다시 시도
            </button>
          </div>
        ) : (
          <MyDocuments
            coverLetters={coverLetters}
            portfolios={portfolios}
            refetchCoverLetters={refetchCoverLetters}
            refetchPortfolios={refetchPortfolios} // 추가: 포트폴리오 리페치 함수 전달
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
          <div className="p-6 text-center bg-white rounded-lg">
            <div className="w-8 h-8 mx-auto mb-4 border-b-2 border-green-600 rounded-full animate-spin"></div>
            <p className="text-gray-600">뉴스 로딩 중...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center bg-white rounded-lg">
            <div className="mb-4 text-4xl text-red-500">⚠️</div>
            <p className="font-medium text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 mt-4 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600"
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
