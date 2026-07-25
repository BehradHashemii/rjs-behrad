import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
const HomePage = lazy(() => import("../pages/HomePage"));
import Portfolios from "../layout/Portfolios";
import PortfoliosPage from "../pages/PortfoliosPage";
import ArticlesPage from "../pages/ArticlesPage";
import ArticleDetailsPage from "../pages/ArticleDetailsPage";
import SavedPage from "../pages/SavedPage";
import ContactPage from "../pages/ContactPage";
import NotFoundPage from "../pages/NotFoundPage";
import DashboardPage from "../pages/DashboardPage";

function Router() {
  return (
    <Routes>
      <Route element={<HomePage />} path="/" />
      <Route element={<PortfoliosPage />} path="/portfolios" />
      <Route element={<ArticlesPage />} path="/articles" />
      <Route element={<ArticleDetailsPage />} path="/articles/:slug" />
      <Route element={<ContactPage />} path="/contact" />
      <Route element={<SavedPage />} path="/saved" />
      <Route element={<DashboardPage />} path="/dashboard" />
      <Route element={<NotFoundPage />} path="*" />
    </Routes>
  );
}

export default Router;
