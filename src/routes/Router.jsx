import { lazy, Suspense } from "react";
import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

import HomePage from "../pages/HomePage";
import PortfoliosPage from "../pages/PortfoliosPage";
import ArticlesPage from "../pages/ArticlesPage";
import ArticleDetailsPage from "../pages/ArticleDetailsPage";
import SavedPage from "../pages/SavedPage";
import ContactPage from "../pages/ContactPage";
import NotFoundPage from "../pages/NotFoundPage";
import DashboardPage from "../pages/DashboardPage";
import AdminPage from "../pages/AdminPage";
import Loading from "../components/Loading";

function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <Loading />
    );
  }
  return user ? <Outlet /> : <Navigate to="/" replace />;
}

function AdminRoute() {
  const { user, loading: authLoading, isAdmin } = useAuth();

  if (authLoading) {
    return (
      <Loading />
    );
  }

  return user && isAdmin ? <Outlet /> : <Navigate to="/dashboard" replace />;
}

function Router() {
  return (
    <Routes>
      <Route element={<HomePage />} path="/" />
      <Route element={<PortfoliosPage />} path="/portfolios" />
      <Route element={<ArticlesPage />} path="/articles" />
      <Route element={<ArticleDetailsPage />} path="/articles/:slug" />
      <Route element={<ContactPage />} path="/contact" />
      <Route element={<SavedPage />} path="/saved" />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardPage />} path="/dashboard" />
      </Route>

      <Route element={<AdminRoute />}>
        <Route element={<AdminPage />} path="/admin" />
      </Route>

      <Route element={<NotFoundPage />} path="*" />
    </Routes>
  );
}

export default Router;
