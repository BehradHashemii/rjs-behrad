import { Link } from "react-router-dom";
import formatPersianDate from "../utils/formatPersianDate";
import { FcDislike, FcLike } from "react-icons/fc";
import { FaCopy, FaHeart, FaRegHeart } from "react-icons/fa";
import { useState } from "react";

function ArticleContent({ article, styles, contentRef }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const toggleFavorite = () => {
    setIsFavorite((isFavorite) => !isFavorite);
  };
  const shortenLink = () => {
    navigator.clipboard.writeText(location.href)
  }
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
                  {index < array.length - 1 && " \، "}
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
              onClick={toggleFavorite}
              className={`${isFavorite ? styles.favActive : styles.favNotActive} ${styles.actionsBtn}`}
              aria-label={
                isFavorite ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"
              }
            >
              {isFavorite ? (
                <>
                  <FaHeart color="#ff0000" />
                  <span>حذف از علاقه‌مندی‌ها</span>
                </>
              ) : (
                <>
                  <FaRegHeart />
                  <span>افزودن به علاقه‌مندی‌ها</span>
                </>
              )}
            </button>
            <button
              onClick={shortenLink}
              className={`${styles.copyBtn} ${styles.actionsBtn}`}
            >
              <FaCopy />
              <span>کپی لینک</span>
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
