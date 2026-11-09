import { useEffect, useState } from "react";
import { IoPersonOutline, IoTimeOutline } from "react-icons/io5";
import { FaCalendarAlt, FaHeart, FaRegHeart } from "react-icons/fa";
import { FiArrowUpLeft } from "react-icons/fi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import styles from "./ArticleCard.module.css";
import formatPersianDate from "../utils/formatPersianDate";
import e2p from "../utils/persianNumber";
import { isArticleLiked, toggleLikeArticle } from "../utils/storage";

function ArticleCard({ article }) {
  const articleId = article?._id ?? article?.id;

  const [isLiked, setIsLiked] = useState(() => isArticleLiked(articleId));

  useEffect(() => {
    const handleLikedChange = (e) => {
      if (e?.detail?.articleId) {
        if (String(e.detail.articleId) === String(articleId)) {
          setIsLiked(isArticleLiked(articleId));
        }
      } else {
        setIsLiked(isArticleLiked(articleId));
      }
    };

    window.addEventListener("article-liked-change", handleLikedChange);
    return () => {
      window.removeEventListener("article-liked-change", handleLikedChange);
    };
  }, [articleId]);

  if (!article) return null;

  const handleToggleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!articleId) return;

    const updatedList = toggleLikeArticle(articleId);
    const nowLiked = updatedList.includes(String(articleId));
    setIsLiked(nowLiked);

    if (nowLiked) {
      toast.success("مقاله به علاقه‌مندی‌ها اضافه شد.");
    } else {
      toast.info("مقاله از علاقه‌مندی‌ها حذف شد.");
    }
  };

  const tags = Array.isArray(article?.tags)
    ? article.tags
    : typeof article?.tags === "string"
      ? article.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

  // استخراج متن خلاصه و پاک‌سازی تگ‌های HTML و فاصله‌ها
  const cleanDescription = article?.description
    ? article.description
        .replace(/<[^>]*>?/gm, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .trim()
    : "";

  // محاسبه تقریبی زمان مطالعه
  const wordsCount = cleanDescription ? cleanDescription.split(/\s+/).length : 0;
  const readingTime = Math.max(2, Math.ceil(wordsCount / 120));

  const handleImgError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = "/banner.png";
  };

  return (
    <article className={styles.cardContainer}>
      <Link
        to={`/articles/${article.slug || articleId}`}
        className={styles.card}
      >
        <div className={styles.imageWrapper}>
          <img
            src={article.image || "/banner.png"}
            alt={article.title}
            className={styles.image}
            loading="lazy"
            onError={handleImgError}
          />

          <button
            type="button"
            className={`${styles.likeBtn} ${isLiked ? styles.liked : ""}`}
            onClick={handleToggleLike}
            aria-label={isLiked ? "حذف از پسندها" : "پسندیدن مقاله"}
            title={isLiked ? "حذف از پسندها" : "پسندیدن مقاله"}
          >
            {isLiked ? <FaHeart /> : <FaRegHeart />}
          </button>

          {tags.length > 0 && (
            <span className={styles.categoryBadge}>{tags[0]}</span>
          )}
        </div>

        <div className={styles.content}>
          <div className={styles.headerRow}>
            {tags.length > 1 && (
              <div className={styles.technologies}>
                {tags.slice(1, 3).map((tag, index) => (
                  <span key={index} className={styles.tech}>
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className={styles.readingTime}>
              <IoTimeOutline />
              <span>{e2p(readingTime)} دقیقه مطالعه</span>
            </div>
          </div>

          <h3 className={styles.title} title={article.title}>
            {article.title}
          </h3>

          <p className={styles.desc}>{cleanDescription}</p>

          <div className={styles.footer}>
            <div className={styles.info}>
              {article.author && (
                <p>
                  <IoPersonOutline />
                  <span>{article.author}</span>
                </p>
              )}
              {article.createdAt && (
                <p>
                  <FaCalendarAlt />
                  <span>{formatPersianDate(article.createdAt)}</span>
                </p>
              )}
            </div>

            <div className={styles.readMore}>
              <span>مطالعه</span>
              <FiArrowUpLeft />
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default ArticleCard;
