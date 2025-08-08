import { Link } from "react-router";
import { mockProjectData } from "../../../types/mockProjectData";
import ProjectListCard from "../../organisms/project/list/projectListCard";
import { ProjectSidebarType } from "../../../types/projectSidebarType";
import ProjectListSidebar from "../../organisms/project/list/projectListSidebar";
import ProjectListSearch from "../../organisms/project/list/projectListSearch";

function ProjectPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 전체 컨테이너 */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-8">
          {/* 사이드바 영역 - sticky 제거 */}
          <div className="w-64 flex-shrink-0 hidden lg:block">
            <ProjectListSidebar ProjectSidebarType={ProjectSidebarType} />
          </div>

          {/* 메인 콘텐츠 영역 */}
          <div className="flex-1 space-y-6">
            {/* 헤더 섹션 */}
            <section className="text-center space-y-4">
              <h1 className="text-3xl font-bold text-gray-900">
                개발자 프로젝트
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                웹 개발, 모바일 앱, AI/ML, 블록체인등 다양한 IT프로젝트를
                확인하세요. 실력있는 개발자들의 최신 프로젝트와 기술 스택을
                탐색할 수 있습니다.
              </p>
              <Link to={"/projects/write"}>
                <button className="bg-[#007DFC] hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors shadow-lg">
                  새 프로젝트 등록
                </button>
              </Link>
            </section>

            {/* 검색 섹션 */}
            <section>
              <ProjectListSearch />
            </section>

            {/* 프로젝트 카드 섹션 */}
            <section>
              <ProjectListCard mockProjects={mockProjectData} />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectPage;
