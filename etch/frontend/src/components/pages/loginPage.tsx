import { Link, useNavigate } from "react-router";
import GoogleAuthButton from "../molecules/googleAuthButton";

function LoginPage() {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    // OAuth 로딩 페이지로 이동
    navigate("/Oauth");
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen px-4 bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white border border-gray-100 rounded-lg shadow-sm">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-2xl font-bold text-gray-900">로그인</h1>
            <p className="mb-2 text-gray-600">E:TCH에 오신 것을 환영합니다</p>
            <p className="text-sm text-gray-500">
              구글 계정으로 간편하게 로그인하세요
            </p>
          </div>

          <div className="mb-6">
            <GoogleAuthButton
              text="Google로 로그인"
              onClick={handleGoogleLogin}
            />
          </div>

          <div className="text-sm text-center text-gray-600">
            <p className="mb-4">
              아직 계정이 없으신가요?{" "}
              <Link to="/join" className="text-blue-600 hover:underline">
                회원가입
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
