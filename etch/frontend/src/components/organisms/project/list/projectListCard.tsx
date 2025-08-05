import { useState } from "react";
import type { mockProjectData } from "../../../../types/mockProjectData.ts";
import ProcjectCard from "../../../molecules/project/projectCard.tsx";
// import ProjectModal from "../../../organisms/project/projectModal.tsx"; // 모달 컴포넌트 (나중에 생성)

interface Props {
  mockProjects: mockProjectData[];
}

function ProjectListCard({ mockProjects }: Props) {
  const [visibleCount, setVisibleCount] = useState(10);

  // 모달 상태 관리
  const [selectedProject, setSelectedProject] =
    useState<mockProjectData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const visibleProjects = mockProjects.slice(0, visibleCount);
  const hasMore = mockProjects.length > visibleCount;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  // 카드 클릭 핸들러
  const handleCardClick = (projectId: number) => {
    const project = mockProjects.find((p) => p.id === projectId);
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

  return (
    <div className="space-y-8">
      {/* 프로젝트 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {visibleProjects.map((project) => (
          <ProcjectCard
            key={project.id}
            {...project}
            type="project"
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
            더보기 ({mockProjects.length - visibleCount}개 더 보기)
          </button>
        </div>
      )}

      {/* 모든 프로젝트를 다 보여준 경우 */}
      {!hasMore && mockProjects.length > 10 && (
        <div className="text-center text-gray-500 pt-4">
          모든 프로젝트를 확인했습니다 ({mockProjects.length}개)
        </div>
      )}

      {/* 프로젝트 모달 */}
      {isModalOpen && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedProject.title}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <img
                  src={selectedProject.img}
                  alt={selectedProject.title}
                  className="w-full h-64 object-cover rounded-lg"
                />

                <div className="text-gray-700 leading-relaxed">
                  {selectedProject.content}
                </div>

                {/* 추가 정보들을 여기에 표시할 수 있습니다 */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    프로젝트 ID: {selectedProject.id}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectListCard;
