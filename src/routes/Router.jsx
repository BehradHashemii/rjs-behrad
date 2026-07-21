import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Loading from "../components/Loading";
const HomePage = lazy(() => import("../pages/HomePage"));
const Portfolios = lazy(() => import("../layout/Portfolios"));
const PortfoliosPage = lazy(() => import("../pages/PortfoliosPage"));
const ArticlesPage = lazy(() => import("../pages/ArticlesPage"));
const ArticleDetailsPage = lazy(() => import("../pages/ArticleDetailsPage"));

function Router() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<HomePage />} path="/" />
        <Route element={<PortfoliosPage />} path="/portfolios" />
        <Route element={<ArticlesPage />} path="/articles" />
        <Route path="/articles/:slug" element={<ArticleDetailsPage />} />
      </Routes>
    </Suspense>
  );
}

export default Router;
