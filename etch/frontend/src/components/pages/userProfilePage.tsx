import { useState, useEffect } from "react";
import { useParams } from "react-router";
import UserProfileCard from "../organisms/userprofile/userProfileCard";
import UserProjectList from "../organisms/userprofile/userProjectList";
import { useUserProfile } from "../../hooks/useUserProfile";
import {
  checkFollowExists,
  followUser,
  unfollowUser,
} from "../../api/followApi";
import { getAllProjects } from "../../api/projectApi";
import type { ProjectCardProps } from "../atoms/card";

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

function UserProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  // 사용자 공개 프로젝트 상태 추가
  const [userProjects, setUserProjects] = useState<ProjectCardProps[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState<string | null>(null);

  // URL에서 가져온 userId를 숫자로 변환하여 API 호출
  const targetUserId = userId ? parseInt(userId, 10) : undefined;
  const { profileData, isLoading, error } = useUserProfile(targetUserId);

  // 팔로우 상태 확인
  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!targetUserId) return;

      try {
        const followExists = await checkFollowExists(targetUserId);
        setIsFollowing(followExists);
      } catch (error) {
        console.error("팔로우 상태 확인 실패:", error);
      }
    };

    checkFollowStatus();
  }, [targetUserId]);

  // 사용자 공개 프로젝트 가져오기
  useEffect(() => {
    const fetchUserPublicProjects = async () => {
      if (!profileData?.nickname) return;

      try {
        setProjectsLoading(true);

        // 모든 프로젝트를 가져와서 해당 사용자의 공개 프로젝트만 필터링
        const allProjects: ApiProjectResponse[] = await getAllProjects();
        const projects = allProjects.filter(
          (project: ApiProjectResponse) =>
            project.nickname === profileData.nickname &&
            project.isPublic === true
        );

        // ProjectCardProps 형태로 변환
        const userPublicProjects: ProjectCardProps[] = projects.map(
          (project: ApiProjectResponse) => ({
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
              id: targetUserId || 1, // 실제 사용자 ID
            },
            files: [], // API에 없으므로 빈 배열
            projectTechs: [], // API에 없으므로 빈 배열

            // UI용 추가 필드들
            likeCount: project.likeCount,
            writerImg: "", // 선택적 필드
            commentCount: 0, // 선택적 필드
            comments: [], // 선택적 필드
          })
        );

        setUserProjects(userPublicProjects);
        setProjectsError(null);
      } catch (error) {
        console.error("사용자 공개 프로젝트 로딩 실패:", error);
        setProjectsError("프로젝트를 불러오는데 실패했습니다.");
        setUserProjects([]);
      } finally {
        setProjectsLoading(false);
      }
    };

    fetchUserPublicProjects();
  }, [profileData?.nickname, targetUserId]);

  const handleFollowClick = async () => {
    if (!targetUserId || isFollowLoading) return;

    setIsFollowLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(targetUserId);
        setIsFollowing(false);
        console.log("언팔로우 성공:", userId);
      } else {
        await followUser(targetUserId);
        setIsFollowing(true);
        console.log("팔로우 성공:", userId);
      }
    } catch (error) {
      console.error("팔로우/언팔로우 실패:", error);
    } finally {
      setIsFollowLoading(false);
    }
  };

  const handleChatClick = () => {
    console.log("채팅하기", userId);
    // 추후 채팅 모달 열기 또는 채팅방으로 이동
  };

  // 로딩 상태 처리
  if (isLoading || projectsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#007DFC] mx-auto mb-4"></div>
          <p className="text-gray-600">프로필을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태 처리
  if (error || !profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            오류가 발생했습니다
          </h2>
          <p className="text-gray-600 mb-4">
            {error || "프로필을 찾을 수 없습니다."}
          </p>
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

  // 프로젝트 로딩 에러 처리
  if (projectsError) {
    return (
      <div className="min-h-screen">
        <div className="max-w-6xl px-6 py-8 mx-auto">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* 왼쪽: 프로필 카드 */}
            <div className="lg:col-span-1">
              <UserProfileCard
                userId={profileData.id.toString()}
                nickname={profileData.nickname}
                email={profileData.email}
                profile={profileData.profile}
                followersCount={profileData.followerCount}
                followingCount={profileData.followingCount}
                isFollowing={isFollowing}
                isFollowLoading={isFollowLoading}
                onFollowClick={handleFollowClick}
                onChatClick={handleChatClick}
              />
            </div>

            {/* 오른쪽: 에러 메시지 */}
            <div className="lg:col-span-2">
              <div className="text-center py-12">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  프로젝트를 불러올 수 없습니다
                </h3>
                <p className="text-gray-600 mb-4">{projectsError}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-[#007DFC] hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
                >
                  다시 시도
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* 메인 콘텐츠 */}
      <div className="max-w-6xl px-6 py-8 mx-auto">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* 왼쪽: 프로필 카드 */}
          <div className="lg:col-span-1">
            <UserProfileCard
              userId={profileData.id.toString()}
              nickname={profileData.nickname}
              email={profileData.email}
              profile={profileData.profile}
              followersCount={profileData.followerCount}
              followingCount={profileData.followingCount}
              isFollowing={isFollowing}
              isFollowLoading={isFollowLoading}
              onFollowClick={handleFollowClick}
              onChatClick={handleChatClick}
            />
          </div>

          {/* 오른쪽: 프로젝트 리스트 */}
          <div className="lg:col-span-2">
            <UserProjectList
              projects={userProjects} // 실제 공개 프로젝트 데이터
              userName={profileData.nickname}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;
