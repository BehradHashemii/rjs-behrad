import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import articlesData from "../data/mockData.json";
import Loading from "../components/Loading";

import styles from "./PortfoliosPage.module.css";
import ArticleCard from "../components/ArticleCard";
import ScrollReveal from "../components/ScrollReveal";
import e2p from "../utils/persianNumber";

const ITEMS_PER_PAGE = 9;

function ArticlesPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [isLoading, setIsLoading] = useState(true);
  const [articles, setArticles] = useState([]);

  const sortBy = searchParams.get("sortBy") || "desc";
  const tag = searchParams.get("tag") || "all";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    const timer = setTimeout(() => {
      setArticles(articlesData.articles || []);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const uniqueCategories = useMemo(() => {
    if (!Array.isArray(articles)) return [];

    return [
      ...new Set(
        articles.flatMap((article) =>
          article.tags
            ?.split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        ),
      ),
    ];
  }, [articles]);

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
    let filtered = Array.isArray(articles) ? [...articles] : [];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();

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
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();

      return sortBy === "desc" ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [articles, searchQuery, tag, sortBy]);

  const totalPages = Math.ceil(processedData.length / ITEMS_PER_PAGE);

  const paginatedData = processedData.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <main className={styles.container}>
      {/* Filters */}
      <ScrollReveal direction="up" delay={50}>
        <section className={styles.filtersSection}>
          <input
            type="text"
            placeholder="جستجو در عنوان و توضیحات مقاله..."
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
                {" "}
                {category}{" "}
              </option>
            ))}
          </select>
        </section>
      </ScrollReveal>

      <section className={styles.portfoliosGrid}>
        {paginatedData.length > 0 ? (
          paginatedData.map((article, index) => (
            <ScrollReveal key={article.id} direction="up" delay={(index % 3) * 100}>
              <ArticleCard article={article} />
            </ScrollReveal>
          ))
        ) : (
          <div className={styles.emptyState}>
            <p>مقاله‌ای با این مشخصات یافت نشد.</p>
          </div>
        )}
      </section>

      {totalPages > 1 && (
        <ScrollReveal direction="up" delay={150}>
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
        </ScrollReveal>
      )}
    </main>
  );
}

export default ArticlesPage;
