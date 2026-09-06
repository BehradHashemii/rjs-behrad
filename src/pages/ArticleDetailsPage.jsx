import { useMemo, useRef } from "react";
import { Link, useParams } from "react-router-dom";

import ArticleRelated from "./ArticleRelated";
import ArticleContent from "./ArticleContent";
import { articles } from "../data/mockData.json";
import styles from "./ArticleDetailsPage.module.css";
import Breadcrumb from "../components/Breadcrumb";

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

  const tags = Array.isArray(article?.tags)
    ? article.tags
    : article?.tags
        ?.split(",")
        .map((t) => t.trim())
        .filter(Boolean) || [];

  const breadcrumbItems = [
    { label: "خانه", link: "/" },
    { label: "مقالات", link: "/articles" },
    ...(tags.length > 0
      ? [
          {
            label: (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {tags.map((tag, index) => (
                  <span key={tag}>
                    <Link
                      to={`/articles?tag=${encodeURIComponent(tag)}`}
                      className={styles.tech}
                    >
                      {tag}
                    </Link>
                    {index < tags.length - 1 && "، "}
                  </span>
                ))}
              </span>
            ),
          },
        ]
      : []),
    { label: article?.title },
  ];

  return (
    <div className={styles.container}>
      <Breadcrumb items={breadcrumbItems} />
      <div className={styles.container}>
        <ArticleContent
          article={article}
          styles={styles}
          contentRef={contentRef}
        />
        <ArticleRelated relatedArticles={relatedArticles} styles={styles} />
      </div>
    </div>
  );
}

export default ArticleDetailsPage;
