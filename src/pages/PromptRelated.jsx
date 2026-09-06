import formatPersianDate from "../utils/formatPersianDate";

function PromptRelated({ styles, relatedPrompts }) {
  return (
    <aside className={styles.sidebar}>
      <h3>پرامپت‌های مرتبط</h3>
      {relatedPrompts.length > 0 ? (
        <div className={styles.relatedList}>
          {relatedPrompts.map((rel) => (
            <a
              href={`/prompts/${rel.slug || rel.id}`}
              key={rel.id}
              className={`${styles.relatedCard} glassBG`}
            >
              {rel.image && (
                <img
                  src={rel.image}
                  alt={rel.title}
                  className={styles.relatedImg}
                />
              )}
              <div className={styles.relatedInfo}>
                <h4>{rel.title}</h4>
                <span>
                  {rel.createdAt ? formatPersianDate(rel.createdAt) : rel.tool}
                </span>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <p className={styles.noRelated}>پرامپت مرتبطی یافت نشد.</p>
      )}
    </aside>
  );
}

export default PromptRelated;
