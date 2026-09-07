import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import {
  FaTimes,
  FaFolderOpen,
  FaNewspaper,
  FaLink,
  FaArrowLeft,
  FaFire,
} from "react-icons/fa";

import mockData from "../data/mockData.json";
import styles from "./SearchModal.module.css";
import e2p from "../utils/persianNumber";

// استخراج ایمن داده‌ها از فایل جیسون
const portfoliosData = mockData.portfolios || [];
const articlesData = mockData.articles || [];

function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "").trim();
}

const POPULAR_SEARCHES = [
  "React",
  "پت شاپ",
  "داشبورد",
  "طراحی وب",
  "احراز هویت",
  "مقالات",
];

const SITE_PAGES = [
  { title: "صفحه اصلی", path: "/", icon: <FaLink /> },
  {
    title: "نمونه‌کارها و پروژه‌ها",
    path: "/portfolios",
    icon: <FaFolderOpen />,
  },
  { title: "مقالات و یادداشت‌ها", path: "/articles", icon: <FaNewspaper /> },
  { title: "تماس و ارتباط با بهراد", path: "/contact", icon: <FaLink /> },
  {
    title: "ذخیره‌شده‌ها و علاقه‌مندی‌ها",
    path: "/saved",
    icon: <FaFolderOpen />,
  },
];

