import { Link } from "react-router";
import { useState, useEffect } from "react";
import ProjectListCard from "../../organisms/project/list/projectListCard";
import { ProjectSidebarType } from "../../../types/projectSidebarType";
import ProjectListSidebar from "../../organisms/project/list/projectListSidebar";
import ProjectListSearch from "../../organisms/project/list/projectListSearch";
import Pagination from "../../common/pagination";
import type { ProjectData } from "../../../types/project/projectDatas";
import { getAllProjects } from "../../../api/projectApi";
import { getCategoryFromNumber } from "../../../types/project/projectCategroyData";

// API 호출 함수 (실제 구현)
const fetchProjects = async (): Promise<ProjectData[]> => {
  try {
    const data = await getAllProjects();
    return data;
  } catch (error) {
    console.error("프로젝트 데이터 fetch 에러:", error);
    throw error;
  }
};

function ProjectListPage() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 필터 상태 관리
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedSort, setSelectedSort] = useState<string>("");

  // 🔥 페이지네이션 상태 추가
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // 한 페이지에 6개 (2x3 그리드)

  // 컴포넌트 마운트 시 프로젝트 데이터 로드
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const projectData = await fetchProjects();
        setProjects(projectData);
      } catch (err) {
        setError("프로젝트 데이터를 불러오는데 실패했습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const handleProjectUpdate = (updatedProject: ProjectData) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === updatedProject.id ? updatedProject : project
      )
    );
  };

  // 필터링된 프로젝트를 계산하는 함수
  const getFilteredProjects = (): ProjectData[] => {
    console.log("=== 필터링 시작 ===");
    console.log("전체 프로젝트 수:", projects.length);
    console.log("선택된 카테고리:", selectedCategory);
    console.log("선택된 정렬:", selectedSort);

    let filtered = [...projects];

    // 0. 공개된 프로젝트만 필터링
    filtered = filtered.filter((project) => project.isPublic);

    // 1. 검색어 필터링
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (project) =>
          (project.title || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (project.content || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // 2. 카테고리 필터링
    if (selectedCategory && selectedCategory !== "ALL") {
      filtered = filtered.filter((project) => {
        if (
          typeof project.projectCategory === "string" &&
          project.projectCategory !== ""
        ) {
          return project.projectCategory === selectedCategory;
        }

        if (typeof project.projectCategory === "number") {
          const projectCategoryEnum = getCategoryFromNumber(
            project.projectCategory
          );
          return projectCategoryEnum === selectedCategory;
        }

        return false;
      });
    }

    // 3. 정렬 적용
    if (selectedSort) {
      filtered.sort((a, b) => {
        switch (selectedSort) {
          case "LATEST":
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          case "VIEWS":
            return (b.viewCount || 0) - (a.viewCount || 0);
          case "POPULAR":
            return (b.popularityScore || 0) - (a.popularityScore || 0);
          case "LIKES":
            return (b.likeCount || 0) - (a.likeCount || 0);
          default:
            return 0;
        }
      });
    }

    console.log("=== 필터링 완료 ===");
    console.log("필터링된 프로젝트 수:", filtered.length);
    return filtered;
  };

  // 🔥 페이지네이션 계산
  const filteredProjects = getFilteredProjects();
  const totalElements = filteredProjects.length;
  const totalPages = Math.ceil(totalElements / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjects = filteredProjects.slice(startIndex, endIndex);
  const isLast = currentPage === totalPages;

  // 🔥 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // 페이지 변경 시 스크롤을 상단으로 이동
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 🔥 필터/검색 시 첫 페이지로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedSort]);

  // 검색 핸들러
  const handleSearch = (searchTermValue: string) => {
    setSearchTerm(searchTermValue);
  };

  // 카테고리 필터 핸들러
  const handleCategoryFilter = (category: string) => {
    console.log("필터 선택:", category);
    setSelectedCategory(category);
  };

  // 정렬 핸들러
  const handleSortChange = (sortType: string) => {
    setSelectedSort(sortType);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#007DFC]"></div>
          <p className="text-gray-600">프로젝트 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-red-500 text-6xl">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900">
            오류가 발생했습니다
          </h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#007DFC] hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 전체 컨테이너 */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-8">
          {/* 사이드바 영역 */}
          <div className="w-64 flex-shrink-0 hidden lg:block">
            <ProjectListSidebar
              ProjectSidebarType={ProjectSidebarType}
              onCategoryFilter={handleCategoryFilter}
              onSortChange={handleSortChange}
            />
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
              <div className="flex items-center justify-center space-x-4">
                <Link to={"/projects/write"}>
                  <button className="bg-[#007DFC] hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors shadow-lg">
                    새 프로젝트 등록
                  </button>
                </Link>
              </div>
            </section>

            {/* 검색 섹션 */}
            <section>
              <ProjectListSearch onSearch={handleSearch} />
            </section>

            {/* 🔥 검색 결과 정보 */}
            {(searchTerm || selectedCategory !== "ALL") && (
              <section className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="text-blue-800">
                    <span className="font-medium">{totalElements}개</span>의
                    프로젝트를 찾았습니다
                    {searchTerm && (
                      <span className="ml-2">
                        (검색어: <strong>"{searchTerm}"</strong>)
                      </span>
                    )}
                    {selectedCategory !== "ALL" && (
                      <span className="ml-2">
                        (카테고리: <strong>{selectedCategory}</strong>)
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("ALL");
                      setSelectedSort("");
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    필터 초기화
                  </button>
                </div>
              </section>
            )}

            {/* 🔥 프로젝트 카드 섹션 - 2열 그리드 */}
            {/* 🔥 프로젝트 카드 섹션 */}
            <section>
              {currentProjects.length > 0 ? (
                <ProjectListCard
                  projects={currentProjects}
                  onProjectUpdate={handleProjectUpdate}
                />
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">📂</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    프로젝트가 없습니다
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm || selectedCategory !== "ALL"
                      ? "검색 조건에 맞는 프로젝트가 없습니다. 검색 조건을 변경해보세요."
                      : "등록된 프로젝트가 없습니다. 새로운 프로젝트를 등록해보세요."}
                  </p>
                </div>
              )}
            </section>

            {/* 🔥 페이지네이션 */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalElements={totalElements}
                isLast={isLast}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectListPage;
