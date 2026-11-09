import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { articles as mockArticles } from "../data/mockData.json";
import ArticleCard from "../components/ArticleCard";
import e2p from "../utils/persianNumber";
import styles from "./ArticlesPage.module.css";
import FeaturedCard from "../components/FeaturedCard";

const ITEMS_PER_PAGE = 8;

function ArticlesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);

  const sortBy = searchParams.get("sortBy") || "desc";
  const tag = searchParams.get("tag") || "all";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const searchQuery = searchParams.get("search") || "";

  const featuredArticles = useMemo(() => {
    return mockArticles
      .filter((article) => article.isEditorPick === true)
      .slice(0, 2);
  }, []);

  const uniqueCategories = useMemo(() => {
    return [
      ...new Set(
        mockArticles.flatMap((article) =>
          article.tags
            ?.split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        ),
      ),
    ];
  }, []);

  const updateParams = (key, value) => {
    const newParams = new URLSearchParams(searchParams);

    if (value && value !== "all") {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }

    if (key !== "page") {
      newParams.set("page", "1");
    }

    setSearchParams(newParams);
  };
  const processedData = useMemo(() => {
    let filtered = [...mockArticles];
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (item) =>
          item.title?.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.tags?.toLowerCase().includes(query),
      );
    }

    if (tag !== "all") {
      filtered = filtered.filter((item) =>
        item.tags
          ?.split(",")
          .map((itemTag) => itemTag.trim())
          .includes(tag),
      );
    }
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();

      return sortBy === "desc" ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [searchQuery, tag, sortBy]);

  const totalPages = Math.ceil(processedData.length / ITEMS_PER_PAGE);

  const paginatedData = processedData.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  return (
    <main className={styles.container}>
      <section className={styles.headerSection}>
        <h1 className={styles.pageTitle}>مقالات آموزشی</h1>
        <p className={styles.pageSubtitle}>
          آموزش، دانستنی و تحلیل دنیای کامپیوتر ، برنامه‌نویسی و برق.
        </p>
      </section>

      {featuredArticles.length > 0 && (
        <section className={styles.featuredSection}>
          <div className={styles.featuredHeader}>
            <span className={styles.featuredBadge}>پیشنهاد سردبیر</span>
            <div className={styles.featuredDivider}></div>
          </div>
          <div className={styles.featuredGrid}>
            {featuredArticles.map((article) => (
              <FeaturedCard key={`featured-${article._id}`} article={article} />
            ))}
          </div>
        </section>
      )}

      <div className={styles.contentLayout}>
        <div className={styles.articlesColumn}>
          <div className={styles.topControls}>
            <div className={styles.searchWrapper}>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="جستجو در عنوان و خلاصه‌ی مقالات..."
                value={searchQuery}
                onChange={(e) => updateParams("search", e.target.value)}
              />
              <svg
                className={styles.searchIcon}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>

            <div className={styles.articlesCount}>
              <span>{e2p(processedData.length)}</span> مقاله
            </div>
          </div>

          {/* لیست مقالات */}
          <section className={styles.articlesGrid}>
            {paginatedData.length > 0 ? (
              paginatedData.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))
            ) : (
              <div className={styles.emptyState}>
                <p>مقاله‌ای با این مشخصات یافت نشد.</p>
              </div>
            )}
          </section>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.paginationButton}
                disabled={page === 1}
                onClick={() => updateParams("page", (page - 1).toString())}
              >
                قبلی
              </button>

              <span className={styles.pageInfo}>
                صفحه {e2p(page)} از {e2p(totalPages)}
              </span>

              <button
                className={styles.paginationButton}
                disabled={page === totalPages}
                onClick={() => updateParams("page", (page + 1).toString())}
              >
                بعدی
              </button>
            </div>
          )}
        </div>

        <aside className={styles.sidebarColumn}>
          <div className={styles.categoryCard}>
            <button
              className={styles.categoryHeaderBtn}
              type="button"
              onClick={() => setIsCategoryOpen((prev) => !prev)}
              aria-label="تغییر وضعیت نمایش دسته‌بندی‌ها"
            >
              <span className={styles.categoryTitle}>دسته‌بندی‌ها</span>
              <svg
                className={`${styles.categoryArrow} ${
                  isCategoryOpen ? styles.arrowOpen : ""
                }`}
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
            </button>

            {isCategoryOpen && (
              <ul className={styles.categoryList}>
                <li>
                  <button
                    className={`${styles.categoryItemBtn} ${
                      tag === "all" ? styles.activeCategory : ""
                    }`}
                    onClick={() => updateParams("tag", "all")}
                  >
                    همه مقالات
                  </button>
                </li>
                {uniqueCategories.map((cat) => (
                  <li key={cat}>
                    <button
                      className={`${styles.categoryItemBtn} ${
                        tag === cat ? styles.activeCategory : ""
                      }`}
                      onClick={() => updateParams("tag", cat)}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}

export default ArticlesPage;
