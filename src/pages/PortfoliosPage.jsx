import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import portfoliosData from "../data/mockData.json";
import Loading from "../components/Loading";

import styles from "./PortfoliosPage.module.css";

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
    setIsLoading(true);

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
      <section className={styles.portfoliosGrid}>
        {paginatedData.length > 0 ? (
          paginatedData.map((item) => (
            <article
              key={item.id}
              className={`${styles.portfolioCard} glassBG`}
            >
              {item.image && (
                <div className={styles.imageWrapper}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className={styles.portfolioImage}
                  />
                </div>
              )}

              <div className={styles.cardContent}>
                <span className={styles.category}>{item.category}</span>

                <h3 className={styles.title}>{item.title}</h3>

                <p className={styles.description}>{item.description}</p>

                {/* Technologies */}
                <div className={styles.technologies}>
                  {item.technologies?.map((tech, index) => (
                    <span key={index} className={styles.tech}>
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className={styles.links}>
                  {item.liveUrl && (
                    <a
                      href={item.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.liveLink}
                    >
                      مشاهده آنلاین
                    </a>
                  )}

                  {item.githubUrl && (
                    <a
                      href={item.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.githubLink}
                    >
                      سورس کد
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className={`${styles.emptyState} glassBG`}>
            <p>پروژه‌ای با این مشخصات یافت نشد.</p>
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
      )}
    </main>
  );
}

export default PortfoliosPage;
