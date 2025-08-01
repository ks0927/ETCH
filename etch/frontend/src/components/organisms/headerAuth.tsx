import HeaderAuthButton from "../molecules/header/headerAuthButton";
import { useNavigate } from "react-router";

function HeaderAuth() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-2">
      <HeaderAuthButton
        text="로그인"
        color="#FFFFFF"
        textColor="#007DFC"
        onClick={() => navigate("/login")}
      />
      <HeaderAuthButton
        text="회원가입"
        color="#007DFC"
        textColor="#FFFFFF"
        onClick={() => navigate("/join")}
      />
    </div>
  );
}

export default HeaderAuth;
