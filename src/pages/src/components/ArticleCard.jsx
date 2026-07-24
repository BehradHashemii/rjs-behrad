import { useState, useEffect } from "react";
import { IoPersonSharp } from "react-icons/io5";
import { FaCalendarAlt, FaHeart, FaRegHeart, FaClock } from "react-icons/fa";
import { Link } from "react-router-dom";

import styles from "./ArticleCard.module.css";
import formatPersianDate from "../utils/formatPersianDate";
import { formatReadTime } from "../utils/calculateReadTime";
import { isArticleLiked, toggleLikeArticle } from "../utils/storage";

function ArticleCard({ article }) {
  const [liked, setLiked] = useState(() => isArticleLiked(article?.id));

  useEffect(() => {
    const handleLikedChange = () => {
      setLiked(isArticleLiked(article?.id));
    };

    window.addEventListener("article-liked-change", handleLikedChange);
    return () => {
      window.removeEventListener("article-liked-change", handleLikedChange);
    };
  }, [article?.id]);

  const handleLikeClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!article?.id) return;
    const updated = toggleLikeArticle(article.id);
    setLiked(updated.includes(article.id));
  };

  const readTimeStr = formatReadTime(article?.description);

  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        <img src={article.image} alt={article.title} className={styles.image} />

        <span className={styles.readTimeBadge} title="زمان تقریبی مطالعه">
          <FaClock />
          <span>{readTimeStr}</span>
        </span>
        
        <button
          type="button"
          onClick={handleLikeClick}
          className={`${styles.likeBtn} ${liked ? styles.liked : ""}`}
          title={liked ? "حذف از پسندیده‌ها" : "پسندیدن مقاله"}
          aria-label={liked ? "حذف از پسندیده‌ها" : "پسندیدن مقاله"}
        >
          {liked ? <FaHeart color="#ef4444" /> : <FaRegHeart />}
        </button>
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

          <p className={styles.readTimeText}>
            <FaClock />
            {readTimeStr} مطالعه
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
              <Link to={`/articles?tag=${tag.trim()}`}>#{tag.trim()}</Link>
            </span>
          ))}
        </div>
        {article.slug && (
          <div className={styles.links}>
            <Link to={`/articles/${article.slug}`} className={styles.liveLink}>
              مطالعه مقاله
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}

export default ArticleCard;
