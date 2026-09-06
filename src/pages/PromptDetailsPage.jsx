import { useMemo, useRef } from "react";
import { useParams } from "react-router-dom";

import PromptRelated from "./PromptRelated.jsx";
import PromptContent from "./PromptContent";
import promptsData from "../data/prompts.json";
import styles from "./PromptDetailsPage.module.css";

function PromptDetailsPage() {
  const { slug } = useParams();
  const contentRef = useRef(null);

  // پیدا کردن پرامپت فعلی بر اساس slug یا id
  const prompt = useMemo(() => {
    return promptsData.find(
      (item) => item.slug === slug || String(item.id) === String(slug),
    );
  }, [slug]);

  // پرامپت‌های مرتبط (بر اساس tool یا type یکسان)
  const relatedPrompts = useMemo(() => {
    if (!prompt) return [];

    return promptsData
      .filter((item) => {
        if (item.id === prompt.id) return false;
        const isSameTool = item.tool && item.tool === prompt.tool;
        const isSameType = item.type && item.type === prompt.type;
        return isSameTool || isSameType;
      })
      .slice(0, 4);
  }, [prompt]);

  if (!prompt) {
    return (
      <div className={styles.notFound}>
        <h2>یافت نشد</h2>
        <p>پرامپت مورد نظر پیدا نشد.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <PromptContent prompt={prompt} styles={styles} contentRef={contentRef} />
      <PromptRelated relatedPrompts={relatedPrompts} styles={styles} />
    </div>
  );
}

export default PromptDetailsPage;
