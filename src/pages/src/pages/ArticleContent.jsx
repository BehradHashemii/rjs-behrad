import { Link } from "react-router-dom";
import formatPersianDate from "../utils/formatPersianDate";
import { FaCopy, FaHeart, FaRegHeart, FaCheck, FaClock } from "react-icons/fa";
import { useState, useEffect } from "react";
import { isArticleLiked, toggleLikeArticle } from "../utils/storage";
import { formatReadTime } from "../utils/calculateReadTime";

function ArticleContent({ article, styles, contentRef }) {
  const [isLiked, setIsLiked] = useState(() => isArticleLiked(article?.id));
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleLikedChange = () => {
      setIsLiked(isArticleLiked(article?.id));
    };

    window.addEventListener("article-liked-change", handleLikedChange);
    return () => {
      window.removeEventListener("article-liked-change", handleLikedChange);
    };
  }, [article?.id]);

  const handleToggleLike = () => {
    if (!article?.id) return;
    const updatedList = toggleLikeArticle(article.id);
    setIsLiked(updatedList.includes(article.id));
  };

  const shortenLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <article className={`${styles.articleContainer}`}>
      <h1>{article?.title}</h1>
      <div className={styles.meta}>
        <p style={{ opacity: "0.8" }}>{article?.author}</p>
        <div
          style={{ display: "flex", alignItems: "center", fontSize: "1rem" }}
        >
          <p style={{ opacity: "0.8" }}>
            {article.tags.split(",").map((tag, index, array) => {
              const trimmedTag = tag.trim();
              return (
                <span key={index}>
                  <a href={`/articles?tag=${encodeURIComponent(trimmedTag)}`}>
                    {trimmedTag}
                  </a>
                  {index < array.length - 1 && " ، "}
                </span>
              );
            })}
          </p>
          <p
            style={{
              borderRight: "0.5px solid #000000cc",
              paddingRight: "6px",
              marginRight: "6px",
              opacity: "0.8",
            }}
          >
            {formatPersianDate(article?.date)}
          </p>
          <p
            style={{
              borderRight: "0.5px solid #000000cc",
              paddingRight: "6px",
              marginRight: "6px",
              opacity: "0.85",
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <FaClock style={{ color: "#f7763d" }} />
            <span>زمان مطالعه: {formatReadTime(article?.description)}</span>
          </p>
        </div>
      </div>
      <div className={styles.detail}>
        <div className={styles.imageContainer}>
          <img
            src={article.image}
            alt={article.title}
            className={styles.image}
          />
        </div>

        <div className={styles.contentWrapper}>
          <section
            ref={contentRef}
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: article.description }}
          ></section>
          <div className={styles.actions}>
            <button
              onClick={handleToggleLike}
              className={`${isLiked ? styles.favActive : styles.favNotActive} ${styles.actionsBtn}`}
              aria-label={
                isLiked ? "حذف از پسندیده‌ها" : "پسندیدن مقاله"
              }
            >
              {isLiked ? (
                <>
                  <FaHeart color="#ef4444" />
                  <span>مقاله پسندیده شد</span>
                </>
              ) : (
                <>
                  <FaRegHeart />
                  <span>پسندیدن مقاله</span>
                </>
              )}
            </button>
            <button
              onClick={shortenLink}
              className={`${styles.copyBtn} ${styles.actionsBtn}`}
            >
              {copied ? <FaCheck color="#10b981" /> : <FaCopy />}
              <span>{copied ? "لینک کپی شد!" : "کپی لینک مقاله"}</span>
            </button>
            <Link
              to="/articles"
              className={`${styles.back} ${styles.actionsBtn}`}
            >
              بازگشت به مقالات
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export default ArticleContent;