function SearchModal({ isOpen, onClose, initialQuery = "" }) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // ریست مقدار جستجو و فوکوس با باز شدن مدال
  useEffect(() => {
    if (isOpen) {
      setSearchQuery(initialQuery);
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialQuery]);

  // قفل اسکرول بدنه هنگام باز بودن مدال
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // بستن با دکمه Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const query = searchQuery.trim().toLowerCase();

  // فیلتر نمونه‌کارها (با مدیریت رشته یا آرایه بودن تکنولوژی‌ها)
  const matchedPortfolios = query
    ? portfoliosData.filter((item) => {
        const titleMatch = item.title?.toLowerCase().includes(query);
        const descMatch = item.description?.toLowerCase().includes(query);
        const catMatch = item.category?.toLowerCase().includes(query);
        const techMatch = Array.isArray(item.technologies)
          ? item.technologies.some((t) => t.toLowerCase().includes(query))
          : item.technologies?.toLowerCase().includes(query);

        return titleMatch || descMatch || catMatch || techMatch;
      })
    : [];

  // فیلتر مقالات (با پاکسازی تگ‌های HTML)
  const matchedArticles = query
    ? articlesData.filter((item) => {
        const titleMatch = item.title?.toLowerCase().includes(query);
        const cleanDesc = stripHtml(item.description).toLowerCase();
        const descMatch = cleanDesc.includes(query);
        const tagMatch = item.tags?.toLowerCase().includes(query);

        return titleMatch || descMatch || tagMatch;
      })
    : [];

  // فیلتر صفحات ثابت
  const matchedPages = query
    ? SITE_PAGES.filter((p) => p.title.toLowerCase().includes(query))
    : [];

  const totalResultsCount =
    matchedPortfolios.length + matchedArticles.length + matchedPages.length;

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (!query) return;

    onClose();
  };

  const handleItemClick = (path) => {
    onClose();
    setSearchQuery("");
    navigate(path);
  };

  const handlePopularSearchClick = (tag) => {
    setSearchQuery(tag);
    inputRef.current?.focus();
  };

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* اینپوت فرم جستجو */}
        <form className={styles.searchForm} onSubmit={handleSearchSubmit}>
          <CiSearch className={styles.searchIcon} />
          <input
            ref={inputRef}
            type="text"
            className={styles.searchInput}
            placeholder="جستجو در پروژه‌ها، مقالات و صفحات سایت..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={() => {
                setSearchQuery("");
                inputRef.current?.focus();
              }}
              title="پاک کردن"
            >
              <FaTimes />
            </button>
          )}
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            title="بستن (Esc)"
          >
            <FaTimes />
          </button>
        </form>

        {/* بدنه محتوا */}
        <div className={styles.modalBody}>
          {query.length === 0 ? (
            <div className={styles.popularSection}>
              <div className={styles.popularTitle}>
                <FaFire className={styles.fireIcon} />
                <span>جستجوهای محبوب</span>
              </div>
              <div className={styles.tagList}>
                {POPULAR_SEARCHES.map((tagItem, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={styles.popularTag}
                    onClick={() => handlePopularSearchClick(tagItem)}
                  >
                    {tagItem}
                  </button>
                ))}
              </div>
            </div>
          ) : totalResultsCount === 0 ? (
            <div className={styles.noResults}>
              <p>
                هیچ نتیجه‌ای برای «<strong>{searchQuery}</strong>» یافت نشد.
              </p>
              <span>
                پیشنهاد: واژگان کلیدی دیگری مانند «React» یا «پت شاپ» را امتحان
                کنید.
              </span>
            </div>
          ) : (
            <div className={styles.resultsContainer}>
              {/* بخش نمونه‌کارها */}
              {matchedPortfolios.length > 0 && (
                <div className={styles.resultGroup}>
                  <div className={styles.groupHeader}>
                    <FaFolderOpen />
                    <span>نمونه‌کارها ({e2p(matchedPortfolios.length)})</span>
                  </div>
                  <div className={styles.groupList}>
                    {matchedPortfolios.slice(0, 4).map((item) => (
                      <div
                        key={item._id || item.id}
                        className={styles.resultItem}
                        onClick={() =>
                          handleItemClick(
                            `/portfolios?search=${encodeURIComponent(item.title)}`,
                          )
                        }
                      >
                        <img
                          src={item.image || "/placeholder.jpg"}
                          alt={item.title}
                          className={styles.resultThumb}
                          width="48"
                          height="48"
                          loading="lazy"
                        />
                        <div className={styles.resultInfo}>
                          <div className={styles.resultTitle}>{item.title}</div>
                          <div className={styles.resultMeta}>
                            {item.category}
                          </div>
                        </div>
                        <FaArrowLeft className={styles.resultArrow} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* بخش مقالات */}
              {matchedArticles.length > 0 && (
                <div className={styles.resultGroup}>
                  <div className={styles.groupHeader}>
                    <FaNewspaper />
                    <span>مقالات ({e2p(matchedArticles.length)})</span>
                  </div>
                  <div className={styles.groupList}>
                    {matchedArticles.slice(0, 4).map((article) => (
                      <div
                        key={article._id || article.id}
                        className={styles.resultItem}
                        onClick={() =>
                          handleItemClick(`/articles/${article.slug}`)
                        }
                      >
                        <img
                          src={article.image || "/placeholder.jpg"}
                          alt={article.title}
                          className={styles.resultThumb}
                          width="48"
                          height="48"
                          loading="lazy"
                        />
                        <div className={styles.resultInfo}>
                          <div className={styles.resultTitle}>
                            {article.title}
                          </div>
                          <div className={styles.resultMeta}>
                            {stripHtml(article.description).substring(0, 55)}...
                          </div>
                        </div>
                        <FaArrowLeft className={styles.resultArrow} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* بخش صفحات سایت */}
              {matchedPages.length > 0 && (
                <div className={styles.resultGroup}>
                  <div className={styles.groupHeader}>
                    <FaLink />
                    <span>صفحات ({e2p(matchedPages.length)})</span>
                  </div>
                  <div className={styles.groupList}>
                    {matchedPages.map((pageItem, index) => (
                      <div
                        key={index}
                        className={styles.resultItem}
                        onClick={() => handleItemClick(pageItem.path)}
                      >
                        <div className={styles.pageIconBox}>
                          {pageItem.icon}
                        </div>
                        <div className={styles.resultInfo}>
                          <div className={styles.resultTitle}>
                            {pageItem.title}
                          </div>
                        </div>
                        <FaArrowLeft className={styles.resultArrow} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* دکمه مشاهده همه */}
        {query.length > 0 && totalResultsCount > 0 && (
          <div className={styles.modalFooter}>
            <button className={styles.viewAllBtn}>
              تمام نتایج ({e2p(totalResultsCount)})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchModal;
