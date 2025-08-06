import { Link } from "react-router";
import { mockProjectData } from "../../../types/mockProjectData";
import ProjectListCard from "../../organisms/project/list/projectListCard";
import PlusSVG from "../../svg/plusSVG";

function MypageProjectPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 섹션 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-8 bg-gradient-to-b from-[#007DFC] to-blue-600 rounded-full"></div>
                <h1 className="text-3xl font-bold text-gray-900">
                  내 프로젝트
                </h1>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
                당신의 프로젝트 지식을 다른 사람들과 공유하고{" "}
                <br className="hidden sm:block" />
                개발 커뮤니티에 기여해보세요
              </p>
              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-500">
                    총 {mockProjectData.length}개 프로젝트
                  </span>
                </div>
              </div>
            </div>

            {/* CTA 버튼 */}
            <div className="flex-shrink-0">
              <Link to="/project/write">
                <button className="group relative bg-gradient-to-r from-[#007DFC] to-blue-600 hover:from-blue-600 hover:to-[#007DFC] text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-3">
                  <PlusSVG />새 프로젝트 등록
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* 프로젝트 목록 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {mockProjectData.length > 0 ? (
            <div className="p-6">
              <ProjectListCard mockProjects={mockProjectData} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-10 h-10 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                아직 프로젝트가 없습니다
              </h3>
              <p className="text-gray-500 mb-6">
                첫 번째 프로젝트를 등록하고 다른 개발자들과 공유해보세요!
              </p>
              <Link to="/project/write">
                <button className="bg-[#007DFC] hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  프로젝트 등록하기
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MypageProjectPage;
