import formatPersianDate from "../utils/formatPersianDate";

function ArticleRelated({ styles, relatedArticles }) {
  return (
    <aside className={styles.sidebar}>
      <h3>مقالات مرتبط</h3>
      {relatedArticles.length > 0 ? (
        <div className={styles.relatedList}>
          {relatedArticles.map((rel) => (
            <a
              href={`/articles/${rel.slug}`}
              key={rel.slug}
              className={`${styles.relatedCard} glassBG`}
            >
              <img
                src={rel.image}
                alt={rel.title}
                className={styles.relatedImg}
              />
              <div className={styles.relatedInfo}>
                <h4>{rel.title}</h4>
                <span>{formatPersianDate(rel.date)}</span>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <p className={styles.noRelated}>مقاله مرتبطی یافت نشد.</p>
      )}
    </aside>
  );
}

export default ArticleRelated;
