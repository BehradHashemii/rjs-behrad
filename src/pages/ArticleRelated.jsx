import { Link } from "react-router-dom";
import formatPersianDate from "../utils/formatPersianDate";

function ArticleRelated({ styles, relatedArticles }) {
  return (
    <aside className={styles.sidebar}>
      <h3>مقالات مرتبط</h3>
      {relatedArticles.length > 0 ? (
        <div className={styles.relatedList}>
          {relatedArticles.map((rel) => (
            <Link
              to={`/articles/${rel.slug}`}
              key={rel.slug}
              className={`${styles.relatedCard} glassBG`}
            >
              <img
                src={rel.image || "/banner.png"}
                alt={rel.title}
                className={styles.relatedImg}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/banner.png";
                }}
              />
              <div className={styles.relatedInfo}>
                <h4>{rel.title}</h4>
                <span>{formatPersianDate(rel.createdAt)}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className={styles.noRelated}>مقاله مرتبطی یافت نشد.</p>
      )}
    </aside>
  );
}

export default ArticleRelated;
