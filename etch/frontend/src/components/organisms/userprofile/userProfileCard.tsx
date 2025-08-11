import StatsButton from "../../molecules/mypage/statsButton";
import ActionButton from "../../molecules/mypage/actionButton";

interface UserProfileCardProps {
  userId: string;
  nickname: string;
  email: string;
  profile?: string;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
  onFollowClick: () => void;
  onChatClick: () => void;
}

const UserProfileCard = ({
  nickname,
  email,
  profile,
  followersCount,
  followingCount,
  isFollowing,
  onFollowClick,
  onChatClick,
}: UserProfileCardProps) => {
  return (
    <div className="sticky bg-white border border-gray-200 rounded-lg shadow-sm top-8">
      <div className="p-6">
        <div className="space-y-4 text-center">
          {/* 프로필 이미지 (클릭 불가) */}
          <div className="flex justify-center">
            <img
              src={profile || "/src/assets/default-profile.png"}
              alt={`${nickname}의 프로필`}
              className="object-cover w-24 h-24 rounded-full"
            />
          </div>

          {/* 사용자 정보 */}
          <div>
            <h3 className="text-xl font-bold text-gray-900">{nickname}</h3>
            <p className="mt-1 text-sm text-gray-600">{email}</p>
          </div>

          {/* 통계 (클릭 불가) */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="cursor-default">
              <StatsButton count={followersCount} label="팔로워" />
            </div>
            <div className="cursor-default">
              <StatsButton count={followingCount} label="팔로잉" />
            </div>
          </div>

          {/* 액션 버튼들 */}
          <div className="space-y-3">
            <ActionButton
              text={isFollowing ? "언팔로우" : "팔로우"}
              bgColor={isFollowing ? "bg-gray-600" : "bg-blue-600"}
              textColor="text-white"
              onClick={onFollowClick}
            />
            <ActionButton
              text="💬 채팅하기"
              bgColor="border border-gray-300 bg-transparent"
              textColor="text-gray-700"
              onClick={onChatClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
