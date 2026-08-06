import { lazy, Suspense, useEffect, useState } from "react";
import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { FaSpinner } from "react-icons/fa";

// صفحات
const HomePage = lazy(() => import("../pages/HomePage"));
import PortfoliosPage from "../pages/PortfoliosPage";
import ArticlesPage from "../pages/ArticlesPage";
import ArticleDetailsPage from "../pages/ArticleDetailsPage";
import SavedPage from "../pages/SavedPage";
import ContactPage from "../pages/ContactPage";
import NotFoundPage from "../pages/NotFoundPage";
import DashboardPage from "../pages/DashboardPage";
import AdminPage from "../pages/AdminPage";

// محافظت از مسیرهای عمومی کاربران لاگین شده
function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px 0", color: "#fff" }}>
        <FaSpinner className="spinIcon" style={{ fontSize: "2rem" }} />
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/" replace />;
}
function AdminRoute() {
  const { user, loading: authLoading } = useAuth();
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    async function fetchUserRole() {
      if (user?.uid) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setRole(userDoc.data().role || "user");
          }
        } catch (error) {
          console.error("Error fetching role:", error);
        }
      }
      setRoleLoading(false);
    }

    fetchUserRole();
  }, [user]);

  if (authLoading || roleLoading) {
    return (
      <div style={{ textAlign: "center", padding: "100px 0", color: "#fff" }}>
        <FaSpinner className="spinIcon" style={{ fontSize: "2rem" }} />
      </div>
    );
  }
  return user && role === "admin" ? <Outlet /> : <Navigate to="/dashboard" replace />;
}

function Router() {
  return (
    <Suspense
      fallback={
        <div style={{ textAlign: "center", padding: "100px 0", color: "#fff" }}>
          <FaSpinner className="spinIcon" style={{ fontSize: "2rem" }} />
        </div>
      }
    >
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
    </Suspense>
  );
}

export default Router;