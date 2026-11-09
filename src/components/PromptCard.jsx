import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaCalendarAlt,
  FaHeart,
  FaRegHeart,
  FaCopy,
  FaCheck,
} from "react-icons/fa";
import { IoPersonOutline, IoSparklesOutline } from "react-icons/io5";
import { FiArrowUpLeft } from "react-icons/fi";

import styles from "./PromptCard.module.css";
import formatPersianDate from "../utils/formatPersianDate";
import { isPromptLiked, toggleLikePrompt } from "../utils/storage";

function PromptCard({ data, prompt: promptProp }) {
  const prompt = data || promptProp;
  const promptId = prompt?.id ?? prompt?._id;

  const [isLiked, setIsLiked] = useState(() =>
    typeof isPromptLiked === "function" ? isPromptLiked(promptId) : false,
  );
  const [isCopied, setIsCopied] = useState(false);

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

  if (!prompt) return null;

  const handleToggleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!promptId) return;

    if (typeof toggleLikePrompt === "function") {
      const updatedList = toggleLikePrompt(promptId);
      const nowLiked = updatedList.includes(promptId);
      setIsLiked(nowLiked);

      if (nowLiked) {
        toast.success("پرامپت به علاقه‌مندی‌ها اضافه شد.");
      } else {
        toast.info("پرامپت از علاقه‌مندی‌ها حذف شد.");
      }
    } else {
      setIsLiked((prev) => !prev);
    }
  };

  const handleCopyPrompt = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!prompt?.prompt) return;

    try {
      await navigator.clipboard.writeText(prompt.prompt);
      setIsCopied(true);
      toast.success("متن پرامپت کپی شد!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast.error("خطا در کپی پرامپت");
    }
  };

  const handleImgError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = "/banner.png";
  };

  const cleanPromptText = prompt?.prompt
    ? prompt.prompt
        .replace(/<[^>]*>?/gm, " ")
        .replace(/\s+/g, " ")
        .trim()
    : "";

  const toolName = (prompt?.tool || "AI").toLowerCase();

  return (
    <article className={styles.cardContainer}>
      <div className={styles.card}>
        {/* تصویر پیش‌نمایش خروجی پرامپت */}
        <Link
          to={`/prompts/${prompt.slug || promptId}`}
          className={styles.imageLink}
        >
          <div className={styles.imageWrapper}>
            <img
              src={prompt.image || "/banner.png"}
              alt={prompt.title}
              className={styles.image}
              loading="lazy"
              onError={handleImgError}
            />

            <button
              type="button"
              className={`${styles.likeBtn} ${isLiked ? styles.liked : ""}`}
              onClick={handleToggleLike}
              aria-label={isLiked ? "حذف از پسندها" : "پسندیدن پرامپت"}
              title={isLiked ? "حذف از پسندها" : "پسندیدن پرامپت"}
            >
              {isLiked ? <FaHeart /> : <FaRegHeart />}
            </button>

            {prompt.tool && (
              <span className={`${styles.toolBadge} ${styles[toolName] || ""}`}>
                <IoSparklesOutline />
                {prompt.tool.toUpperCase()}
              </span>
            )}
          </div>
        </Link>

        {/* محتوای متنی کارت */}
        <div className={styles.content}>
          <div className={styles.headerRow}>
            {prompt.niche && (
              <span className={styles.nicheBadge}>{prompt.niche}</span>
            )}
            {prompt.aspectRatio && prompt.aspectRatio !== "text" && (
              <span className={styles.aspectBadge}>
                ابعاد: {prompt.aspectRatio}
              </span>
            )}
          </div>

          <Link
            to={`/prompts/${prompt.slug || promptId}`}
            className={styles.titleLink}
          >
            <h3 className={styles.title} title={prompt.title}>
              {prompt.title}
            </h3>
          </Link>

          <p className={styles.desc} dir="ltr">
            {cleanPromptText}
          </p>

          <div className={styles.footer}>
            <div className={styles.info}>
              {prompt.author && (
                <p>
                  <IoPersonOutline />
                  <span>{prompt.author}</span>
                </p>
              )}
              {prompt.createdAt && (
                <p>
                  <FaCalendarAlt />
                  <span>{formatPersianDate(prompt.createdAt)}</span>
                </p>
              )}
            </div>

            <div className={styles.actions}>
              <button
                type="button"
                className={`${styles.copyBtn} ${isCopied ? styles.copied : ""}`}
                onClick={handleCopyPrompt}
                title="کپی کردن متن پرامپت"
              >
                {isCopied ? <FaCheck /> : <FaCopy />}
                <span>{isCopied ? "کپی شد" : "کپی"}</span>
              </button>

              <Link
                to={`/prompts/${prompt.slug || promptId}`}
                className={styles.viewBtn}
              >
                <span>مشاهده</span>
                <FiArrowUpLeft />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default PromptCard;
