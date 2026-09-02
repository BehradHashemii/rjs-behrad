import { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import PortfolioCard from "../components/PortfolioCard";
import ArticleCard from "../components/ArticleCard";
import e2p from "../utils/persianNumber";
import { getSavedPortfolios, getLikedArticles } from "../utils/storage";

// خواندن مستقیم دیتا از فایل محلی
import { articles as mockArticles, portfolios as mockPortfolios } from "../data/mockData.json";

import {
  FaBookmark,
  FaHeart,
  FaFolderOpen,
  FaNewspaper,
  FaArrowRight,
} from "react-icons/fa";
import styles from "./PortfoliosPage.module.css";
import savedStyles from "./SavedPage.module.css";

function SavedPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "portfolios";

  // شناسه آیتم‌های ذخیره شده در localStorage
  const [savedPortfolioIds, setSavedPortfolioIds] = useState(() =>
    getSavedPortfolios() || []
  );
  const [likedArticleIds, setLikedArticleIds] = useState(() =>
    getLikedArticles() || []
  );

  // گوش دادن به تغییرات سفارشی localStorage
  useEffect(() => {
    const handlePortfolioChange = () => {
      setSavedPortfolioIds(getSavedPortfolios() || []);
    };
    const handleArticleChange = () => {
      setLikedArticleIds(getLikedArticles() || []);
    };

    window.addEventListener("portfolio-saved-change", handlePortfolioChange);
    window.addEventListener("article-liked-change", handleArticleChange);

    return () => {
      window.removeEventListener("portfolio-saved-change", handlePortfolioChange);
      window.removeEventListener("article-liked-change", handleArticleChange);
    };
  }, []);

  // فیلتر نمونه‌کارهای ذخیره‌شده (پشتیبانی از _id و id با تبدیل به رشته/عدد)
  const savedPortfolios = useMemo(() => {
    return (mockPortfolios || []).filter((p) => {
      const currentId = p._id ?? p.id;
      return savedPortfolioIds.some((id) => String(id) === String(currentId));
    });
  }, [savedPortfolioIds]);

  // فیلتر مقالات پسندیده‌شده (پشتیبانی از _id و id با تبدیل به رشته/عدد)
  const likedArticles = useMemo(() => {
    return (mockArticles || []).filter((a) => {
      const currentId = a._id ?? a.id;
      return likedArticleIds.some((id) => String(id) === String(currentId));
    });
  }, [likedArticleIds]);

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };

  return (
    <main className={styles.container}>
      <div className={savedStyles.headerBox}>
        <h1 className={savedStyles.title}>ذخیره‌ها و پسندیده‌های من</h1>
        <p className={savedStyles.subtitle}>
          تمام نمونه‌کارها و مقالاتی که به آن‌ها علاقه داشته‌اید در این بخش قابل
          دسترسی است.
        </p>

        <div className={savedStyles.tabsRow}>
          <button
            type="button"
            className={`${savedStyles.tabBtn} ${
              activeTab === "portfolios" ? savedStyles.activeTab : ""
            }`}
            onClick={() => handleTabChange("portfolios")}
          >
            <FaBookmark />
            <span>نمونه‌کارهای ذخیره‌شده ({e2p(savedPortfolios.length)})</span>
          </button>

          <button
            type="button"
            className={`${savedStyles.tabBtn} ${
              activeTab === "articles" ? savedStyles.activeTab : ""
            }`}
            onClick={() => handleTabChange("articles")}
          >
            <FaHeart
              color={activeTab === "articles" ? "#ef4444" : "currentColor"}
            />
            <span>مقالات پسندیده‌شده ({e2p(likedArticles.length)})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Portfolios */}
      {activeTab === "portfolios" && (
        <section className={styles.portfoliosGrid}>
          {savedPortfolios.length > 0 ? (
            savedPortfolios.map((portfolio) => (
              <div key={portfolio._id || portfolio.id}>
                <PortfolioCard portfolio={portfolio} />
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <FaFolderOpen className={savedStyles.emptyIcon} />
              <h3>هیچ نمونه‌کاری ذخیره نشده است</h3>
              <p>
                شما می‌توانید با کلیک روی آیکون نشان‌کردن، نمونه‌کارهای مورد
                علاقه‌تان را اینجا ذخیره کنید.
              </p>
              <Link to="/portfolios" className={savedStyles.browseBtn}>
                <FaArrowRight />
                <span>مشاهده همه نمونه‌کارها</span>
              </Link>
            </div>
          )}
        </section>
      )}

      {/* Tab 2: Articles */}
      {activeTab === "articles" && (
        <section className={styles.portfoliosGrid}>
          {likedArticles.length > 0 ? (
            likedArticles.map((article) => (
              <div key={article._id || article.id}>
                <ArticleCard article={article} />
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <FaNewspaper className={savedStyles.emptyIcon} />
              <h3>هیچ مقاله‌ای لایک نشده است</h3>
              <p>
                با کلیک روی دکمه قلب در مقالات، می‌توانید مقالات پسندیده‌شده را
                اینجا سریع پیدا کنید.
              </p>
              <Link to="/articles" className={savedStyles.browseBtn}>
                <FaArrowRight />
                <span>مشاهده همه مقالات</span>
              </Link>
            </div>
          )}
        </section>
      )}
    </main>
  );
}

export default SavedPage;