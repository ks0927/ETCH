import { createBrowserRouter } from "react-router";
import { lazy, Suspense } from "react";
import Layout from "../layout/layout.tsx";
import ErrorPage from "../components/pages/errorPage.tsx";
import LoadingPage from "../components/pages/loadingPage.tsx";
import SearchPage from "../components/pages/searchPage.tsx";

const MainPage = lazy(() => import("../components/pages/homePage.tsx"));
const NewsPage = lazy(
  () => import("../components/pages/news/newsMainPage.tsx")
);
const NewsLatestPage = lazy(
  () => import("../components/pages/news/newsLatestPage.tsx")
);
const NewsRecommendPage = lazy(
  () => import("../components/pages/news/newsRecommendPage.tsx")
);
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
      {
        path: "/news/latest",
        element: (
          <Suspense fallback={<LoadingPage />}>
            <NewsLatestPage />
          </Suspense>
        ),
      },
      {
        path: "/news/recommend",
        element: (
          <Suspense fallback={<LoadingPage />}>
            <NewsRecommendPage />
          </Suspense>
        ),
      },
    ],
  },
]);

export default router;
