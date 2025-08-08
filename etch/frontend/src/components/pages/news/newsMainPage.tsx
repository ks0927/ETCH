import { useState, useEffect } from "react";
import CompanyNews from "../../organisms/news/newsListCompany";
import LatestNews from "../../organisms/news/newsListLatest";
import { mockCompany } from "../../../types/mock/mockCompanyData";
import { LatestNewsData } from "../../../api/newsApi";
import Pagenation from "../../common/pagination";

function NewsPage() {
  const [latestNewsData, setLatestNewsData] = useState([]);

  useEffect(() => {
    const loadLatestNews = async () => {
      const data = await LatestNewsData();
      setLatestNewsData(data);
    };

    loadLatestNews();
  }, []);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 섹션 */}
      <section className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              뉴스
            </h1>
          </div>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            최신 IT 뉴스와 기업 정보를 한눈에 확인하세요
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 sm:space-y-12">
        {/* 주요 기업 섹션 */}
        <section className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              주요 기업
            </h2>
          </div>
          <CompanyNews companyData={mockCompany} />
        </section>
        {/* 최신 뉴스 섹션 */}
        <section className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                최신 뉴스
              </h2>
            </div>
          </div>

          {/* 로딩/에러 상태 처리 */}
          <LatestNews newsData={latestNewsData} />
        </section>
        <Pagenation />
      </div>
    </div>
  );
}

export default NewsPage;
