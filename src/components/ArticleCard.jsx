import { IoPersonSharp } from "react-icons/io5";
import { FaCalendarAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import styles from "./ArticleCard.module.css";
import formatPersianDate from "../utils/formatPersianDate";

function ArticleCard({ article }) {
  if (!article) return null;

  const tags = Array.isArray(article.tags)
    ? article.tags
    : article.tags
        ?.split(",")
        .map((t) => t.trim())
        .filter(Boolean) || [];

  return (
    <article className={styles.cardContainer}>
      <Link to={`/articles/${article.slug}`} className={styles.card}>
        <div className={styles.imageWrapper}>
          <img
            src={article.image || "/placeholder.jpg"}
            alt={article.title}
            className={styles.image}
            loading="lazy"
          />
        </div>

        <div className={styles.content}>
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
              __html: article.description,
            }}  
          />

          <div className={styles.info}>
            <p>
              <IoPersonSharp />
              <span>{article.author}</span>
            </p>
            <p>
              <FaCalendarAlt />
              <span>{formatPersianDate(article.createdAt)}</span>
            </p>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default ArticleCard;
