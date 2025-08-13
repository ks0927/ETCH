import { Link } from "react-router";
import { useState, useEffect, useCallback, useMemo } from "react";
import ProjectListCard from "../../organisms/project/list/projectListCard";
import { ProjectSidebarType } from "../../../types/projectSidebarType";
import ProjectListSidebar from "../../organisms/project/list/projectListSidebar";
import ProjectListSearch from "../../organisms/project/list/projectListSearch";
import Pagination from "../../common/pagination";
import type { ProjectData } from "../../../types/project/projectDatas";
import { getAllProjects } from "../../../api/projectApi";
import { getCategoryFromNumber } from "../../../types/project/projectCategroyData";

// API 호출 함수 - 정렬 파라미터 제거
const fetchProjects = async (): Promise<ProjectData[]> => {
  try {
    console.log("🔄 프로젝트 조회 시작");
    const data = await getAllProjects(); // 정렬 파라미터 제거
    console.log("✅ 받아온 프로젝트:", data);
    console.log("✅ 프로젝트 개수:", data.length);
    return data;
  } catch (error) {
    console.error("❌ 프로젝트 데이터 fetch 에러:", error);
    throw error;
  }
};

function ProjectListPage() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 필터 상태 관리 - 기본값을 명시적으로 최신순으로 설정
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedSort, setSelectedSort] = useState<string>("LATEST"); // 기본값: 최신순

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  // ✅ 강제 리렌더링을 위한 상태 추가
  const [updateTrigger, setUpdateTrigger] = useState(0);

  // 컴포넌트 마운트 시 프로젝트 데이터 로드
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        // 정렬 없이 모든 데이터 로드
        const projectData = await fetchProjects();

        // ✅ 데이터를 불러온 즉시 최신순으로 정렬
        const sortedData = [...projectData].sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA; // 최신순 (내림차순)
        });

        setProjects(sortedData);
        console.log("✅ 프로젝트 로드 완료, 최신순 정렬 적용됨");
      } catch (err) {
        setError("프로젝트 데이터를 불러오는데 실패했습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []); // 의존성 배열에서 selectedSort 제거

  const handleProjectUpdate = (updatedProject: ProjectData) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === updatedProject.id ? updatedProject : project
      )
    );
  };

  // ✅ useMemo로 필터링된 프로젝트 계산 - 의존성 배열 변경 시 자동 재계산
  const filteredProjects = useMemo(() => {
    console.log("=== 필터링 및 정렬 시작 ===");
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

    // 3. ✅ 클라이언트 사이드 정렬 - 기본값을 최신순으로 명확히 처리
    filtered.sort((a, b) => {
      switch (selectedSort) {
        case "LATEST": {
          // 최신순 - createdAt 기준 내림차순 (기본값)
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          console.log("🔄 최신순 정렬 적용");
          return dateB - dateA;
        }

        case "POPULAR": {
          // 인기순 - popularityScore 기준 내림차순 (없으면 likeCount 사용)
          const popularityA = a.popularityScore || a.likeCount || 0;
          const popularityB = b.popularityScore || b.likeCount || 0;
          console.log("🔥 인기순 정렬 적용");
          return popularityB - popularityA;
        }

        case "VIEWS": {
          // 조회순 - viewCount 기준 내림차순
          const viewsA = a.viewCount || 0;
          const viewsB = b.viewCount || 0;
          console.log("👀 조회순 정렬 적용");
          return viewsB - viewsA;
        }

        case "LIKES": {
          // 좋아요순 - likeCount 기준 내림차순
          const likesA = a.likeCount || 0;
          const likesB = b.likeCount || 0;
          console.log("👍 좋아요순 정렬 적용");
          return likesB - likesA;
        }

        default: {
          // 기본값도 최신순으로 처리
          const defaultDateA = new Date(a.createdAt || 0).getTime();
          const defaultDateB = new Date(b.createdAt || 0).getTime();
          console.log("🔄 기본값 최신순 정렬 적용");
          return defaultDateB - defaultDateA;
        }
      }
    });

    console.log("=== 필터링 및 정렬 완료 ===");
    console.log("필터링된 프로젝트 수:", filtered.length);
    console.log("적용된 정렬:", selectedSort);
    return filtered;
  }, [projects, searchTerm, selectedCategory, selectedSort]); // 의존성 배열

  // 페이지네이션 계산
  const totalElements = filteredProjects.length;
  const totalPages = Math.ceil(totalElements / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjects = filteredProjects.slice(startIndex, endIndex);
  const isLast = currentPage === totalPages;

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 필터/검색 시 첫 페이지로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedSort]);

  // 검색 핸들러
  const handleSearch = useCallback((searchTermValue: string) => {
    console.log("🔍 검색 핸들러 호출:", searchTermValue);
    setSearchTerm(searchTermValue);
  }, []);

  // ✅ 카테고리 필터 핸들러 - 의존성 배열 제거하고 강제 업데이트 추가
  const handleCategoryFilter = useCallback((category: string) => {
    console.log("🎯 카테고리 필터 핸들러 호출됨:", category);
    setSelectedCategory(category);
    setUpdateTrigger((prev) => prev + 1); // 강제 리렌더링 트리거
    // 페이지를 1로 리셋
    setCurrentPage(1);
  }, []);

  // ✅ 정렬 핸들러 - 의존성 배열 제거하고 강제 업데이트 추가
  const handleSortChange = useCallback((sortType: string) => {
    console.log("📊 정렬 핸들러 호출됨:", sortType);
    setSelectedSort(sortType);
    setUpdateTrigger((prev) => prev + 1); // 강제 리렌더링 트리거
    // 페이지를 1로 리셋
    setCurrentPage(1);
  }, []);

  // ✅ 새로고침 버튼 핸들러 - 정렬도 기본값으로 리셋
  const handleRefresh = async () => {
    try {
      setLoading(true);
      const projectData = await fetchProjects();

      // ✅ 새로고침 시에도 바로 최신순으로 정렬
      const sortedData = [...projectData].sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA; // 최신순 (내림차순)
      });

      setProjects(sortedData);
      // 새로고침 시 정렬도 기본값(최신순)으로 리셋
      setSelectedSort("LATEST");
      setSelectedCategory("ALL");
      setSearchTerm("");
      setCurrentPage(1);
      setUpdateTrigger((prev) => prev + 1);
      console.log("🔄 수동 새로고침 완료 - 최신순으로 정렬됨");
    } catch (err) {
      setError("프로젝트 데이터를 불러오는데 실패했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
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
                <button
                  onClick={handleRefresh}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                  🔄 새로고침
                </button>
              </div>
            </section>

            {/* 검색 섹션 */}
            <section>
              <ProjectListSearch onSearch={handleSearch} />
            </section>

            {/* 검색 결과 정보 */}
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
                      setSelectedSort("LATEST"); // 초기화 시에도 최신순으로
                      setUpdateTrigger((prev) => prev + 1);
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    필터 초기화
                  </button>
                </div>
              </section>
            )}

            {/* 현재 상태 디버깅 정보 */}
            <section className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
              <div className="text-yellow-800">
                <strong>디버그 정보:</strong> 전체 {projects.length}개 프로젝트,
                필터링 후 {filteredProjects.length}개, 현재 정렬:{" "}
                <strong>{selectedSort}</strong>, 업데이트 카운터:{" "}
                {updateTrigger}
                {projects.length > 0 && (
                  <span>
                    , 최신 프로젝트: {projects[0]?.title} (ID: {projects[0]?.id}
                    )
                  </span>
                )}
              </div>
            </section>

            {/* 프로젝트 카드 섹션 */}
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

            {/* 페이지네이션 */}
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
