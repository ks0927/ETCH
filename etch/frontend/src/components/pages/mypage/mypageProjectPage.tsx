import { Link } from "react-router";
import { useState, useEffect } from "react";
import PlusSVG from "../../svg/plusSVG";
import MypageProjectList from "../../organisms/mypage/favorite/project/mypageProjectList";
import { getAllProjects } from "../../../api/projectApi";
import type { ProjectData } from "../../../types/project/projectDatas";
import type { ProjectCategoryEnum } from "../../../types/project/projectCategroyData";

// getAllProjects API 응답 타입
interface ApiProjectResponse {
  id: number;
  title: string;
  content?: string;
  thumbnailUrl: string;
  youtubeUrl?: string;
  viewCount: number;
  likeCount: number;
  nickname: string;
  isPublic: boolean;
  likedByMe?: boolean;
  projectCategory?: string;
  createdAt?: string;
  updatedAt?: string;
  githubUrl?: string;
  authorId?: number; // 백엔드에서 제공하면 이걸 사용
}

function MypageProjectPage() {
  const [myProjects, setMyProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // JWT 토큰에서 사용자 ID 가져오는 함수
  const getCurrentUserId = (): number => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return 1; // 기본값

      const base64Payload = token.split(".")[1];
      const payload = JSON.parse(atob(base64Payload));
      return payload.id || 1;
    } catch (error) {
      console.error("JWT 토큰 디코딩 실패:", error);
      return 1; // 기본값
    }
  };

  useEffect(() => {
    const fetchMyProjects = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("🔍 내 프로젝트 로딩 시작...");

        const currentUserId = getCurrentUserId();
        console.log("👤 현재 사용자 ID:", currentUserId);

        // getAllProjects 사용 (getMyProjects가 500 에러이므로)
        console.log("📡 getAllProjects API 호출 중...");
        const allProjects: ApiProjectResponse[] = await getAllProjects();

        console.log("✅ getAllProjects API 응답:", allProjects);
        console.log("📊 전체 프로젝트 개수:", allProjects.length);

        // 현재 사용자가 작성한 프로젝트만 필터링
        const myProjectsFiltered = allProjects.filter(
          (project: ApiProjectResponse) => {
            console.log(`🔍 프로젝트 ${project.id} 체크:`, {
              projectTitle: project.title,
              projectNickname: project.nickname,
              projectAuthorId: project.authorId,
              currentUserId: currentUserId,
            });

            // 1. authorId가 있으면 그걸로 비교 (가장 정확)
            if (project.authorId) {
              const isMyProject = project.authorId === currentUserId;
              console.log(
                `📋 authorId로 비교: ${project.authorId} === ${currentUserId} = ${isMyProject}`
              );
              return isMyProject;
            }

            // 2. authorId가 없으면 닉네임으로 비교 (임시)
            try {
              const token = localStorage.getItem("access_token");
              if (token) {
                const payload = JSON.parse(atob(token.split(".")[1]));
                const currentNickname = payload.nickname || "testSH";
                const isMyProject = project.nickname === currentNickname;
                console.log(
                  `📋 닉네임으로 비교: ${project.nickname} === ${currentNickname} = ${isMyProject}`
                );
                return isMyProject;
              }
            } catch (e) {
              console.error("닉네임 비교 실패:", e);
            }

            return false;
          }
        );

        console.log("🔍 필터링 결과 - 내 프로젝트:", myProjectsFiltered);
        console.log("📊 내 프로젝트 개수:", myProjectsFiltered.length);

        // ProjectData 형태로 변환
        const userProjects: ProjectData[] = myProjectsFiltered.map(
          (project: ApiProjectResponse): ProjectData => ({
            id: project.id,
            title: project.title,
            content: project.content || "프로젝트 상세 내용을 확인해보세요",
            thumbnailUrl: project.thumbnailUrl,
            youtubeUrl: project.youtubeUrl || "",
            viewCount: project.viewCount,
            projectCategory:
              (project.projectCategory as ProjectCategoryEnum) || "",
            createdAt: project.createdAt || new Date().toISOString(),
            updatedAt: project.updatedAt || new Date().toISOString(),
            isDeleted: false,
            githubUrl: project.githubUrl || "",
            isPublic: project.isPublic,
            likeCount: project.likeCount,
            likedByMe: project.likedByMe ?? false,
            nickname: project.nickname,
            commentCount: 0,
            popularityScore: 0,
            member: {
              id: currentUserId,
              nickname: project.nickname,
            },
            files: [],
            projectTechs: [],
          })
        );

        console.log("🔄 최종 변환된 데이터:", userProjects);
        setMyProjects(userProjects);
      } catch (error) {
        console.error("❌ 프로젝트 로딩 실패:", error);

        // 로그인이 필요한 경우
        if (error instanceof Error && error.message.includes("로그인")) {
          setError("로그인이 필요합니다. 로그인 후 다시 시도해주세요.");
        } else {
          setError("프로젝트를 불러오는데 실패했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMyProjects();
  }, []);

  // 프로젝트 업데이트 핸들러
  const handleProjectUpdate = (updatedProject: ProjectData) => {
    setMyProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === updatedProject.id ? updatedProject : project
      )
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#007DFC] mx-auto mb-4"></div>
          <p className="text-gray-600">내 프로젝트를 불러오는 중...</p>
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
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-[#007DFC] hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              다시 시도
            </button>
            {error.includes("로그인") && (
              <Link to="/login">
                <button className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg">
                  로그인하기
                </button>
              </Link>
            )}
          </div>
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
              <MypageProjectList
                mockProjects={myProjects}
                onProjectUpdate={handleProjectUpdate}
              />
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
