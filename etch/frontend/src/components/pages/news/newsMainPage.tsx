import { useState, useEffect } from "react";
import CompanyNews from "../../organisms/news/newsListCompany";
import LatestNews from "../../organisms/news/newsListLatest";
import { LatestNewsData, TopCompaniesData } from "../../../api/newsApi";
import type { TopCompany } from "../../../types/topCompanies";
import Pagenation from "../../common/pagination";
import BuildingSVG from "../../svg/buildingSVG";

function NewsPage() {
  const [latestNewsData, setLatestNewsData] = useState([]);
  const [topCompaniesData, setTopCompaniesData] = useState<TopCompany[]>([]);

  useEffect(() => {
    const loadNewsData = async () => {
      try {
        const [latestData, companiesData] = await Promise.all([
          LatestNewsData(),
          TopCompaniesData(),
        ]);
        setLatestNewsData(latestData);
        setTopCompaniesData(companiesData);
      } catch (error) {
        console.error("뉴스 데이터 로딩 실패:", error);
      }
    };

    loadNewsData();
  }, []);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 섹션 */}
      <section className="bg-white shadow-sm">
        <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8 sm:py-8">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-white rounded-lg">
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
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              뉴스
            </h1>
          </div>
          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            최신 IT 뉴스와 기업 정보를 한눈에 확인하세요
          </p>
        </div>
      </section>

      <div className="px-4 py-6 mx-auto space-y-8 max-w-7xl sm:px-6 lg:px-8 sm:py-8 sm:space-y-12">
        {/* 주요 기업 섹션 */}
        <section className="p-6 bg-white shadow-sm rounded-2xl sm:p-8">
          <div className="flex items-center mb-6 space-x-3">
            <div className="flex items-center justify-center w-6 h-6 bg-purple-100 rounded-full">
              <BuildingSVG className="w-4 h-4 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              인기 기업
            </h2>
          </div>
          <CompanyNews companyData={topCompaniesData} />
        </section>
        {/* 최신 뉴스 섹션 */}
        <section className="p-6 bg-white shadow-sm rounded-2xl sm:p-8">
          <div className="flex flex-col mb-6 space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
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
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
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
