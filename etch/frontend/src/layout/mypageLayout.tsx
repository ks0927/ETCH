import { Outlet } from "react-router";
import NavMenu from "../components/organisms/mypage/navMenu";
import ProfileCard from "../components/organisms/mypage/profileCard";
import { mockUserProfile } from "../types/mockUserProfileData";

const MyPageLayout = () => {
  return (
    // Layout의 main 안에 들어갈 내용
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* 왼쪽 사이드바 */}
      <div className="lg:col-span-1 space-y-4">
        <ProfileCard userProfile={mockUserProfile} />
        <NavMenu />
      </div>

      {/* 오른쪽 메인 콘텐츠 영역 */}
      <div className="lg:col-span-3">
        <Outlet />
      </div>
    </div>
  );
};

export default MyPageLayout;
