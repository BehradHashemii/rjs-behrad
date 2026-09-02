import React, { useEffect, useState } from "react";
import { FaBookmark, FaExternalLinkAlt, FaGithub, FaRegBookmark } from "react-icons/fa";
import styles from "./PortfolioCard.module.css";
import { isPortfolioSaved, toggleSavePortfolio } from "../utils/storage";

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

  const handleSaveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!portfolioId) return;

    const updated = toggleSavePortfolio(portfolioId);
    setSaved(updated.some((id) => String(id) === String(portfolioId)));
  };

  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        <img
          src={portfolio.image}
          alt={portfolio.title}
          className={styles.image}
        />

        {portfolio.category && (
          <div className={styles.category}>{portfolio.category}</div>
        )}

        {portfolio.featured && (
          <span className={styles.featured}>Featured</span>
        )}
      </div>

      <div className={styles.content}>
        <h3>{portfolio.title}</h3>
        <p className={styles.description}>{portfolio.description}</p>

        {Array.isArray(portfolio.technologies) && (
          <div className={styles.technologies}>
            {portfolio.technologies.map((technology) => (
              <span key={technology}>{technology}</span>
            ))}
          </div>
        )}

        <div className={styles.footer}>
          <div className={styles.saveStatusLabel}>
            <button
              type="button"
              onClick={handleSaveClick}
              className={styles.saveBtn}
              aria-label={saved ? "حذف از ذخیره‌ها" : "ذخیره نمونه‌کار"}
            >
              {saved ? (
                <>
                  <FaBookmark />
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