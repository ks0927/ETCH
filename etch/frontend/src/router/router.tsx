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
const JoinPage = lazy(() => import("../components/pages/join/joinPage.tsx"));
const LoginPage = lazy(() => import("../components/pages/loginPage.tsx"));
const OAuthLoadingPage = lazy(
  () => import("../components/pages/oauthLoadingPage.tsx")
);
const AdditionalInfoPage = lazy(
  () => import("../components/pages/join/additionalInfoPage.tsx")
);

const ProjectListPage = lazy(
  () => import("../components/pages/project/projectListPage.tsx")
);
const ProjectWritePage = lazy(
  () => import("../components/pages/project/projectWritePage.tsx")
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
      {
        path: "/join",
        element: (
          <Suspense fallback={<LoadingPage />}>
            <JoinPage />
          </Suspense>
        ),
      },
      {
        path: "/login",
        element: (
          <Suspense fallback={<LoadingPage />}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: "/Oauth",
        element: <OAuthLoadingPage />,
      },
      {
        path: "/additional-info",
        element: <AdditionalInfoPage />,
      },
      {
        path: "/project",
        element: <ProjectListPage />,
      },
      {
        path: "/project/write",
        element: <ProjectWritePage />,
      },
    ],
  },
]);

export default router;
