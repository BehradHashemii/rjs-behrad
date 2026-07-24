import { useState, useEffect } from "react";
import { FaExternalLinkAlt, FaGithub, FaBookmark, FaRegBookmark } from "react-icons/fa";
import styles from "./PortfolioCard.module.css";
import { isPortfolioSaved, toggleSavePortfolio } from "../utils/storage";

function PortfolioCard({ portfolio }) {
  const [saved, setSaved] = useState(() => isPortfolioSaved(portfolio?.id));

  useEffect(() => {
    const handleSavedChange = () => {
      setSaved(isPortfolioSaved(portfolio?.id));
    };

    window.addEventListener("portfolio-saved-change", handleSavedChange);
    return () => {
      window.removeEventListener("portfolio-saved-change", handleSavedChange);
    };
  }, [portfolio?.id]);

  const handleSaveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!portfolio?.id) return;
    const updated = toggleSavePortfolio(portfolio.id);
    setSaved(updated.includes(portfolio.id));
  };

  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        <img
          src={portfolio.image}
          alt={portfolio.title}
          className={styles.image}
        />

        <div className={styles.category}>{portfolio.category}</div>

        {portfolio.featured && (
          <span className={styles.featured}>Featured</span>
        )}

        <button
          type="button"
          onClick={handleSaveClick}
          className={`${styles.saveBtn} ${saved ? styles.saved : ""}`}
          title={saved ? "حذف از ذخیره‌ها" : "ذخیره نمونه‌کار"}
          aria-label={saved ? "حذف از ذخیره‌ها" : "ذخیره نمونه‌کار"}
        >
          {saved ? <FaBookmark color="#f7763d" /> : <FaRegBookmark />}
        </button>
      </div>

      <div className={styles.content}>
        <h3>{portfolio.title}</h3>
        <p className={styles.description}>{portfolio.description}</p>
        <div className={styles.technologies}>
          {portfolio.technologies.map((technology) => (
            <span key={technology}>{technology}</span>
          ))}
        </div>

        <div className={styles.footer}>
          <div className={styles.saveStatusLabel}>
            <button
              type="button"
              onClick={handleSaveClick}
              className={styles.textSaveBtn}
            >
              {saved ? (
                <>
                  <FaBookmark color="#f7763d" />
                  <span>ذخیره شده</span>
                </>
              ) : (
                <>
                  <FaRegBookmark />
                  <span>ذخیره نمونه‌کار</span>
                </>
              )}
            </button>
          </div>

          <div className={styles.links}>
            {portfolio.liveUrl && (
              <a
                href={portfolio.liveUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="مشاهده پروژه"
                title="پیش‌نمایش آنلاین"
              >
                <FaExternalLinkAlt />
              </a>
            )}

            {portfolio.githubUrl && (
              <a
                href={portfolio.githubUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="مشاهده گیت‌هاب"
                title="سورس کد گیت‌هاب"
              >
                <FaGithub />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default PortfolioCard;
