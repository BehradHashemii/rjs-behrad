import { Link } from "react-router-dom";
import formatPersianDate from "../utils/formatPersianDate";
import { FcDislike, FcLike } from "react-icons/fc";
import { FaCopy, FaHeart, FaRegHeart } from "react-icons/fa";
import { useEffect, useState } from "react";
import { isArticleLiked, toggleLikeArticle } from "../utils/storage";
import { toast, ToastContainer } from "react-toastify";

function ArticleContent({ article, styles, contentRef }) {
  const [isLiked, setIsLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  // هماهنگ‌سازی با لود شدن مقاله و تغییر id
  useEffect(() => {
    if (article?._id) {
      setIsLiked(isArticleLiked(article._id));
    }
  }, [article?._id]);

  // لیسنر تغییرات در صورت باز بودن تب‌های دیگر یا کامپوننت‌های هم‌زمان
  useEffect(() => {
    const handleLikedChange = () => {
      if (article?._id) {
        setIsLiked(isArticleLiked(article._id));
      }
    };

    window.addEventListener("article-liked-change", handleLikedChange);
    return () => {
      window.removeEventListener("article-liked-change", handleLikedChange);
    };
  }, [article?._id]);

  const handleToggleLike = () => {
    // اگر مقاله هنوز کامل لود نشده هیچ کاری نکن
    if (!article?._id) {
      console.warn("شناسه مقاله نامعتبر است:", article);
      return;
    }

    const updatedList = toggleLikeArticle(article._id);
    const nowLiked = updatedList.includes(String(article._id));

    setIsLiked(nowLiked);

    if (nowLiked) {
      toast.success("مقاله با موفقیت به علاقه‌مندی‌ها اضافه شد.");
    } else {
      toast.info("مقاله از علاقه‌مندی‌ها حذف شد.");
    }
  };

  const shortenLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("کپی شد!");
  };

  return (
    <article className={styles.articleContainer}>
      <h1>{article?.title}</h1>
      <div className={styles.meta}>
        <p style={{ opacity: "0.8" }}>{article?.author}</p>
        <div
          style={{ display: "flex", alignItems: "center", fontSize: "1rem" }}
        >
          <p style={{ opacity: "0.8" }}>
            {article?.tags?.split(",").map((tag, index, array) => {
              const trimmedTag = tag.trim();
              return (
                <span key={index}>
                  <Link to={`/articles?tag=${encodeURIComponent(trimmedTag)}`}>
                    {trimmedTag}
                  </Link>
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
            {formatPersianDate(article?.createdAt)}
          </p>
        </div>
      </div>
      <div className={styles.detail}>
        <div className={styles.imageContainer}>
          <img
            src={article?.image}
            alt={article?.title}
            className={styles.image}
          />
        </div>

        <div className={styles.contentWrapper}>
          <section
            ref={contentRef}
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: article?.description || "" }}
          ></section>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={handleToggleLike}
              className={`${isLiked ? styles.favActive : styles.favNotActive} ${styles.actionsBtn}`}
              aria-label={isLiked ? "حذف از پسندیده‌ها" : "پسندیدن مقاله"}
            >
              {isLiked ? (
                <>
                  <FaHeart />
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
              type="button"
              onClick={shortenLink}
              className={`${styles.copyBtn} ${styles.actionsBtn}`}
            >
              <FaCopy />
              <span>{copied ? "کپی شد" : "کپی لینک"}</span>
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
      <ToastContainer rtl position="top-center" />
    </article>
  );
}

export default ArticleContent;
