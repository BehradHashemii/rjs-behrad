import { IoPersonSharp } from "react-icons/io5";
import { FaCalendarAlt } from "react-icons/fa";

import styles from "./ArticleCard.module.css";
import formatPersianDate from "../utils/formatPersianDate";

function ArticleCard({ article }) {
  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        <img src={article.image} alt={article.title} className={styles.image} />
      </div>

      <div className={styles.content}>
        <div className={styles.info}>
          <p>
            <IoPersonSharp />
            {article.author}
          </p>

          <p>
            <FaCalendarAlt />
            {formatPersianDate(article.date)}
          </p>
        </div>

        <h2 className={styles.title}>{article.title}</h2>

        <div
          className={styles.desc}
          dangerouslySetInnerHTML={{
            __html: article.description,
          }}
        />
        <div className={styles.technologies}>
          {article.tags?.split(",").map((tag, index) => (
            <span key={index} className={styles.tech}>
              <a href={`/articles?tag=${tag.trim()}`}>#{tag.trim()}</a>
            </span>
          ))}
        </div>
        {article.slug && (
          <div className={styles.links}>
            <a href={`/articles/${article.slug}`} className={styles.liveLink}>
              مطالعه مقاله
            </a>
          </div>
        )}
      </div>
    </article>
  );
}

export default ArticleCard;
