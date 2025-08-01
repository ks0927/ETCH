import { Outlet, useLocation } from "react-router";
import { useEffect } from "react";
import Footer from "../components/common/footer";
import Header from "../components/common/header";

function Layout() {
  const { pathname } = useLocation();

  // 페이지 이동 시 스크롤을 맨 위로 (더 안정적인 방법)
  useEffect(() => {
    // 약간의 지연을 주어 DOM 렌더링 완료 후 스크롤
    const timer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant", // 즉시 이동
      });
    }, 0);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div className="px-4 py-6 mx-auto max-w-5xl sm:px-6 lg:px-8">
      <Header />
      <main className="pt-4 pb-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
