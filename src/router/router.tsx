import { createBrowserRouter } from "react-router";
import { lazy, Suspense } from "react";
import Layout from "../layout/layout.tsx";
import ErrorPage from "../components/common/errorPage.tsx";
import Loading from "../components/common/loadingPage.tsx";

const Main = lazy(() => import("../components/pages/testMain.tsx"));

const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading />}>
            <Main />
          </Suspense>
        ),
      },
      {
        path: "*",
        element: <ErrorPage />,
      },
    ],
  },
]);

export default router;
