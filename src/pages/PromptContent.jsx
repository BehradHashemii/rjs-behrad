import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaCopy, FaHeart, FaRegHeart, FaCheck } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import formatPersianDate from "../utils/formatPersianDate";
import { isPromptLiked, toggleLikePrompt } from "../utils/storage";

function PromptContent({ prompt, styles, contentRef }) {
  const [isLiked, setIsLiked] = useState(() =>
    typeof isPromptLiked === "function" ? isPromptLiked(prompt?.id) : false,
  );
  const [isPromptCopied, setIsPromptCopied] = useState(false);

  useEffect(() => {
    const handleLikedChange = () => {
      if (typeof isPromptLiked === "function") {
        setIsLiked(isPromptLiked(prompt?.id));
      }
    };

    window.addEventListener("prompt-liked-change", handleLikedChange);
    return () => {
      window.removeEventListener("prompt-liked-change", handleLikedChange);
    };
  }, [prompt?.id]);

  const handleToggleLike = () => {
    if (!prompt?.id) return;
    if (typeof toggleLikePrompt === "function") {
      const updatedList = toggleLikePrompt(prompt.id);
      const likedState = updatedList.includes(prompt.id);
      setIsLiked(likedState);
      toast.info(
        likedState
          ? "پرامپت با موفقیت به علاقه‌مندی‌ها اضافه شد."
          : "پرامپت از علاقه‌مندی‌ها حذف شد.",
      );
    } else {
      setIsLiked((prev) => !prev);
    }
  };

  // کپی لینک صفحه
  const copyPageLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("لینک صفحه کپی شد!");
  };

  // کپی متن اصلی پرامپت
  const copyPromptText = async () => {
    if (!prompt?.prompt) return;
    try {
      await navigator.clipboard.writeText(prompt.prompt);
      setIsPromptCopied(true);
      toast.success("متن پرامپت کپی شد!");
      setTimeout(() => setIsPromptCopied(false), 2500);
    } catch (err) {
      toast.error("خطا در کپی پرامپت");
    }
  };

  return (
    <article className={styles.articleContainer}>
      <h1>{prompt?.title}</h1>

      {/* بخش متادیتا و جزئیات انتشار */}
      <div className={styles.meta}>
        <p style={{ opacity: "0.8" }}>{prompt?.author}</p>
        <div
          style={{ display: "flex", alignItems: "center", fontSize: "1rem" }}
        >
          <p style={{ opacity: "0.8" }}>
            {prompt?.tool && (
              <a href={`/prompts?tool=${encodeURIComponent(prompt.tool)}`}>
                {prompt.tool}
              </a>
            )}
            {prompt?.type && <span> \، {prompt.type}</span>}
          </p>
          {prompt?.createdAt && (
            <p
              style={{
                borderRight: "0.5px solid #000000cc",
                paddingRight: "6px",
                marginRight: "6px",
                opacity: "0.8",
              }}
            >
              {formatPersianDate(prompt.createdAt)}
            </p>
          )}
        </div>
      </div>

      <div className={styles.detail}>
        {/* تصویر رندر یا خروجی پرامپت */}
        {prompt?.image && (
          <div className={styles.imageContainer}>
            <img
              src={prompt.image}
              alt={prompt.title}
              className={styles.image}
            />
          </div>
        )}

        <div className={styles.contentWrapper}>
          {/* مشخصات فنی پرامپت */}
          <div className={styles.specsWrapper}>
            {prompt.tool && (
              <span className={styles.specBadge}>
                <strong>ابزار:</strong> {prompt.tool}
              </span>
            )}
            {prompt.type && (
              <span className={styles.specBadge}>
                <strong>نوع:</strong> {prompt.type}
              </span>
            )}
            {prompt.aspectRatio && (
              <span className={styles.specBadge}>
                <strong>نسبت ابعاد:</strong> {prompt.aspectRatio}
              </span>
            )}
            {prompt.niche && (
              <span className={styles.specBadge}>
                <strong>حوزه:</strong> {prompt.niche}
              </span>
            )}
          </div>

          {/* کادر متن اصلی پرامپت */}
          <div className={styles.promptContainer}>
            <div className={styles.promptBar}>
              <span>فرمان (Prompt Text)</span>
              <button
                type="button"
                onClick={copyPromptText}
                className={styles.copyPromptBtn}
              >
                {isPromptCopied ? <FaCheck /> : <FaCopy />}
                <span>{isPromptCopied ? "کپی شد" : "کپی متن پرامپت"}</span>
              </button>
            </div>
            <pre ref={contentRef} className={styles.promptCodeBlock} dir="ltr">
              <code>{prompt.prompt}</code>
            </pre>
          </div>

          {/* نکات کمکی */}
          {prompt.tips && (
            <div className={styles.tipsBox}>
              <h4>نکات و راهنمای استفاده:</h4>
              <p>{prompt.tips}</p>
            </div>
          )}

          {/* نوار دکمه‌های اکشن */}
          <div className={styles.actions}>
            <button
              onClick={handleToggleLike}
              className={`${isLiked ? styles.favActive : styles.favNotActive} ${styles.actionsBtn}`}
              aria-label={isLiked ? "حذف از پسندیده‌ها" : "پسندیدن پرامپت"}
            >
              {isLiked ? (
                <>
                  <FaHeart />
                  <span>پرامپت پسندیده شد</span>
                </>
              ) : (
                <>
                  <FaRegHeart />
                  <span>پسندیدن پرامپت</span>
                </>
              )}
            </button>

            <button
              onClick={copyPageLink}
              className={`${styles.copyBtn} ${styles.actionsBtn}`}
            >
              <FaCopy />
              <span>کپی لینک</span>
            </button>

            <Link
              to="/prompts"
              className={`${styles.back} ${styles.actionsBtn}`}
            >
              بازگشت به پرامپت‌ها
            </Link>
          </div>
        </div>
      </div>
      <ToastContainer rtl position="top-center" />
    </article>
  );
}

export default PromptContent;
