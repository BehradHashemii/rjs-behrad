import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaCopy, FaHeart, FaRegHeart } from "react-icons/fa";
import { toast } from "react-toastify";

import formatPersianDate from "../utils/formatPersianDate";
import e2p from "../utils/persianNumber";
import { isArticleLiked, toggleLikeArticle } from "../utils/storage";

function ArticleContent({ article, styles, contentRef }) {
  const articleId = article?._id ?? article?.id;
  const [isLiked, setIsLiked] = useState(() => isArticleLiked(articleId));
  const [copied, setCopied] = useState(false);

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

  // اضافه کردن هدر ادیتور و دکمه کپی به تمام بلاک‌های کد برای حفظ ساختار و دندانه‌بندی
  useEffect(() => {
    if (!contentRef?.current) return;

    const preElements = contentRef.current.querySelectorAll("pre");
    preElements.forEach((pre) => {
      if (pre.querySelector(".code-header")) return;

      const codeElement = pre.querySelector("code");
      const codeText = codeElement ? codeElement.innerText : pre.innerText;

      const header = document.createElement("div");
      header.className = "code-header";

      const dots = document.createElement("div");
      dots.className = "code-dots";
      dots.innerHTML =
        '<span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="code-lang">Code</span>';

      const copyBtn = document.createElement("button");
      copyBtn.type = "button";
      copyBtn.className = "code-copy-btn";
      copyBtn.innerHTML =
        '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> <span>کپی</span>';

      copyBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(codeText.trim());
        copyBtn.innerHTML =
          '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> <span>کپی شد!</span>';
        copyBtn.classList.add("copied");
        toast.success("کد با موفقیت کپی شد.");
        setTimeout(() => {
          copyBtn.innerHTML =
            '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> <span>کپی</span>';
          copyBtn.classList.remove("copied");
        }, 2200);
      });

      header.appendChild(dots);
      header.appendChild(copyBtn);
      pre.insertBefore(header, pre.firstChild);
    });
  }, [article?.description, contentRef]);

  const handleToggleLike = () => {
    if (!articleId) return;

    const updatedList = toggleLikeArticle(articleId);
    const nowLiked = updatedList.includes(String(articleId));
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
    toast.success("لینک مقاله در کلیپ‌بورد کپی شد!");
    setTimeout(() => setCopied(false), 2500);
  };

  // استخراج فرمول‌های ریاضی و آماده‌سازی محتوا
  const formattedHtml = article?.description
    ? article.description.replace(
        /\$([^$]+)\$/g,
        '<span class="math-formula">$1</span>'
      )
    : "";

  return (
    <article className={styles.articleContainer}>
      <h1>{article?.title}</h1>

      <div className={styles.meta}>
        <p style={{ opacity: "0.85" }}>{article?.author}</p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: "1rem",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <p style={{ opacity: "0.85" }}>
            {article?.tags?.split(",").map((tag, index, array) => {
              const trimmedTag = tag.trim();
              return (
                <span key={index}>
                  <Link
                    to={`/articles?tag=${encodeURIComponent(trimmedTag)}`}
                    className={styles.tech}
                  >
                    {trimmedTag}
                  </Link>
                  {index < array.length - 1 && " ، "}
                </span>
              );
            })}
          </p>
          {article?.createdAt && (
            <p
              style={{
                borderRight: "1px solid rgba(0, 0, 0, 0.2)",
                paddingRight: "8px",
                marginRight: "4px",
                opacity: "0.85",
              }}
            >
              {formatPersianDate(article.createdAt)}
            </p>
          )}
        </div>
      </div>

      <div className={styles.detail}>
        {article?.image && (
          <div className={styles.imageContainer}>
            <img
              src={article.image}
              alt={article.title}
              className={styles.image}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/banner.png";
              }}
            />
          </div>
        )}

        <div className={styles.contentWrapper}>
          <section
            ref={contentRef}
            className={`${styles.content} article-content`}
            dangerouslySetInnerHTML={{ __html: formattedHtml }}
          />

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
              aria-label="کپی لینک مقاله"
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

      {/* بخش نظرات مقاله در صورت وجود در mockData */}
      {article?.comments && article.comments.length > 0 && (
        <section className={styles.commentsSection}>
          <h3>نظرات کاربران ({e2p(article.comments.length)})</h3>
          {article.comments.map((comment) => (
            <div key={comment._id} className={styles.commentBox}>
              <div>
                <span className={styles.commentName}>{comment.name}</span>
                <span className={styles.commentDate}>
                  {formatPersianDate(comment.posted_at)}
                </span>
              </div>
              <p className={styles.commentContent}>{comment.content}</p>
            </div>
          ))}
        </section>
      )}
    </article>
  );
}

export default ArticleContent;
