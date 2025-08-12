import { useState } from "react";
import type { ProjectData } from "../../types/project/projectDatas"; // 🎯 타입 변경
import MyProjectCard from "../molecules/mypage/project/myProjectCard";
import ProjectModal from "../common/projectModal";

interface UserProjectListProps {
  projects: ProjectData[]; // 🎯 타입 변경
  userName: string;
  onProjectUpdate?: (updatedProject: ProjectData) => void; // 🎯 추가
}

function UserProjectList({
  projects,
  userName,
  onProjectUpdate,
}: UserProjectListProps) {
  const [visibleCount, setVisibleCount] = useState(8); // 다른 사용자 프로필에서는 8개만 먼저 보여주기
  const hasMore = projects.length > visibleCount;

  // 🎯 모달 상태를 ProjectData로 변경
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const visibleProjects = projects.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  // 카드 클릭 핸들러
  const handleCardClick = (projectId: number) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      setSelectedProject(project);
      setIsModalOpen(true);
    }
  };

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  // 🎯 프로젝트 업데이트 핸들러 추가
  const handleProjectUpdate = (updatedProject: ProjectData) => {
    setSelectedProject(updatedProject); // 모달 내 프로젝트 상태 업데이트
    // 부모 컴포넌트에도 알림
    onProjectUpdate?.(updatedProject);
  };

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">공개 프로젝트</h2>
        <span className="text-sm text-gray-500">총 {projects.length}개</span>
      </div>

      {/* 프로젝트가 없는 경우 */}
      {projects.length === 0 && (
        <div className="py-12 text-center bg-white border border-gray-200 rounded-lg">
          <div className="mb-2 text-lg text-gray-500">📂</div>
          <p className="text-gray-600">
            {userName}님이 공개한 프로젝트가 없습니다.
          </p>
        </div>
      )}

      {/* 프로젝트 카드 그리드 */}
      {projects.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {visibleProjects.map((project) => (
            <MyProjectCard
              key={project.id}
              {...project}
              type="project"
              onCardClick={handleCardClick}
            />
          ))}
        </div>
      )}

      {/* 더보기 버튼 */}
      {hasMore && (
        <div className="pt-4 text-center">
          <button
            onClick={handleLoadMore}
            className="px-6 py-3 font-medium text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            더 많은 프로젝트 보기
          </button>
        </div>
      )}

      {/* 모든 프로젝트를 다 보여준 경우 */}
      {!hasMore && projects.length > 8 && (
        <div className="pt-4 text-center text-gray-500">
          모든 공개 프로젝트를 확인했습니다 ({projects.length}개)
        </div>
      )}

      {/* 🎯 프로젝트 모달 - onProjectUpdate 추가 */}
      {isModalOpen && selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={handleCloseModal}
          onProjectUpdate={handleProjectUpdate} // 추가
        />
      )}
    </div>
  );
}

export default UserProjectList;
