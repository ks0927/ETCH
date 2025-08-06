import { useState } from "react";
import type { FavoriteProjectProps } from "../../atoms/list";
import FavoriteProject from "../../molecules/mypage/favoriteProject";
import type { ProjectCardProps } from "../../atoms/card";
import ProjectModal from "../../common/projectModal";
import SeeMore from "../../svg/seeMore";
import { Link } from "react-router";

interface Props {
  titleText: string;
  subText: string;
  favoriteData: FavoriteProjectProps[];
  mockProjects: ProjectCardProps[];
}

function FavoriteProjectList({
  titleText,
  subText,
  favoriteData,
  mockProjects,
}: Props) {
  // 모달 상태 관리
  const [selectedProject, setSelectedProject] =
    useState<ProjectCardProps | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    <div className="bg-white rounded-xl space-y-3 shadow-sm border border-gray-100 p-6 h-fit">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">
            {titleText} ({favoriteData.length})
          </h1>
          <p className="text-sm text-gray-500">{subText}</p>
        </div>
        <div className="flex items-center h-full">
          <Link to={"/mypage/favorites/projects"}>
            <SeeMore />
          </Link>
        </div>
      </div>

      {/* List Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {favoriteData.length > 0 ? (
          favoriteData
            .slice(0, 4)
            .map((data) => (
              <FavoriteProject
                key={data.id}
                {...data}
                onCardClick={handleCardClick}
              />
            ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
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
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
            </div>
            <p className="text-gray-500 text-base font-medium mb-2">
              관심 프로젝트가 없습니다
            </p>
            <p className="text-gray-400 text-sm">
              관심있는 프로젝트에 좋아요를 눌러보세요
            </p>
          </div>
        )}
      </div>

      {/* 프로젝트 모달 - 원래 있던 그대로 유지 */}
      {isModalOpen && selectedProject && (
        <ProjectModal project={selectedProject} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default FavoriteProjectList;
