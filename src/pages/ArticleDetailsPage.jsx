import { useMemo, useRef } from "react";
import { useParams } from "react-router-dom";

import ArticleRelated from "./ArticleRelated";
import ArticleContent from "./ArticleContent";
import { articles } from "../data/mockData.json";
import styles from "./ArticleDetailsPage.module.css";

function ArticleDetailsPage() {
  const { slug } = useParams();
  const contentRef = useRef(null);

  // پیدا کردن مقاله فعلی بر اساس slug
  const article = useMemo(() => {
    return articles.find((item) => item.slug === slug);
  }, [slug]);

  // استخراج هوشمند مقالات مرتبط
  const relatedArticles = useMemo(() => {
    if (!article || !article.tags) return [];

    const currentTags = article.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    return articles
      .filter((item) => {
        // اصلاح کلید: _id به جای id
        if (item._id === article._id) return false;

        const itemTags =
          item.tags
            ?.split(",")
            .map((t) => t.trim())
            .filter(Boolean) || [];

        return itemTags.some((tag) => currentTags.includes(tag));
      })
      .slice(0, 4);
  }, [article]);

  if (!article) {
    return (
      <div className={styles.container}>
        <p>مقاله مورد نظر پیدا نشد.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <ArticleContent
        article={article}
        styles={styles}
        contentRef={contentRef}
      />
      <ArticleRelated relatedArticles={relatedArticles} styles={styles} />
    </div>
  );
}

export default ArticleDetailsPage;