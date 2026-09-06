import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

// دیتای لوکال
import promptsData from "../data/prompts.json";
import e2p from "../utils/persianNumber";
import styles from "./PromptsPage.module.css";
import PromptCard from "../components/PromptCard";

const ITEMS_PER_PAGE = 9;

function PromptsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [copiedId, setCopiedId] = useState(null);

  const sortBy = searchParams.get("sortBy") || "desc";
  const niche = searchParams.get("niche") || "all";
  const tool = searchParams.get("tool") || "all";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const searchQuery = searchParams.get("search") || "";

  // استخراج نیچ‌های یکتا
  const uniqueNiches = useMemo(() => {
    const list = promptsData || [];
    return [
      ...new Set(list.map((item) => item?.niche?.trim()).filter(Boolean)),
    ];
  }, []);

  // استخراج ابزارهای یکتا
  const uniqueTools = useMemo(() => {
    const list = promptsData || [];
    return [...new Set(list.map((item) => item?.tool?.trim()).filter(Boolean))];
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

  // کپی متن پرامپت
  const handleCopyPrompt = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // پردازش داده‌ها: جستجو، فیلتر و مرتب‌سازی
  const processedData = useMemo(() => {
    let filtered = [...(promptsData || [])];

    // ۱. فیلتر جستجو روی عنوان، متن پرامپت و ابزار
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item?.title?.toLowerCase().includes(query) ||
          item?.promptText?.toLowerCase().includes(query) ||
          item?.tool?.toLowerCase().includes(query) ||
          item?.niche?.toLowerCase().includes(query),
      );
    }

    // ۲. فیلتر نیچ (حوزه)
    if (niche !== "all") {
      filtered = filtered.filter((item) => item?.niche === niche);
    }

    // ۳. فیلتر ابزار هوش مصنوعی
    if (tool !== "all") {
      filtered = filtered.filter((item) => item?.tool === tool);
    }

    // ۴. مرتب‌سازی (بر اساس تعداد لایک)
    filtered.sort((a, b) => {
      const likesA = Number(a.likes) || 0;
      const likesB = Number(b.likes) || 0;
      return sortBy === "desc" ? likesB - likesA : likesA - likesB;
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
      <section className={styles.headerSection}>
        <h1 className={styles.pageTitle}>بانک پرامپت‌های هوش مصنوعی</h1>
        <p className={styles.pageSubtitle}>
          مجموعه‌ای از پرامپت‌های تست‌شده.
        </p>
      </section>
      <section className={styles.filtersSection}>
        <div className={styles.searchWrapper}>
          <input
            type="text"
            placeholder="جستجو در پرامپت‌ها، ابزارها و حوزه‌ها..."
            value={searchQuery}
            onChange={(e) => updateParams("search", e.target.value)}
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => updateParams("sortBy", e.target.value)}
        >
          <option value="desc">محبوب‌ترین (بیشترین لایک)</option>
          <option value="asc">کمترین لایک</option>
        </select>

        <select
          value={niche}
          onChange={(e) => updateParams("niche", e.target.value)}
        >
          <option value="all">همه حوزه‌ها (Niche)</option>
          {uniqueNiches.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>

        <select
          value={tool}
          onChange={(e) => updateParams("tool", e.target.value)}
        >
          <option value="all">همه ابزارها (Tool)</option>
          {uniqueTools.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </section>

      {/* گرید کارت‌های پرامپت */}
      <section className={styles.promptsGrid}>
        {paginatedData.length > 0 ? (
          paginatedData.map((item) => (
            <PromptCard data={item} key={item.id}/>
          ))
        ) : (
          <div className={`${styles.emptyState} glassBG`}>
            <p>پرامپتی با این مشخصات یافت نشد.</p>
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

export default PromptsPage;
