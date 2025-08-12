import { Link } from "react-router";
import { useState, useEffect } from "react";
import PlusSVG from "../../svg/plusSVG";
import MypageProjectList from "../../organisms/mypage/favorite/project/mypageProjectList";
import { getAllProjects } from "../../../api/projectApi";
import type { ProjectCardProps } from "../../atoms/card";

// API 응답 타입 (ProjectListDTO)
interface ApiProjectResponse {
  id: number;
  title: string;
  thumbnailUrl: string;
  viewCount: number;
  likeCount: number;
  nickname: string;
  isPublic: boolean;
}

function MypageProjectPage() {
  const [myProjects, setMyProjects] = useState<ProjectCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyProjects = async () => {
      try {
        setLoading(true);

        // 현재 사용자 정보 (실제로는 인증된 사용자에서 가져와야 함)
        const currentUserNickname = "test2"; // 임시

        const allProjects: ApiProjectResponse[] = await getAllProjects();

        // 현재 사용자가 작성한 프로젝트만 필터링하고 ProjectCardProps 형태로 변환
        const userProjects: ProjectCardProps[] = allProjects
          .filter(
            (project: ApiProjectResponse) =>
              project.nickname === currentUserNickname
          )
          .map((project: ApiProjectResponse) => ({
            // BaseCardProps
            type: "project" as const,

            // ProjectCardProps 필수 필드들
            id: project.id,
            title: project.title,
            content: "프로젝트 상세 내용을 확인해보세요", // API에 없으므로 기본값
            thumbnailUrl: project.thumbnailUrl,
            youtubeUrl: "", // API에 없으므로 기본값
            viewCount: project.viewCount,
            projectCategory: "" as const, // API에 없으므로 기본값
            createdAt: new Date().toISOString(), // API에 없으므로 현재 시간
            updatedAt: new Date().toISOString(), // API에 없으므로 현재 시간
            isDeleted: false, // API에 없으므로 기본값
            githubUrl: "", // API에 없으므로 기본값
            isPublic: project.isPublic,
            nickname: project.nickname,
            member: {
              id: 1, // 임시값
            },
            files: [], // API에 없으므로 빈 배열
            projectTechs: [], // API에 없으므로 빈 배열

            // UI용 추가 필드들
            likeCount: project.likeCount,
            writerImg: "", // 선택적 필드
            commentCount: 0, // 선택적 필드
            comments: [], // 선택적 필드
          }));

        setMyProjects(userProjects);
      } catch (error) {
        console.error("내 프로젝트 로딩 실패:", error);
        setError("프로젝트를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyProjects();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#007DFC] mx-auto mb-4"></div>
          <p className="text-gray-600">프로젝트를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            오류가 발생했습니다
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 섹션 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-8 bg-gradient-to-b from-[#007DFC] to-blue-600 rounded-full"></div>
                <h1 className="text-3xl font-bold text-gray-900">
                  내 프로젝트
                </h1>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
                당신의 프로젝트 지식을 다른 사람들과 공유하고{" "}
                <br className="hidden sm:block" />
                개발 커뮤니티에 기여해보세요
              </p>
              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-500">
                    총 {myProjects.length}개 프로젝트
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-500">
                    공개: {myProjects.filter((p) => p.isPublic).length}개
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="text-sm text-gray-500">
                    비공개: {myProjects.filter((p) => !p.isPublic).length}개
                  </span>
                </div>
              </div>
            </div>

            {/* CTA 버튼 */}
            <div className="flex-shrink-0">
              <Link to="/projects/write">
                <button className="group relative bg-gradient-to-r from-[#007DFC] to-blue-600 hover:from-blue-600 hover:to-[#007DFC] text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-3">
                  <PlusSVG />새 프로젝트 등록
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* 프로젝트 목록 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {myProjects.length > 0 ? (
            <div className="p-6">
              <MypageProjectList mockProjects={myProjects} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
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
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                아직 프로젝트가 없습니다
              </h3>
              <p className="text-gray-500 mb-6">
                첫 번째 프로젝트를 등록하고 다른 개발자들과 공유해보세요!
              </p>
              <Link to="/projects/write">
                <button className="group relative bg-gradient-to-r from-[#007DFC] to-blue-600 hover:from-blue-600 hover:to-[#007DFC] text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-3">
                  <PlusSVG />새 프로젝트 등록
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MypageProjectPage;
