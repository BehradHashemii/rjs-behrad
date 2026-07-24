import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import portfoliosData from "../data/mockData.json";
import Loading from "../components/Loading";

import styles from "./PortfoliosPage.module.css";
import PortfolioCard from "../components/PortfolioCard";
import ScrollReveal from "../components/ScrollReveal";

const ITEMS_PER_PAGE = 9;

function PortfoliosPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [portfolios, setPortfolios] = useState([]);
  const sortBy = searchParams.get("sortBy") || "desc";
  const tag = searchParams.get("tag") || "all";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    const timer = setTimeout(() => {
      setPortfolios(portfoliosData.portfolios || []);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const uniqueCategories = useMemo(() => {
    if (!Array.isArray(portfolios)) return [];
    return [...new Set(portfolios.map((item) => item.category))];
  }, [portfolios]);

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
    let filtered = Array.isArray(portfolios) ? [...portfolios] : [];

    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (tag !== "all") {
      filtered = filtered.filter((item) => item.category === tag);
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortBy === "desc" ? dateB - dateA : dateA - dateB;
    });
    return filtered;
  }, [portfolios, searchQuery, tag, sortBy]);

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
      <ScrollReveal direction="up" delay={50}>
        <section className={styles.filtersSection}>
          <div className={styles.searchWrapper}>
            <input
              type="text"
              placeholder="جستجو در عنوان و توضیحات..."
              value={searchQuery}
              onChange={(e) => updateParams("search", e.target.value)}
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => updateParams("sortBy", e.target.value)}
          >
            <option value="desc">جدیدترین پروژه‌ها</option>
            <option value="asc">قدیمی‌ترین پروژه‌ها</option>
          </select>
          <select
            value={tag}
            onChange={(e) => updateParams("tag", e.target.value)}
          >
            <option value="all">همه دسته‌بندی‌ها</option>
            {uniqueCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </section>
      </ScrollReveal>

      <section className={styles.portfoliosGrid}>
        {paginatedData.length > 0 ? (
          paginatedData.map((item, index) => (
            <ScrollReveal key={item.id} direction="up" delay={(index % 3) * 100}>
              <PortfolioCard portfolio={item} />
            </ScrollReveal>
          ))
        ) : (
          <div className={`${styles.emptyState} glassBG`}>
            <p>پروژه‌ای با این مشخصات یافت نشد.</p>
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
              صفحه {page} از {totalPages}
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

export default PortfoliosPage;
