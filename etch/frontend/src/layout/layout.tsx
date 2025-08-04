import { Outlet, useLocation } from "react-router";
import { useEffect, useState } from "react";
import Footer from "../components/common/footer";
import Header from "../components/common/header";
import ChatButton from "../components/molecules/chat/chatButton";
import ChatModalContainer from "../components/common/chatModalContainer";

function Layout() {
  const { pathname } = useLocation();
  const [showChatModal, setShowChatModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    }, 0);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div className="min-h-screen">
      {/* 고정 헤더 */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="px-6 py-3 mx-auto max-w-screen-2xl sm:px-8 lg:px-12 xl:px-16">
          <Header />
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="pt-16">
        {" "}
        {/* pt-20 → pt-16으로 줄임 */}
        <div className="px-6 py-2 mx-auto max-w-screen-2xl sm:px-8 lg:px-12 xl:px-16">
          {" "}
          {/* py-6 → py-2로 줄임 */}
          <main className="pt-2 pb-2">
            {" "}
            {/* pt-4 pb-4 → pt-2 pb-2로 줄임 */}
            <Outlet />
          </main>
          <ChatButton onClick={() => setShowChatModal(true)} />
          <Footer />
          {showChatModal && (
            <div className="fixed bottom-28 right-4 z-40 border border-gray-400 shadow-lg w-80 h-[500px] rounded-lg overflow-hidden bg-white">
              <ChatModalContainer onClose={() => setShowChatModal(false)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Layout;
