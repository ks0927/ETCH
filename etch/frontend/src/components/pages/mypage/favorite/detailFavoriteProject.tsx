import { mockFavoriteProjectsData } from "../../../../types/mockFavoriteProjectData";
import { mockProjectData2 } from "../../../../types/mockProjectData2";
import DetailProjectList from "../../../organisms/mypage/favorite/detail/detailProjectList";

function DetailFavoriteProject() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 페이지 컨테이너 */}
      <div className="py-6 sm:py-8 lg:py-12">
        {/* 헤더 섹션 */}
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* 페이지 타이틀 */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  관심 프로젝트
                </h1>
                <p className="text-lg text-gray-600">
                  팔로우한 프로젝트를 한눈에 확인하세요
                </p>
              </div>

              {/* 통계 정보 */}
              <div className="bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-200">
                <div className="text-sm text-gray-500">총 관심 프로젝트</div>
                <div className="text-2xl font-bold text-blue-600">
                  {mockFavoriteProjectsData.length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 컨텐츠 영역 */}
        <div className="bg-white border-t border-gray-200 min-h-[60vh]">
          <DetailProjectList
            favoriteData={mockFavoriteProjectsData}
            mockProjects={mockProjectData2}
          />
        </div>
      </div>

      {/* 빈 상태 처리 */}
      {mockFavoriteProjectsData.length === 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              관심 기업이 없습니다
            </h3>
            <p className="text-gray-500 mb-6">
              관심 있는 기업을 팔로우하여 최신 프로젝트를 확인해보세요
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              기업 둘러보기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DetailFavoriteProject;
