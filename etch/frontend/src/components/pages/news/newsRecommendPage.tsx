import AllRecommendNews from "../../organisms/news/allRecommendNews";
import Pagenation from "../../common/pagination";
import { useEffect, useState } from "react";
import { fetchLatestNews } from "../../../api/newsApi";

function NewsRecommendPage() {
  const [latestNewsData, setLatestNewsData] = useState([]);

  useEffect(() => {
    const loadLatestNews = async () => {
      const data = await fetchLatestNews();
      setLatestNewsData(data);
    };

    loadLatestNews();
  }, []);
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 sm:space-y-12">
        {/* 추천 뉴스 섹션 */}
        <section className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                추천 뉴스
              </h2>
            </div>
          </div>
          <AllRecommendNews newsData={latestNewsData} />
        </section>
        <Pagenation />
      </div>
    </div>
  );
}

export default NewsRecommendPage;
