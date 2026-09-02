import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

// ایمپورت مستقیم داده‌های لوکال (مشابه مقالات)
import { portfolios as mockPortfolios } from "../data/mockData.json";
import PortfolioCard from "../components/PortfolioCard";
import e2p from "../utils/persianNumber";
import styles from "./PortfoliosPage.module.css";

const ITEMS_PER_PAGE = 9;

function PortfoliosPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const sortBy = searchParams.get("sortBy") || "desc";
  const tag = searchParams.get("tag") || "all";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const searchQuery = searchParams.get("search") || "";

  // استخراج دسته‌بندی‌های یکتا
  const uniqueCategories = useMemo(() => {
    const list = mockPortfolios || [];
    return [
      ...new Set(
        list
          .map((item) => item?.category?.trim())
          .filter(Boolean)
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
    let filtered = [...(mockPortfolios || [])];

    // ۱. فیلتر جستجو امن
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item?.title?.toLowerCase().includes(query) ||
          item?.description?.toLowerCase().includes(query) ||
          item?.category?.toLowerCase().includes(query)
      );
    }

    // ۲. فیلتر دسته‌بندی
    if (tag !== "all") {
      filtered = filtered.filter((item) => item?.category === tag);
    }

    // ۳. مرتب‌سازی بر اساس تاریخ (پشتیبانی از createdAt و date)
    filtered.sort((a, b) => {
      const rawDateA = a.createdAt || a.date;
      const rawDateB = b.createdAt || b.date;

      const dateA = rawDateA ? new Date(rawDateA).getTime() : 0;
      const dateB = rawDateB ? new Date(rawDateB).getTime() : 0;

      return sortBy === "desc" ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [searchQuery, tag, sortBy]);

  const totalPages = Math.ceil(processedData.length / ITEMS_PER_PAGE);

  const paginatedData = processedData.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <main className={styles.container}>
      {/* بخش فیلترها */}
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

      {/* گرید نمونه‌کارها */}
      <section className={styles.portfoliosGrid}>
        {paginatedData.length > 0 ? (
          paginatedData.map((item) => (
            <PortfolioCard key={item._id || item.id} portfolio={item} />
          ))
        ) : (
          <div className={`${styles.emptyState} glassBG`}>
            <p>پروژه‌ای با این مشخصات یافت نشد.</p>
          </div>
        )}
      </section>

      {/* صفحه‌بندی */}
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
            صفحه {typeof e2p === "function" ? e2p(page) : page} از{" "}
            {typeof e2p === "function" ? e2p(totalPages) : totalPages}
          </span>

          <button
            className={styles.paginationButton}
            disabled={page >= totalPages}
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