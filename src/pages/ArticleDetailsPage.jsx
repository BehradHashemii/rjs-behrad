import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import ArticleRelated from "./ArticleRelated";
import ArticleContent from "./ArticleContent";
import Loading from "../components/Loading";

import { getArticlesFromFirestore } from "../services/firestoreService";

import styles from "./ArticleDetailsPage.module.css";

function ArticleDetailsPage() {
  const { slug } = useParams();
  const contentRef = useRef(null);

  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const data = await getArticlesFromFirestore();
      setArticles(data);
      setIsLoading(false);
    }
    loadData();
  }, [slug]);

  if (isLoading) {
    return <Loading />;
  }

  const article = articles.find((item) => item.slug === slug || String(item.id) === slug) || null;


  const currentTags =
    article?.tags
      ?.split(",")
      .map((tag) => tag.trim())
      .filter(Boolean) || [];

  const relatedArticles = article
    ? articles
        .filter((item) => {
          if (item.id === article.id) return false;

          const articleTags =
            item.tags
              ?.split(",")
              .map((tag) => tag.trim())
              .filter(Boolean) || [];

          return articleTags.some((tag) => currentTags.includes(tag));
        })
        .slice(0, 4)
    : [];

  if (!article) {
    return <p>مقاله مورد نظر پیدا نشد.</p>;
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
