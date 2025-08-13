import { useState, useEffect } from "react";
import { useParams } from "react-router";
import type { ProjectData } from "../../types/project/projectDatas";
import { getUserPublicProjects } from "../../api/projectApi";
import UserProfileCard from "../organisms/userprofile/userProfileCard";
import UserProjectList from "../organisms/userprofile/userProjectList";

// UserProfilePage는 props를 받지 않고, URL 파라미터만 사용
function UserProfilePage() {
  const { userId } = useParams<{ userId: string }>(); // URL에서 userId 추출

  // 상태 관리
  const [userProjects, setUserProjects] = useState<ProjectData[]>([]);
  const [userProfile, setUserProfile] = useState({
    nickname: "",
    email: "",
    profile: "",
    followersCount: 0,
    followingCount: 0,
    isFollowing: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 사용자 데이터 로딩
  useEffect(() => {
    const loadUserData = async () => {
      if (!userId) return;

      try {
        setLoading(true);

        // 🎯 실제 API 사용하여 사용자 공개 프로젝트 로딩
        const projects = await getUserPublicProjects(Number(userId));
        setUserProjects(projects);

        // 임시 프로필 데이터 (실제 사용자 프로필 API가 있다면 교체)
        const mockUserInfo = {
          nickname: projects.length > 0 ? projects[0].nickname : "사용자",
          email: "user@example.com", // 실제 API에서 가져와야 함
          profile: "", // 실제 API에서 가져와야 함
          followersCount: 10, // 실제 API에서 가져와야 함
          followingCount: 5, // 실제 API에서 가져와야 함
          isFollowing: false, // 실제 API에서 가져와야 함
        };

        setUserProfile(mockUserInfo);
      } catch (err) {
        console.error("사용자 데이터 로딩 실패:", err);
        setError("사용자 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [userId]);

  // 프로젝트 업데이트 핸들러
  const handleProjectUpdate = (updatedProject: ProjectData) => {
    setUserProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === updatedProject.id ? updatedProject : project
      )
    );
  };

  // 팔로우/언팔로우 핸들러
  const handleFollowClick = () => {
    // 팔로우/언팔로우 API 호출
    console.log("팔로우/언팔로우");
  };

  // 채팅 핸들러
  const handleChatClick = () => {
    // 채팅 기능
    console.log("채팅하기");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">사용자 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            오류가 발생했습니다
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 왼쪽: 사용자 프로필 카드 */}
          <div className="lg:col-span-1">
            <UserProfileCard
              userId={userId || ""}
              nickname={userProfile.nickname}
              email={userProfile.email}
              profile={userProfile.profile}
              followersCount={userProfile.followersCount}
              followingCount={userProfile.followingCount}
              isFollowing={userProfile.isFollowing}
              onFollowClick={handleFollowClick}
              onChatClick={handleChatClick}
            />
          </div>

          {/* 오른쪽: 사용자 프로젝트 목록 */}
          <div className="lg:col-span-3">
            <UserProjectList
              projects={userProjects}
              onProjectUpdate={handleProjectUpdate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;
