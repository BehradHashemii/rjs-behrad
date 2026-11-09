import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import promptsData from "../data/prompts.json";
import PromptCard from "../components/PromptCard";
import e2p from "../utils/persianNumber";
import styles from "./PromptsPage.module.css";

const ITEMS_PER_PAGE = 6;

function PromptsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isToolOpen, setIsToolOpen] = useState(true);

  const sortBy = searchParams.get("sortBy") || "desc";
  const niche = searchParams.get("niche") || "all";
  const tool = searchParams.get("tool") || "all";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const searchQuery = searchParams.get("search") || "";

  // پرامپت‌های برگزیده / ویژه
  const featuredPrompts = useMemo(() => {
    return (promptsData || [])
      .filter((item) => item.isEditorPick === true)
      .slice(0, 2);
  }, []);

  // لیست حوزه‌ها (Niches) به همراه تعداد
  const uniqueNiches = useMemo(() => {
    const list = promptsData || [];
    const niches = [
      ...new Set(list.map((item) => item?.niche?.trim()).filter(Boolean)),
    ];
    return niches.map((n) => ({
      name: n,
      count: list.filter((item) => item?.niche === n).length,
    }));
  }, []);

  // لیست ابزارها (Tools) به همراه تعداد
  const uniqueTools = useMemo(() => {
    const list = promptsData || [];
    const tools = [
      ...new Set(list.map((item) => item?.tool?.trim().toLowerCase()).filter(Boolean)),
    ];
    return tools.map((t) => ({
      name: t,
      count: list.filter((item) => item?.tool?.toLowerCase() === t).length,
    }));
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

  // پردازش داده‌ها: جستجو، فیلتر و مرتب‌سازی
  const processedData = useMemo(() => {
    let filtered = [...(promptsData || [])];

    // ۱. جستجو
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item?.title?.toLowerCase().includes(query) ||
          item?.prompt?.toLowerCase().includes(query) ||
          item?.tool?.toLowerCase().includes(query) ||
          item?.niche?.toLowerCase().includes(query) ||
          item?.tags?.toLowerCase().includes(query),
      );
    }

    // ۲. فیلتر حوزه
    if (niche !== "all") {
      filtered = filtered.filter((item) => item?.niche === niche);
    }

    // ۳. فیلتر ابزار
    if (tool !== "all") {
      filtered = filtered.filter(
        (item) => item?.tool?.toLowerCase() === tool.toLowerCase(),
      );
    }

    // ۴. مرتب‌سازی
    filtered.sort((a, b) => {
      if (sortBy === "popular") {
        return (Number(b.likes) || 0) - (Number(a.likes) || 0);
      }
      if (sortBy === "asc") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      // پیش‌فرض: جدیدترین (desc)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return filtered;
  }, [searchQuery, niche, tool, sortBy]);

  const totalPages = Math.ceil(processedData.length / ITEMS_PER_PAGE);

  const paginatedData = processedData.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  return (
    <main className={styles.container}>
      {/* سربرگ صفحه پرامپت‌ها */}
      <section className={styles.headerSection}>
        <h1 className={styles.pageTitle}>بانک پرامپت‌های هوش مصنوعی</h1>
        <p className={styles.pageSubtitle}>
          مجموعه‌ای گلچین‌شده و تست‌شده از بهترین پرامپت‌های هوش مصنوعی برای تولید تصویر، طراحی، کدنویسی و نگارش.
        </p>
      </section>

      {/* بخش پرامپت‌های ویژه / پیشنهاد سردبیر */}
      {featuredPrompts.length > 0 && niche === "all" && tool === "all" && !searchQuery && (
        <section className={styles.featuredSection}>
          <div className={styles.featuredHeader}>
            <span className={styles.featuredBadge}>پیشنهاد سردبیر</span>
            <div className={styles.featuredDivider}></div>
          </div>
          <div className={styles.featuredGrid}>
            {featuredPrompts.map((prompt) => (
              <PromptCard key={`featured-${prompt.id}`} data={prompt} />
            ))}
          </div>
        </section>
      )}

      {/* طرح دو ستونه صفحه */}
      <div className={styles.contentLayout}>
        {/* ستون اصلی: کنترل‌های جستجو + گرید کارت‌ها + صفحه‌بندی */}
        <div className={styles.promptsColumn}>
          <div className={styles.topControls}>
            <div className={styles.searchWrapper}>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="جستجو در عنوان، متن پرامپت، ابزار و حوزه‌ها..."
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

            <div className={styles.controlsGroup}>
              <select
                className={styles.sortSelect}
                value={sortBy}
                onChange={(e) => updateParams("sortBy", e.target.value)}
                aria-label="مرتب‌سازی پرامپت‌ها"
              >
                <option value="desc">جدیدترین</option>
                <option value="popular">محبوب‌ترین (بیشترین لایک)</option>
                <option value="asc">قدیمی‌ترین</option>
              </select>

              <div className={styles.promptsCount}>
                <span>{e2p(processedData.length)}</span> پرامپت
              </div>
            </div>
          </div>

          {/* لیست پرامپت‌ها */}
          <section className={styles.promptsGrid}>
            {paginatedData.length > 0 ? (
              paginatedData.map((prompt) => (
                <PromptCard key={prompt.id} data={prompt} />
              ))
            ) : (
              <div className={styles.emptyState}>
                <p>پرامپتی با این مشخصات یافت نشد.</p>
                <button
                  type="button"
                  className={styles.resetFilterBtn}
                  onClick={() => {
                    const newParams = new URLSearchParams();
                    setSearchParams(newParams);
                  }}
                >
                  پاکسازی فیلترها
                </button>
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
                صفحه {e2p(page)} از {e2p(totalPages)}
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
        </div>

        {/* ستون کناری: فیلتر حوزه‌ها و ابزارها */}
        <aside className={styles.sidebarColumn}>
          {/* کارت دسته‌بندی حوزه (Niche) */}
          <div className={styles.categoryCard}>
            <button
              className={styles.categoryHeaderBtn}
              type="button"
              onClick={() => setIsCategoryOpen((prev) => !prev)}
              aria-label="تغییر وضعیت نمایش حوزه‌ها"
            >
              <span className={styles.categoryTitle}>حوزه‌ها و موضوعات</span>
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
                      niche === "all" ? styles.activeCategory : ""
                    }`}
                    onClick={() => updateParams("niche", "all")}
                  >
                    <span>همه حوزه‌ها</span>
                    <span className={styles.badgeCount}>
                      {e2p(promptsData.length)}
                    </span>
                  </button>
                </li>
                {uniqueNiches.map((item) => (
                  <li key={item.name}>
                    <button
                      className={`${styles.categoryItemBtn} ${
                        niche === item.name ? styles.activeCategory : ""
                      }`}
                      onClick={() => updateParams("niche", item.name)}
                    >
                      <span>{item.name}</span>
                      <span className={styles.badgeCount}>
                        {e2p(item.count)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* کارت فیلتر ابزارهای هوش مصنوعی */}
          <div className={`${styles.categoryCard} ${styles.toolCard}`}>
            <button
              className={styles.categoryHeaderBtn}
              type="button"
              onClick={() => setIsToolOpen((prev) => !prev)}
              aria-label="تغییر وضعیت نمایش ابزارها"
            >
              <span className={styles.categoryTitle}>ابزارهای هوش مصنوعی</span>
              <svg
                className={`${styles.categoryArrow} ${
                  isToolOpen ? styles.arrowOpen : ""
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

            {isToolOpen && (
              <ul className={styles.categoryList}>
                <li>
                  <button
                    className={`${styles.categoryItemBtn} ${
                      tool === "all" ? styles.activeCategory : ""
                    }`}
                    onClick={() => updateParams("tool", "all")}
                  >
                    <span>همه ابزارها</span>
                    <span className={styles.badgeCount}>
                      {e2p(promptsData.length)}
                    </span>
                  </button>
                </li>
                {uniqueTools.map((item) => (
                  <li key={item.name}>
                    <button
                      className={`${styles.categoryItemBtn} ${
                        tool === item.name ? styles.activeCategory : ""
                      }`}
                      onClick={() => updateParams("tool", item.name)}
                    >
                      <span style={{ textTransform: "capitalize" }}>
                        {item.name}
                      </span>
                      <span className={styles.badgeCount}>
                        {e2p(item.count)}
                      </span>
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

export default PromptsPage;
