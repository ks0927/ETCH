import { Link } from "react-router";
import ProfileAvatar from "../../molecules/mypage/profileAvatar";
import StatsButton from "../../molecules/mypage/statsButton";
import ActionButton from "../../molecules/mypage/actionButton";
import type { ProfileCardData } from "../../../hooks/useUserProfile";

interface ProfileCardProps {
  userProfile: ProfileCardData;
}

const ProfileCard = ({ userProfile }: ProfileCardProps) => {
  const { nickname, profile, followersCount, followingCount } = userProfile;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="p-6">
        <div className="space-y-4 text-center">
          <ProfileAvatar
            src={profile || ""}
            alt={`${nickname}의 프로필`}
            onClick={() => console.log("프로필 편집")}
          />

          <div>
            <h3 className="text-lg font-semibold">{nickname}</h3>
          </div>

          <div className="flex justify-center space-x-6 text-sm">
            <Link to="/mypage/followers">
              <StatsButton count={followersCount} label="팔로워" />
            </Link>
            <Link to="/mypage/following">
              <StatsButton count={followingCount} label="팔로잉" />
            </Link>
          </div>

          <div className="space-y-2">
            <Link to={"/mypage/portfolios"}>
              <ActionButton
                text="포트폴리오 생성"
                bgColor="bg-blue-600"
                textColor="text-white"
                onClick={() => console.log("포트폴리오 생성")}
              />
            </Link>
            <Link to="/mypage/coverletters" className="block w-full">
              <ActionButton
                text="자기소개서 생성"
                bgColor="border border-gray-300 bg-transparent"
                textColor="text-black"
                onClick={() => console.log("자소서 생성")}
              />
            </Link>
            <ActionButton
              text="회원 탈퇴"
              bgColor="bg-red-600"
              textColor="text-white"
              onClick={() => console.log("회원 탈퇴")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
