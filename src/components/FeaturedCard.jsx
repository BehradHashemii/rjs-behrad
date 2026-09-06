import { Link } from "react-router-dom";
import styles from "./FeaturedCard.module.css";
import formatPersianDate from "../utils/formatPersianDate";

function FeaturedCard({ article }) {
  const tags = Array.isArray(article.tags)
    ? article.tags
    : article.tags
        ?.split(",")
        .map((t) => t.trim())
        .filter(Boolean) || [];

  return (
    <div
      className={styles.card}
      style={{
        backgroundImage: `linear-gradient(-45deg , rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.7) 45%, rgba(15, 23, 42, 0.2) 100%), url(${article?.image})`,
      }}
    >
      <div className={styles.overlayContent}>
        {tags.length > 0 && (
          <div className={styles.technologies}>
            {tags.map((tag, index) => (
              <span key={index} className={styles.tech}>
                {tag}
              </span>
            ))}
          </div>
        )}
        <h3 className={styles.title}>{article.title}</h3>

        <div
          className={styles.desc}
          dangerouslySetInnerHTML={{
            __html: article?.description,
          }}
        />

        <div className={styles.bottomBar}>
          <div className={styles.metaData}>
            <span className={styles.metaItem}>
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              {article?.author}
            </span>

            <span className={styles.metaItem}>
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              {formatPersianDate(article?.createdAt)}
            </span>
          </div>

          <Link to={`/articles/${article.slug}`} className={styles.readMoreBtn}>
            <span>مطالعه‌ی مقاله</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default FeaturedCard;
