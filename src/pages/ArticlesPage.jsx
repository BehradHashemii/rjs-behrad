import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { articles as mockArticles } from "../data/mockData.json";
import ArticleCard from "../components/ArticleCard";
import e2p from "../utils/persianNumber";
import styles from "./PortfoliosPage.module.css";

const ITEMS_PER_PAGE = 8;

function ArticlesPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const sortBy = searchParams.get("sortBy") || "desc";
  const tag = searchParams.get("tag") || "all";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const searchQuery = searchParams.get("search") || "";

  // استخراج دسته‌بندی‌های یکتا
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

  // فیلتر، جستجو و مرتب‌سازی داده‌ها
  const processedData = useMemo(() => {
    let filtered = [...mockArticles];

    // ۱. فیلتر جستجو
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (item) =>
          item.title?.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.tags?.toLowerCase().includes(query),
      );
    }

    // ۲. فیلتر تگ
    if (tag !== "all") {
      filtered = filtered.filter((item) =>
        item.tags
          ?.split(",")
          .map((itemTag) => itemTag.trim())
          .includes(tag),
      );
    }

    // ۳. مرتب‌سازی زمانی (اصلاح‌شده بر اساس createdAt)
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
      {/* Filters */}
      <section className={styles.filtersSection}>
        <input
          type="text"
          placeholder="جستجو در عنوان، محتوا و برچسب‌ها..."
          value={searchQuery}
          onChange={(e) => updateParams("search", e.target.value)}
        />

        <select
          value={sortBy}
          onChange={(e) => updateParams("sortBy", e.target.value)}
        >
          <option value="desc">جدیدترین مقالات</option>
          <option value="asc">قدیمی‌ترین مقالات</option>
        </select>

        <select
          value={tag}
          onChange={(e) => updateParams("tag", e.target.value)}
        >
          <option value="all">همه دسته‌بندی‌ها</option>
          {uniqueCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </section>

      {/* Grid */}
      <section className={styles.portfoliosGrid}>
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

      {/* Pagination */}
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
    </main>
  );
}

export default ArticlesPage;