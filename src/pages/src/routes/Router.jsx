import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Loading from "../components/Loading";

const HomePage = lazy(() => import("../pages/HomePage"));
const PortfoliosPage = lazy(() => import("../pages/PortfoliosPage"));
const ArticlesPage = lazy(() => import("../pages/ArticlesPage"));
const ArticleDetailsPage = lazy(() => import("../pages/ArticleDetailsPage"));
const ContactPage = lazy(() => import("../pages/ContactPage"));
const SavedPage = lazy(() => import("../pages/SavedPage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

function Router() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<HomePage />} path="/" />
        <Route element={<PortfoliosPage />} path="/portfolios" />
        <Route element={<ArticlesPage />} path="/articles" />
        <Route path="/articles/:slug" element={<ArticleDetailsPage />} />
        <Route element={<ContactPage />} path="/contact-us" />
        <Route element={<ContactPage />} path="/contact" />
        <Route element={<SavedPage />} path="/saved" />
        <Route element={<SavedPage />} path="/favorites" />
        <Route element={<SavedPage />} path="/cart" />
        <Route element={<NotFoundPage />} path="*" />
      </Routes>
    </Suspense>
  );
}

export default Router;
