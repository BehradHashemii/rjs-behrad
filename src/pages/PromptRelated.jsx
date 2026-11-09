import { Link } from "react-router-dom";
import { IoSparklesOutline } from "react-icons/io5";
import { FaCalendarAlt } from "react-icons/fa";
import { FiArrowUpLeft } from "react-icons/fi";
import formatPersianDate from "../utils/formatPersianDate";

function PromptRelated({ styles, relatedPrompts, currentTool }) {
  const handleImgError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = "/banner.png";
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarCard}>
        <div className={styles.sidebarHeader}>
          <IoSparklesOutline />
          <h3>پرامپت‌های مرتبط</h3>
        </div>

        {relatedPrompts && relatedPrompts.length > 0 ? (
          <div className={styles.relatedList}>
            {relatedPrompts.map((rel) => {
              const tool = (rel.tool || "ai").toLowerCase();

              return (
                <Link
                  to={`/prompts/${rel.slug || rel.id}`}
                  key={rel.id}
                  className={styles.relatedCard}
                >
                  <div className={styles.relatedImgWrapper}>
                    <img
                      src={rel.image || "/banner.png"}
                      alt={rel.title}
                      className={styles.relatedImg}
                      onError={handleImgError}
                      loading="lazy"
                    />
                    {rel.tool && (
                      <span className={`${styles.relatedToolBadge} ${styles[tool] || ""}`}>
                        {rel.tool}
                      </span>
                    )}
                  </div>

                  <div className={styles.relatedInfo}>
                    <h4 title={rel.title}>{rel.title}</h4>
                    <div className={styles.relatedMeta}>
                      {rel.createdAt ? (
                        <span>
                          <FaCalendarAlt />
                          {formatPersianDate(rel.createdAt)}
                        </span>
                      ) : (
                        <span>{rel.niche || rel.tool}</span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className={styles.noRelated}>پرامپت مرتبط دیگری یافت نشد.</p>
        )}

        <div className={styles.sidebarFooter}>
          <Link
            to={
              currentTool
                ? `/prompts?tool=${encodeURIComponent(currentTool)}`
                : "/prompts"
            }
            className={styles.exploreAllBtn}
          >
            <span>مشاهده سایر پرامپت‌ها</span>
            <FiArrowUpLeft />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PromptRelated;
