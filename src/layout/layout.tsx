import { Outlet } from "react-router";
import Footer from "../components/common/footer";
import Header from "../components/common/header";

function Layout() {
  return (
    <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <Header />
      <main className="pt-4 pb-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
