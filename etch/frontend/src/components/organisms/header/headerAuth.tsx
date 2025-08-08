import HeaderAuthButton from "../../molecules/header/headerAuthButton";
import { useNavigate } from "react-router";
import useUserStore from "../../../store/userStore";
import defaultProfile from "../../../assets/default-profile.png";

function HeaderAuth() {
  const navigate = useNavigate();
  const { isLoggedIn, memberInfo, logout } = useUserStore();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex items-center gap-2">
      {isLoggedIn && memberInfo ? (
        // 로그인 된 상태
        <>
          <HeaderAuthButton
            text="로그아웃"
            bgColor="#FFFFFF"
            textColor="#007DFC"
            onClick={handleLogout}
          />
          <button onClick={() => navigate("/mypage")} className="w-10 h-10">
            <img
              src={memberInfo.profile || defaultProfile}
              alt="유저 프로필"
              className="w-full h-full rounded-full object-cover cursor-pointer"
            />
          </button>
        </>
      ) : (
        // 로그아웃 된 상태
        <>
          <HeaderAuthButton
            text="로그인"
            bgColor="#FFFFFF"
            textColor="#007DFC"
            onClick={() => navigate("/login")}
          />
          <HeaderAuthButton
            text="회원가입"
            bgColor="#007DFC"
            textColor="#FFFFFF"
            onClick={() => navigate("/join")}
          />
        </>
      )}
    </div>
  );
}

export default HeaderAuth;
