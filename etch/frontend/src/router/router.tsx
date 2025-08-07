import { createBrowserRouter } from "react-router";
import { lazy, Suspense } from "react";
import Layout from "../layout/layout.tsx";
import ErrorPage from "../components/pages/errorPage.tsx";
import LoadingPage from "../components/pages/loadingPage.tsx";
import SearchPage from "../components/pages/searchPage.tsx";

const HomePage = lazy(() => import("../components/pages/homePage.tsx"));
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
const JobPage = lazy(() => import("../components/pages/job/jobPage.tsx"));
const MyPageLayout = lazy(() => import("../layout/mypageLayout.tsx"));
const DashboardPage = lazy(
  () => import("../components/pages/mypage/dashboardPage.tsx")
);

const MypageProjectPage = lazy(
  () => import("../components/pages/mypage/mypageProjectPage.tsx")
);
const MypageApplicationsPage = lazy(
  () => import("../components/pages/mypage/mypageApplicationsPage.tsx")
);

const MypageFavoritePage = lazy(
  () => import("../components/pages/mypage/favorite/mypageFavoritePage.tsx")
);

const DetailFavoriteCompany = lazy(
  () => import("../components/pages/mypage/favorite/detailFavoriteCompany.tsx")
);

const MypageCoverLetterPage = lazy(
  () => import("../components/pages/mypage/mypageCoverLetterPage.tsx")
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
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: "/test",
        element: <DetailFavoriteCompany />,
      },
      {
        path: "*",
        element: <ErrorPage />,
      },
      {
        path: "/loading",
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
        path: "/projects",
        element: <ProjectListPage />,
      },
      {
        path: "/projects/write",
        element: <ProjectWritePage />,
      },
      {
        path: "/jobs",
        element: <JobPage />,
      },
      {
        path: "/mypage",
        element: (
          <Suspense fallback={<LoadingPage />}>
            <MyPageLayout />
          </Suspense>
        ),
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<LoadingPage />}>
                <DashboardPage />
              </Suspense>
            ),
          },
          {
            path: "applications",
            element: <MypageApplicationsPage />,
          },
          {
            path: "favorites",
            element: (
              <Suspense fallback={<LoadingPage />}>
                <MypageFavoritePage />
              </Suspense>
            ),
          },
          {
            path: "favorites/companies",
            element: (
              <Suspense fallback={<LoadingPage />}>
                <DetailFavoriteCompany />
              </Suspense>
            ),
          },
          {
            path: "projects",
            element: <MypageProjectPage />,
          },
          {
            path: "coverletters",
            element: <MypageCoverLetterPage />,
          },
        ],
      },
    ],
  },
]);

export default router;
