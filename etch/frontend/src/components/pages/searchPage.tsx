import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { searchApi } from "../../api/searchApi";
import type { SearchResponse } from "../../types/search.ts";

function SearchPage() {
  const [searchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<
    "all" | "jobs" | "news" | "projects"
  >("all");
  const [searchInput, setSearchInput] = useState("");

  const query = searchParams.get("q") || "";

  // URL의 query가 변경되면 input도 동기화
  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  useEffect(() => {
    if (query.trim()) {
      handleSearch(query);
    }
  }, [query]);

  const handleSearch = async (searchQuery: string) => {
    const results = await searchApi({ query: searchQuery });
    console.log("검색 결과:", results);
    console.log(searchResults);
    setSearchResults(results);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      // URL을 업데이트하여 검색 실행
      window.location.href = `/search?q=${encodeURIComponent(
        searchInput.trim()
      )}`;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearchSubmit(e as any);
    }
  };

  const tabs = [
    { id: "all", label: "전체", count: 12 },
    { id: "jobs", label: "채용", count: 5 },
    { id: "news", label: "뉴스", count: 4 },
    { id: "projects", label: "프로젝트", count: 3 },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 헤더 */}
      <div className="bg-white">
        <div className="px-6 py-6 mx-auto text-center max-w-7xl">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">통합 검색</h1>
          <p className="text-gray-600">'{query}'에 대한 검색 결과입니다</p>
        </div>
      </div>

      {/* 검색바*/}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4 mx-auto max-w-7xl">
          <div className="flex justify-center">
            {/* 검색바 */}
            <div className="w-full max-w-2xl">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="검색어를 입력하세요"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="absolute text-gray-500 transform -translate-y-1/2 right-3 top-1/2 hover:text-blue-600"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 mx-auto max-w-7xl">
          <div className="flex space-x-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="px-6 py-8 mx-auto max-w-7xl">
        {activeTab === "all" && (
          <div className="space-y-12">
            {/* 채용 섹션 */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  채용 (5)
                </h2>
                <button
                  className="text-blue-600 hover:text-blue-700"
                  onClick={() => setActiveTab("jobs")}
                >
                  더보기
                </button>
              </div>
              <div className="p-6 bg-white border-gray-200 rounded-lg shadow-sm">
                {/* 추후 JobList organism이 들어갈 자리 */}
                <div className="space-y-4">
                  <div className="flex items-center justify-center h-24 bg-gray-100 rounded">
                    채용 리스트가 들어갈 자리
                  </div>
                  <div className="flex items-center justify-center h-24 bg-gray-100 rounded">
                    채용 리스트가 들어갈 자리
                  </div>
                </div>
              </div>
            </section>

            {/* 뉴스 섹션 */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  뉴스 (4)
                </h2>
                <button
                  className="text-blue-600 hover:text-blue-700"
                  onClick={() => setActiveTab("news")}
                >
                  더보기
                </button>
              </div>
              <div className="p-6 bg-white border-gray-200 rounded-lg shadow-sm">
                {/* 추후 NewsList organism이 들어갈 자리 */}
                <div className="space-y-4">
                  <div className="flex items-center justify-center h-24 bg-gray-100 rounded">
                    뉴스 리스트가 들어갈 자리
                  </div>
                  <div className="flex items-center justify-center h-24 bg-gray-100 rounded">
                    뉴스 리스트가 들어갈 자리
                  </div>
                </div>
              </div>
            </section>

            {/* 프로젝트 섹션 */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  프로젝트 (3)
                </h2>
                <button
                  className="text-blue-600 hover:text-blue-700"
                  onClick={() => setActiveTab("projects")}
                >
                  더보기
                </button>
              </div>
              <div className="p-6 bg-white border-gray-200 rounded-lg shadow-sm">
                {/* 추후 ProjectList organism이 들어갈 자리 */}
                <div className="space-y-4">
                  <div className="flex items-center justify-center h-24 bg-gray-100 rounded">
                    프로젝트 리스트가 들어갈 자리
                  </div>
                  <div className="flex items-center justify-center h-24 bg-gray-100 rounded">
                    프로젝트 리스트가 들어갈 자리
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* 개별 탭 콘텐츠 */}
        {activeTab === "jobs" && (
          <div className="p-6 bg-white border rounded-lg shadow-sm">
            <div className="flex items-center justify-center bg-gray-100 rounded h-96">
              채용 전용 리스트가 들어갈 자리
            </div>
          </div>
        )}

        {activeTab === "news" && (
          <div className="p-6 bg-white border rounded-lg shadow-sm">
            <div className="flex items-center justify-center bg-gray-100 rounded h-96">
              뉴스 전용 리스트가 들어갈 자리
            </div>
          </div>
        )}

        {activeTab === "projects" && (
          <div className="p-6 bg-white border rounded-lg shadow-sm">
            <div className="flex items-center justify-center bg-gray-100 rounded h-96">
              프로젝트 전용 리스트가 들어갈 자리
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
