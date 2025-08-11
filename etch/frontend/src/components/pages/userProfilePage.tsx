import { useState } from "react";
import { useParams } from "react-router";
import UserProfileCard from "../organisms/userprofile/userProfileCard";
import UserProjectList from "../organisms/userprofile/userProjectList";
import { useUserProfile } from "../../hooks/useUserProfile";
import { mockProjectData } from "../../types/mock/mockProjectData"; // 임시 데이터

function UserProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const [isFollowing, setIsFollowing] = useState(false);

  // URL에서 가져온 userId를 숫자로 변환하여 API 호출
  const targetUserId = userId ? parseInt(userId, 10) : undefined;
  const { profileData, isLoading, error } = useUserProfile(targetUserId);

  const handleFollowClick = () => {
    setIsFollowing(!isFollowing);
    console.log(isFollowing ? "언팔로우" : "팔로우", userId);
  };

  const handleChatClick = () => {
    console.log("채팅하기", userId);
    // 추후 채팅 모달 열기 또는 채팅방으로 이동
  };

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">프로필을 불러오는 중...</div>
      </div>
    );
  }

  // 에러 상태 처리
  if (error || !profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">
          {error || "프로필을 찾을 수 없습니다."}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
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
              onFollowClick={handleFollowClick}
              onChatClick={handleChatClick}
            />
          </div>

          {/* 오른쪽: 프로젝트 리스트 */}
          <div className="lg:col-span-2">
            <UserProjectList
              projects={mockProjectData}
              userName={profileData.nickname}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;
