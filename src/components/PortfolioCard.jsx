import { useEffect, useState } from "react";
import { FaBookmark, FaRegBookmark, FaGithub, FaCalendarAlt } from "react-icons/fa";
import { FiArrowUpLeft } from "react-icons/fi";
import { toast } from "react-toastify";

import styles from "./PortfolioCard.module.css";
import { isPortfolioSaved, toggleSavePortfolio } from "../utils/storage";
import formatPersianDate from "../utils/formatPersianDate";

function PortfolioCard({ portfolio }) {
  // پشتیبانی از هر دو کلید _id و id برای جلوگیری از undefined شدن
  const portfolioId = portfolio?._id ?? portfolio?.id;

  const [saved, setSaved] = useState(() => isPortfolioSaved(portfolioId));

  useEffect(() => {
    const handleSavedChange = () => {
      setSaved(isPortfolioSaved(portfolioId));
    };

    window.addEventListener("portfolio-saved-change", handleSavedChange);
    return () => {
      window.removeEventListener("portfolio-saved-change", handleSavedChange);
    };
  }, [portfolioId]);

  if (!portfolio) return null;

  const handleSaveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!portfolioId) return;

    const updated = toggleSavePortfolio(portfolioId);
    const isNowSaved = updated.some((id) => String(id) === String(portfolioId));
    setSaved(isNowSaved);

    if (isNowSaved) {
      toast.success("نمونه‌کار به ذخیره‌شده‌ها اضافه شد.");
    } else {
      toast.info("نمونه‌کار از ذخیره‌شده‌ها حذف شد.");
    }
  };

  const handleImgError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = "/banner.png";
  };

  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        <img
          src={portfolio.image || "/banner.png"}
          alt={portfolio.title}
          className={styles.image}
          loading="lazy"
          onError={handleImgError}
        />

        <button
          type="button"
          onClick={handleSaveClick}
          className={`${styles.saveIconBtn} ${saved ? styles.saved : ""}`}
          aria-label={saved ? "حذف از ذخیره‌ها" : "ذخیره نمونه‌کار"}
          title={saved ? "حذف از ذخیره‌ها" : "ذخیره نمونه‌کار"}
        >
          {saved ? <FaBookmark /> : <FaRegBookmark />}
        </button>

        {portfolio.category && (
          <div className={styles.category}>{portfolio.category}</div>
        )}

        {portfolio.featured && (
          <span className={styles.featured}>ویژه</span>
        )}
      </div>

      <div className={styles.content}>
        {portfolio.createdAt && (
          <div className={styles.metaRow}>
            <span className={styles.date}>
              <FaCalendarAlt />
              <span>{formatPersianDate(portfolio.createdAt)}</span>
            </span>
          </div>
        )}

        <h3 className={styles.title} title={portfolio.title}>
          {portfolio.title}
        </h3>

        <p className={styles.description}>{portfolio.description}</p>

        {Array.isArray(portfolio.technologies) && portfolio.technologies.length > 0 && (
          <div className={styles.technologies}>
            {portfolio.technologies.slice(0, 4).map((technology) => (
              <span key={technology}>{technology}</span>
            ))}
          </div>
        )}

        <div className={styles.footer}>
          {portfolio.liveUrl ? (
            <a
              href={portfolio.liveUrl}
              target="_blank"
              rel="noreferrer"
              className={styles.liveBtn}
              title="مشاهده آنلاین پروژه"
            >
              <span>مشاهده آنلاین</span>
              <FiArrowUpLeft />
            </a>
          ) : (
            <span className={styles.noLive}>پروژه داخلی</span>
          )}

          {portfolio.githubUrl && (
            <a
              href={portfolio.githubUrl}
              target="_blank"
              rel="noreferrer"
              className={styles.githubBtn}
              aria-label="مشاهده سورس کد در گیت‌هاب"
              title="سورس کد در گیت‌هاب"
            >
              <FaGithub />
              <span>گیت‌هاب</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default PortfolioCard;
