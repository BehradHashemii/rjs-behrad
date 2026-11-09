import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaCopy,
  FaHeart,
  FaRegHeart,
  FaCheck,
  FaCalendarAlt,
  FaShareAlt,
  FaArrowRight,
} from "react-icons/fa";
import {
  IoSparklesOutline,
  IoPersonOutline,
  IoBulbOutline,
  IoHardwareChipOutline,
} from "react-icons/io5";
import { toast } from "react-toastify";
import formatPersianDate from "../utils/formatPersianDate";
import e2p from "../utils/persianNumber";
import { isPromptLiked, toggleLikePrompt } from "../utils/storage";

function PromptContent({ prompt, styles, contentRef }) {
  const promptId = prompt?.id ?? prompt?._id;

  const [isLiked, setIsLiked] = useState(() =>
    typeof isPromptLiked === "function" ? isPromptLiked(promptId) : false,
  );
  const [isPromptCopied, setIsPromptCopied] = useState(false);
  const [likesCount, setLikesCount] = useState(
    () => Number(prompt?.likes) || 0,
  );

  useEffect(() => {
    const handleLikedChange = (e) => {
      if (e?.detail?.promptId) {
        if (String(e.detail.promptId) === String(promptId)) {
          setIsLiked(isPromptLiked(promptId));
        }
      } else {
        if (typeof isPromptLiked === "function") {
          setIsLiked(isPromptLiked(promptId));
        }
      }
    };

    window.addEventListener("prompt-liked-change", handleLikedChange);
    return () => {
      window.removeEventListener("prompt-liked-change", handleLikedChange);
    };
  }, [promptId]);

  const handleToggleLike = () => {
    if (!promptId) return;

    if (typeof toggleLikePrompt === "function") {
      const updatedList = toggleLikePrompt(promptId);
      const likedState = updatedList.includes(promptId);
      setIsLiked(likedState);
      setLikesCount((prev) => (likedState ? prev + 1 : Math.max(0, prev - 1)));

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
    toast.success("لینک صفحه پرامپت کپی شد!");
  };

  // کپی متن اصلی پرامپت
  const copyPromptText = async () => {
    if (!prompt?.prompt) return;
    try {
      await navigator.clipboard.writeText(prompt.prompt);
      setIsPromptCopied(true);
      toast.success("متن کامل پرامپت کپی شد!");
      setTimeout(() => setIsPromptCopied(false), 2500);
    } catch {
      toast.error("خطا در کپی پرامپت");
    }
  };

  const handleImgError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = "/banner.png";
  };

  const toolName = (prompt?.tool || "ai").toLowerCase();

  const tags = Array.isArray(prompt?.tags)
    ? prompt.tags
    : typeof prompt?.tags === "string"
      ? prompt.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

  const typeLabels = {
    "text-to-image": "تولید تصویر (Text to Image)",
    "text-to-code": "برنامه‌نویسی و کد (Text to Code)",
    "text-to-text": "تولید محتوا و متن (Text to Text)",
  };

  return (
    <article className={styles.articleContainer}>
      {/* هدر بالایی کارت پرامپت */}
      <header className={styles.promptHeader}>
        <div className={styles.badgeGroup}>
          {prompt.tool && (
            <span className={`${styles.toolBadge} ${styles[toolName] || ""}`}>
              <IoSparklesOutline />
              {prompt.tool.toUpperCase()}
            </span>
          )}

          {prompt.niche && (
            <Link
              to={`/prompts?niche=${encodeURIComponent(prompt.niche)}`}
              className={styles.nicheBadge}
            >
              {prompt.niche}
            </Link>
          )}

          {prompt.type && (
            <span className={styles.typeBadge}>
              {typeLabels[prompt.type] || prompt.type}
            </span>
          )}

          {prompt.aspectRatio && prompt.aspectRatio !== "text" && (
            <span className={styles.aspectBadge}>
              ابعاد: {prompt.aspectRatio}
            </span>
          )}
        </div>

        <h1 className={styles.title}>{prompt.title}</h1>

        <div className={styles.metaBar}>
          <div className={styles.metaItem}>
            <IoPersonOutline />
            <span>{prompt.author || "بهراد هاشمی"}</span>
          </div>

          {prompt.createdAt && (
            <div className={styles.metaItem}>
              <FaCalendarAlt />
              <span>{formatPersianDate(prompt.createdAt)}</span>
            </div>
          )}

          <div className={styles.metaItem}>
            <FaHeart className={isLiked ? styles.heartActive : ""} />
            <span>{e2p(likesCount)} علاقه‌مند</span>
          </div>
        </div>
      </header>

      {/* تصویر نمونه خروجی پرامپت */}
      {prompt.image && (
        <div className={styles.imageContainer}>
          <img
            src={prompt.image}
            alt={prompt.title}
            className={styles.image}
            onError={handleImgError}
          />
          <div className={styles.imageOverlayBadge}>
            <IoSparklesOutline />
            <span>پیش‌نمایش خروجی هوش مصنوعی</span>
          </div>
        </div>
      )}

      {/* پنجره کد ترمینال پرامپت (macOS Terminal Style) */}
      <div className={styles.terminalContainer}>
        <div className={styles.terminalBar}>
          <div className={styles.terminalDots}>
            <span className={styles.dotClose}></span>
            <span className={styles.dotMinimize}></span>
            <span className={styles.dotMaximize}></span>
          </div>

          <span className={styles.terminalTitle}>فرمان پرامپت (Prompt Text)</span>

          <button
            type="button"
            onClick={copyPromptText}
            className={`${styles.copyPromptBtn} ${isPromptCopied ? styles.copied : ""}`}
            title="کپی کردن متن پرامپت در کلیپ‌بورد"
          >
            {isPromptCopied ? <FaCheck /> : <FaCopy />}
            <span>{isPromptCopied ? "کپی شد" : "کپی پرامپت"}</span>
          </button>
        </div>

        <div className={styles.terminalBody}>
          <pre ref={contentRef} className={styles.promptCodeBlock} dir="ltr">
            <code>{prompt.prompt}</code>
          </pre>
        </div>
      </div>

      {/* مشخصات فنی و پارامترهای پرامپت */}
      <section className={styles.specsCard}>
        <h3 className={styles.specsTitle}>
          <IoHardwareChipOutline />
          <span>مشخصات فنی و پارامترها</span>
        </h3>

        <div className={styles.specsGrid}>
          <div className={styles.specItem}>
            <span className={styles.specLabel}>ابزار هوش مصنوعی:</span>
            <span className={styles.specValue} style={{ textTransform: "capitalize" }}>
              {prompt.tool || "—"}
            </span>
          </div>

          <div className={styles.specItem}>
            <span className={styles.specLabel}>نوع پردازش:</span>
            <span className={styles.specValue}>
              {typeLabels[prompt.type] || prompt.type || "—"}
            </span>
          </div>

          <div className={styles.specItem}>
            <span className={styles.specLabel}>نسبت ابعاد (Aspect Ratio):</span>
            <span className={styles.specValue} dir="ltr">
              {prompt.aspectRatio || "پیش‌فرض"}
            </span>
          </div>

          <div className={styles.specItem}>
            <span className={styles.specLabel}>حوزه موضوعی:</span>
            <span className={styles.specValue}>{prompt.niche || "—"}</span>
          </div>
        </div>

        {tags.length > 0 && (
          <div className={styles.tagsWrapper}>
            <span className={styles.tagsLabel}>برچسب‌ها:</span>
            <div className={styles.tagsList}>
              {tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/prompts?search=${encodeURIComponent(tag)}`}
                  className={styles.tagItem}
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* نکات و راهنمای استفاده */}
      {prompt.tips && (
        <section className={styles.tipsBox}>
          <div className={styles.tipsHeader}>
            <IoBulbOutline />
            <h4>نکات طلایی و راهنمای اجرا</h4>
          </div>
          <p>{prompt.tips}</p>
        </section>
      )}

      {/* نوار دکمه‌های اکشن و تعاملی */}
      <footer className={styles.actionsBar}>
        <button
          type="button"
          onClick={handleToggleLike}
          className={`${styles.actionBtn} ${isLiked ? styles.likedBtn : styles.notLikedBtn}`}
          aria-label={isLiked ? "حذف از پسندیده‌ها" : "پسندیدن پرامپت"}
        >
          {isLiked ? <FaHeart /> : <FaRegHeart />}
          <span>{isLiked ? "پسندیده شد" : "پسندیدن پرامپت"}</span>
        </button>

        <button
          type="button"
          onClick={copyPageLink}
          className={`${styles.actionBtn} ${styles.shareBtn}`}
          title="کپی لینک اختصاصی این پرامپت"
        >
          <FaShareAlt />
          <span>اشتراک‌گذاری لینک</span>
        </button>

        <Link to="/prompts" className={`${styles.actionBtn} ${styles.backBtn}`}>
          <FaArrowRight />
          <span>بازگشت به پرامپت‌ها</span>
        </Link>
      </footer>
    </article>
  );
}

export default PromptContent;
