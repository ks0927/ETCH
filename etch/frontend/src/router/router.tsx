import { createBrowserRouter } from "react-router";
import { lazy, Suspense } from "react";
import Layout from "../layout/layout.tsx";
import ErrorPage from "../components/pages/errorPage.tsx";
import LoadingPage from "../components/pages/loadingPage.tsx";
import SearchPage from "../components/pages/searchPage.tsx";

const MainPage = lazy(() => import("../components/pages/mainPage.tsx"));
const NewsPage = lazy(() => import("../components/pages/newsPage.tsx"));

const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingPage />}>
            <MainPage />
          </Suspense>
        ),
      },
      {
        path: "*",
        element: <ErrorPage />,
      },
      {
        path: "/test",
        element: <LoadingPage />,
      },
      {
        path: "/search",
        element: (
          <Suspense fallback={<LoadingPage />}>
            <SearchPage />
          </Suspense>
        ),
      },
      {
        path: "/news",
        element: (
          <Suspense fallback={<LoadingPage />}>
            <NewsPage />
          </Suspense>
        ),
      },
    ],
  },
]);

export default router;
