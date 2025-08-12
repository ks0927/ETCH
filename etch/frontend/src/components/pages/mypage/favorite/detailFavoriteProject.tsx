import { useState, useEffect } from "react";
import DetailProjectList from "../../../organisms/mypage/favorite/detail/detailProjectList";
import { getLikedProjects } from "../../../../api/projectApi";
import type { FavoriteProjectProps } from "../../../atoms/list";
import type { ProjectCardProps } from "../../../atoms/card";

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

function DetailFavoriteProject() {
  const [favoriteData, setFavoriteData] = useState<FavoriteProjectProps[]>([]);
  const [mockProjects, setMockProjects] = useState<ProjectCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLikedProjects = async () => {
      try {
        setLoading(true);

        // API에서 좋아요한 프로젝트 목록 가져오기
        const likedProjects: LikedProjectResponse[] = await getLikedProjects();

        // FavoriteProjectProps 형태로 변환
        const convertedFavoriteData: FavoriteProjectProps[] = likedProjects.map(
          (project) => ({
            id: project.id,
            title: project.title,
            nickname: project.nickname,
            thumbnailUrl: project.thumbnailUrl,
            type: "project" as const,
            viewCount: project.viewCount,
            likeCount: project.likeCount,
          })
        );

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
            nickname: project.nickname,
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
      } catch (error) {
        console.error("좋아요한 프로젝트 로딩 실패:", error);
        setError("좋아요한 프로젝트를 불러오는데 실패했습니다.");
        setFavoriteData([]);
        setMockProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedProjects();
  }, []);

  // 로딩 상태
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="py-6 sm:py-8 lg:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-10 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="h-64 bg-gray-200 rounded-xl"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            오류가 발생했습니다
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 페이지 컨테이너 */}
      <div className="py-6 sm:py-8 lg:py-12">
        {/* 헤더 섹션 */}
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* 페이지 타이틀 */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  관심 프로젝트
                </h1>
                <p className="text-lg text-gray-600">
                  좋아요한 프로젝트를 한눈에 확인하세요
                </p>
              </div>

              {/* 통계 정보 */}
              <div className="bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-200">
                <div className="text-sm text-gray-500">총 관심 프로젝트</div>
                <div className="text-2xl font-bold text-blue-600">
                  {favoriteData.length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 컨텐츠 영역 */}
        {favoriteData.length > 0 ? (
          <div className="bg-white border-t border-gray-200 min-h-[60vh]">
            <DetailProjectList
              favoriteData={favoriteData}
              mockProjects={mockProjects}
            />
          </div>
        ) : (
          /* 빈 상태 처리 */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                좋아요한 프로젝트가 없습니다
              </h3>
              <p className="text-gray-500 mb-6">
                관심 있는 프로젝트에 좋아요를 눌러 모아보세요
              </p>
              <button
                onClick={() => (window.location.href = "/projects")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                프로젝트 둘러보기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DetailFavoriteProject;
