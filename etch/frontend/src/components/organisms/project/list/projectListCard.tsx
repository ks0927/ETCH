import { useState } from "react";
import ProcjectCard from "../../../molecules/project/projectCard.tsx";
import ProjectModal from "../../../common/projectModal.tsx";
import type { ProjectData } from "../../../../types/project/projectDatas";
import { getProjectById } from "../../../../api/projectApi.tsx";

interface Props {
  projects: ProjectData[];
}

function ProjectListCard({ projects }: Props) {
  const [visibleCount, setVisibleCount] = useState(10);

  // ❌ 삭제된 부분: 강제 역순 정렬 제거
  // const sortedProjects = [...projects].reverse();

  // ✅ 수정된 부분: 부모에서 이미 정렬된 projects를 그대로 사용
  const sortedProjects = projects; // 부모 컴포넌트에서 이미 정렬된 상태로 전달받음

  const hasMore = sortedProjects.length > visibleCount;

  // 모달 상태 관리
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const visibleProjects = sortedProjects.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  // 카드 클릭 핸들러
  const handleCardClick = async (projectId: number) => {
    try {
      // 상세 데이터를 별도로 호출
      const detailProject = await getProjectById(projectId);
      setSelectedProject(detailProject);
      setIsModalOpen(true);
    } catch (error) {
      console.error("상세 정보 로딩 실패:", error);
    }
  };

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <div className="space-y-8">
      {/* 프로젝트가 없는 경우 */}
      {projects.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📂</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            조건에 맞는 프로젝트가 없습니다
          </h3>
          <p className="text-gray-600">다른 검색 조건을 시도해보세요.</p>
        </div>
      ) : (
        <>
          {/* 프로젝트 카드 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {visibleProjects.map((project) => (
              <ProcjectCard
                key={project.id}
                type="project"
                id={project.id}
                title={project.title}
                nickname={project.nickname}
                viewCount={project.viewCount}
                likeCount={project.likeCount}
                thumbnailUrl={project.thumbnailUrl}
                onCardClick={handleCardClick}
              />
            ))}
          </div>

          {/* 더보기 버튼 */}
          {hasMore && (
            <div className="flex justify-center pt-4">
              <button
                onClick={handleLoadMore}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold transition-colors border border-gray-300"
              >
                더보기 ({sortedProjects.length - visibleCount}개 더 보기)
              </button>
            </div>
          )}

          {/* 모든 프로젝트를 다 보여준 경우 */}
          {!hasMore && projects.length > 10 && (
            <div className="text-center text-gray-500 pt-4">
              모든 프로젝트를 확인했습니다 ({projects.length}개)
            </div>
          )}
        </>
      )}

      {/* 프로젝트 모달 */}
      {isModalOpen && selectedProject && (
        <ProjectModal project={selectedProject} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default ProjectListCard;
