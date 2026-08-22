import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import ArticleRelated from "./ArticleRelated";
import ArticleContent from "./ArticleContent";
import Loading from "../components/Loading";
import api from "../utils/axiosInstance"; // ارتباط با بک‌اند اضافه شد

import styles from "./ArticleDetailsPage.module.css";

function ArticleDetailsPage() {
  // این slug در واقع همون آیدی مونگو دی‌بی هست که از url میگیریم
  const { slug } = useParams();

  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const contentRef = useRef(null);

  useEffect(() => {
    const fetchArticleData = async () => {
      setIsLoading(true);
      try {
        // گرفتن کل مقالات از بک‌اند
        const response = await api.get("/articles");

        // تطبیق دیتای سرور با ساختاری که کامپوننت‌های تو نیاز دارن
        const formattedArticles = response.data.map((item) => ({
          ...item,
          id: item._id,
          date: item.createdAt,
          description: item.content, // محتوا رو میریزیم تو description
          image: item.coverImage,
          tags: item.tags || "عمومی",
          slug: item._id, // آیدی رو به عنوان اسلاگ استفاده می‌کنیم
          author: "بهراد هاشمی", // فعلا نام رو دستی میدیم
        }));

        // پیدا کردن مقاله فعلی بر اساس آیدی (slug)
        const foundArticle = formattedArticles.find(
          (item) => item.slug === slug,
        );

        if (!foundArticle) {
          setArticle(null);
          setRelatedArticles([]);
          setIsLoading(false);
          return;
        }

        // استخراج تگ‌ها برای پیدا کردن مقالات مرتبط
        const currentTags =
          foundArticle.tags
            ?.split(",")
            .map((tag) => tag.trim())
            .filter(Boolean) || [];

        // پیدا کردن ۴ مقاله مرتبط
        const related = formattedArticles
          .filter((item) => {
            if (item.id === foundArticle.id) return false;

            const articleTags =
              item.tags
                ?.split(",")
                .map((tag) => tag.trim())
                .filter(Boolean) || [];

            return articleTags.some((tag) => currentTags.includes(tag));
          })
          .slice(0, 4);

        setArticle(foundArticle);
        setRelatedArticles(related);
      } catch (error) {
        console.error("خطا در دریافت اطلاعات مقاله:", error);
        setArticle(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticleData();
  }, [slug]); // هر بار که روی مقاله مرتبط کلیک بشه و slug عوض بشه، دیتا آپدیت میشه

  if (isLoading) {
    return <Loading />;
  }

  if (!article) {
    return (
      <div className={styles.container}>
        <p style={{ textAlign: "center", marginTop: "50px" }}>
          مقاله مورد نظر پیدا نشد.
        </p>
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
