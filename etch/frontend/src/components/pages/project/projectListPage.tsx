import { Link } from "react-router";
import { useState, useEffect } from "react";
import ProjectListCard from "../../organisms/project/list/projectListCard";
import { ProjectSidebarType } from "../../../types/projectSidebarType";
import ProjectListSidebar from "../../organisms/project/list/projectListSidebar";
import ProjectListSearch from "../../organisms/project/list/projectListSearch";
import type { ProjectData } from "../../../types/project/projectDatas";
import { getAllProjects } from "../../../api/projectApi";
import { getCategoryFromNumber } from "../../../types/project/projectCategroyData"; // 헬퍼 함수 임포트

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
  const [selectedSort, setSelectedSort] = useState<string>(""); // 정렬 상태 추가

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

  // 필터링 및 정렬된 프로젝트를 계산하는 함수 (인기순 추가)
  const getFilteredProjects = (): ProjectData[] => {
    console.log("=== 필터링 시작 ===");
    console.log("전체 프로젝트 수:", projects.length);
    console.log("선택된 카테고리:", selectedCategory);
    console.log("선택된 정렬:", selectedSort); // 정렬 로그 추가

    // 첫 번째 프로젝트의 전체 구조 확인
    if (projects.length > 0) {
      console.log("첫 번째 프로젝트 전체 구조:", projects[0]);
      console.log("프로젝트 키들:", Object.keys(projects[0]));

      // 정렬 관련 필드 확인
      console.log("정렬 필드 확인:");
      console.log("- popularityScore:", projects[0].popularityScore);
      console.log("- likeCount:", projects[0].likeCount);
      console.log("- viewCount:", projects[0].viewCount);
    }

    let filtered = [...projects];

    // 0. 공개된 프로젝트만 필터링 (isPublic이 true인 것만)
    filtered = filtered.filter((project) => {
      console.log(`프로젝트 "${project.title}": isPublic=${project.isPublic}`);
      return project.isPublic; // true인 것만 통과
    });

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
        console.log(
          `프로젝트 "${project.title}": projectCategory=${
            project.projectCategory
          } (타입: ${typeof project.projectCategory})`
        );

        // projectCategory가 문자열이라면 직접 비교
        if (
          typeof project.projectCategory === "string" &&
          project.projectCategory !== ""
        ) {
          const match = project.projectCategory === selectedCategory;
          console.log(
            `  문자열 비교: "${project.projectCategory}" === "${selectedCategory}" ? ${match}`
          );
          return match;
        }

        // projectCategory가 숫자라면 변환해서 비교
        if (typeof project.projectCategory === "number") {
          const projectCategoryEnum = getCategoryFromNumber(
            project.projectCategory
          );
          const match = projectCategoryEnum === selectedCategory;
          console.log(
            `  숫자 변환 비교: ${project.projectCategory} → "${projectCategoryEnum}" === "${selectedCategory}" ? ${match}`
          );
          return match;
        }

        // 그 외의 경우 (undefined, null 등)
        console.log(`  유효하지 않은 카테고리 값: ${project.projectCategory}`);
        return false;
      });
      console.log("필터링 결과:", filtered);
      console.log("선택된 카테고리:", selectedCategory);
    }

    // 3. 정렬 적용 (인기순 추가)
    if (selectedSort) {
      console.log("정렬 적용:", selectedSort);

      filtered.sort((a, b) => {
        switch (selectedSort) {
          case "LATEST": // 최신순
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );

          case "VIEWS": // 조회순 (viewCount 높은순) - 버그 수정
            return (b.viewCount || 0) - (a.viewCount || 0); // b - a로 수정 (높은순)

          case "POPULAR": {
            // 인기순 (popularityScore 높은순)
            const aScore = a.popularityScore || 0;
            const bScore = b.popularityScore || 0;
            console.log(
              `인기도 비교: "${a.title}"(${aScore}) vs "${b.title}"(${bScore})`
            );
            return bScore - aScore; // 높은 점수가 앞으로
          }

          case "LIKES": {
            // 좋아요순 (likeCount 높은순)
            const aLikes = a.likeCount || 0;
            const bLikes = b.likeCount || 0;
            return bLikes - aLikes; // 높은 좋아요가 앞으로
          }

          default:
            return 0;
        }
      });

      // 정렬 결과 확인
      if (filtered.length > 0) {
        console.log(`${selectedSort} 정렬 결과 (상위 3개):`);
        filtered.slice(0, 3).forEach((project, index) => {
          let value = "";
          switch (selectedSort) {
            case "LATEST":
              value = project.createdAt;
              break;
            case "VIEWS":
              value = `${project.viewCount || 0}회`;
              break;
            case "POPULAR":
              value = `${project.popularityScore || 0}점`;
              break;
            case "LIKES":
              value = `${project.likeCount || 0}개`;
              break;
          }
          console.log(`${index + 1}. ${project.title}: ${value}`);
        });
      }
    }

    console.log("=== 필터링 완료 ===");
    console.log("공개된 프로젝트 수:", filtered.length);
    return filtered;
  };

  // 검색 핸들러
  const handleSearch = (searchTermValue: string) => {
    setSearchTerm(searchTermValue);
  };

  // 카테고리 필터 핸들러
  const handleCategoryFilter = (category: string) => {
    console.log("필터 선택:", category);
    setSelectedCategory(category);
  };

  // 정렬 핸들러 추가
  const handleSortChange = (sortType: string) => {
    setSelectedSort(sortType);
  };

  // 필터링된 프로젝트 가져오기
  const filteredProjects = getFilteredProjects();

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

            {/* 프로젝트 카드 섹션 */}
            <section>
              {filteredProjects.length > 0 ? (
                <ProjectListCard
                  projects={filteredProjects}
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectListPage;
