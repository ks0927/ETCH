import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import useUserStore from "../../store/userStore";

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
  showMessage?: boolean;
}

export const ProtectedRoute = ({
  children,
  redirectTo = "/login",
  showMessage = false,
}: ProtectedRouteProps) => {
  const { isLoggedIn } = useUserStore();
  const location = useLocation();

  if (!isLoggedIn) {
    if (showMessage) {
      // 선택적으로 알림 표시
      console.log("로그인이 필요한 페이지입니다:", location.pathname);
      alert("로그인이 필요한 페이지입니다. 로그인 후 다시 시도해주세요.");
    }

    // 현재 경로를 state에 저장해서 로그인 후 돌아올 수 있게 함
    return (
      <Navigate to={redirectTo} state={{ from: location.pathname }} replace />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
