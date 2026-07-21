import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import ArticleRelated from "./ArticleRelated";
import ArticleContent from "./ArticleContent";
import Loading from "../components/Loading";

import articlesData from "../data/mockData.json";

import styles from "./ArticleDetailsPage.module.css";

function ArticleDetailsPage() {
  const { slug } = useParams();

  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const contentRef = useRef(null);

  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      const articles = articlesData.articles || [];

      const foundArticle = articles.find(
        (item) => item.slug === slug,
      );

      if (!foundArticle) {
        setArticle(null);
        setRelatedArticles([]);
        setIsLoading(false);
        return;
      }

      const currentTags =
        foundArticle.tags
          ?.split(",")
          .map((tag) => tag.trim())
          .filter(Boolean) || [];

      const related = articles
        .filter((item) => {
          if (item.id === foundArticle.id) return false;

          const articleTags =
            item.tags
              ?.split(",")
              .map((tag) => tag.trim())
              .filter(Boolean) || [];

          return articleTags.some((tag) =>
            currentTags.includes(tag),
          );
        })
        .slice(0, 4);

      setArticle(foundArticle);
      setRelatedArticles(related);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [slug]);

  if (isLoading) {
    return <Loading />;
  }

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

      <ArticleRelated
        relatedArticles={relatedArticles}
        styles={styles}
      />
    </div>
  );
}

export default ArticleDetailsPage;