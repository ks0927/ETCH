import { useState, useEffect } from "react";
import type { FavoriteProjectProps } from "../../../atoms/list";
import FavoriteProject from "../../../molecules/mypage/favorite/favoriteProject";
import type { ProjectCardProps } from "../../../atoms/card";
import ProjectModal from "../../../common/projectModal";
import SeeMore from "../../../svg/seeMore";
import { Link } from "react-router";
import { getLikedProjects, getProjectById } from "../../../../api/projectApi";

interface Props {
  titleText: string;
  subText: string;
  sliceCount: number;
  // API에서 데이터를 가져오므로 props는 선택적으로 변경
  favoriteData?: FavoriteProjectProps[];
  mockProjects?: ProjectCardProps[];
}

// 좋아요한 프로젝트 API 응답 타입
interface LikedProjectResponse {
  id: number;
  title: string;
  nickname: string;
  content: string;
  thumbnailUrl: string;
  viewCount: number;
  likeCount: number;
  // 필요한 다른 필드들...
}

function FavoriteProjectList({
  titleText,
  subText,
  sliceCount,
  favoriteData: propFavoriteData,
  mockProjects: propMockProjects,
}: Props) {
  const [favoriteData, setFavoriteData] = useState<FavoriteProjectProps[]>([]);
  const [mockProjects, setMockProjects] = useState<ProjectCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 모달 상태 관리
  const [selectedProject, setSelectedProject] =
    useState<ProjectCardProps | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchLikedProjects = async () => {
      try {
        setLoading(true);

        // props로 데이터가 전달되면 그것을 사용, 아니면 API 호출
        if (propFavoriteData && propMockProjects) {
          setFavoriteData(propFavoriteData);
          setMockProjects(propMockProjects);
        } else {
          // API에서 좋아요한 프로젝트 목록 가져오기
          const likedProjects: LikedProjectResponse[] =
            await getLikedProjects();

          // FavoriteProjectProps 형태로 변환
          const convertedFavoriteData: FavoriteProjectProps[] =
            likedProjects.map((project) => ({
              id: project.id,
              title: project.title,
              nickname: project.nickname,
              thumbnailUrl: project.thumbnailUrl,
              type: "project" as const,
              viewCount: project.viewCount,
              likeCount: project.likeCount,
            }));

          // ProjectCardProps 형태로 변환 (모달용)
          const convertedMockProjects: ProjectCardProps[] = likedProjects.map(
            (project) => ({
              type: "project" as const,
              id: project.id,
              title: project.title,
              content: project.content || "좋아요한 프로젝트입니다",
              thumbnailUrl: project.thumbnailUrl,
              youtubeUrl: "",
              viewCount: project.viewCount,
              projectCategory: "" as const,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              isDeleted: false,
              githubUrl: "",
              isPublic: true,
              nickname: "",
              member: { id: 1 },
              files: [],
              projectTechs: [],
              likeCount: project.likeCount,
              writerImg: "",
              commentCount: 0,
              comments: [],
            })
          );

          setFavoriteData(convertedFavoriteData);
          setMockProjects(convertedMockProjects);
        }
      } catch (error) {
        console.error("좋아요한 프로젝트 로딩 실패:", error);
        setError("좋아요한 프로젝트를 불러오는데 실패했습니다.");
        // 에러 시 빈 배열로 설정
        setFavoriteData([]);
        setMockProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedProjects();
  }, [propFavoriteData, propMockProjects]);

  // 카드 클릭 핸들러
  const handleCardClick = async (projectId: number) => {
    try {
      // 상세 정보를 API에서 가져오기
      const detailProject = await getProjectById(projectId);
      setSelectedProject(detailProject);
      setIsModalOpen(true);
    } catch (error) {
      console.error("프로젝트 상세 정보 로딩 실패:", error);
      // 실패 시 기존 데이터로 모달 열기
      const project = mockProjects.find((p) => p.id === projectId);
      if (project) {
        setSelectedProject(project);
        setIsModalOpen(true);
      }
    }
  };

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(sliceCount)].map((_, index) => (
              <div key={index} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

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

      {/* Error State */}
      {error && (
        <div className="text-center py-4">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      {/* List Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {favoriteData.length > 0 ? (
          favoriteData
            .slice(0, sliceCount)
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
              <span className="text-4xl">💝</span>
            </div>
            <p className="text-gray-500 text-base font-medium mb-2">
              좋아요한 프로젝트가 없습니다
            </p>
            <p className="text-gray-400 text-sm mb-4">
              관심있는 프로젝트에 좋아요를 눌러보세요
            </p>
            <Link to="/projects">
              <button className="bg-[#007DFC] hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm">
                프로젝트 둘러보기
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* 프로젝트 모달 */}
      {isModalOpen && selectedProject && (
        <ProjectModal project={selectedProject} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default FavoriteProjectList;
