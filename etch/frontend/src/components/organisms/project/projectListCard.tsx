import { useState } from "react";
import type { mockProjectData } from "../../../types/mockProjectData.ts";
import ProcjectCard from "../../molecules/project/projectCard.tsx";

interface Props {
  mockProjects: mockProjectData[];
}

function ProjectProjectCard({ mockProjects }: Props) {
  const [visibleCount, setVisibleCount] = useState(10); // 2x5 = 10개로 변경

  const visibleProjects = mockProjects.slice(0, visibleCount);
  const hasMore = mockProjects.length > visibleCount;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 10); // 10개씩 더 보여주기
  };

  return (
    <div className="space-y-8">
      {/* 프로젝트 카드 그리드 - 2열로 변경 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {visibleProjects.map((project) => (
          <ProcjectCard key={project.id} {...project} type="project" />
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
    </div>
  );
}

export default ProjectProjectCard;
