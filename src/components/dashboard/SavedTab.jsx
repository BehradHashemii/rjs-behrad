import { Link } from "react-router-dom";
import {
  FaBookmark,
  FaHeart,
  FaExternalLinkAlt,
  FaTrash,
  FaArrowLeft,
} from "react-icons/fa";
import styles from "../../pages/DashboardPage.module.css";
import e2p from "../../utils/persianNumber";

export default function SavedTab({
  savedSubTab,
  setSavedSubTab,
  savedPortfolios = [],
  likedArticles = [],
  savedPortfolioItems = [],
  likedArticleItems = [],
  onRemovePortfolio,
  onRemoveArticle,
}) {
  return (
    <div className={styles.tabSection}>
      <div className={styles.sectionHeader}>
        <h2>نشان‌شده‌ها و علاقمندی‌ها</h2>
        <p>
          مدیریت پروژه‌ها و مقالاتی که برای مطالعه یا بررسی بعدی ذخیره کرده‌اید
        </p>
      </div>

      <div className={styles.subTabNav}>
        <button
          type="button"
          className={`${styles.subTabBtn} ${
            savedSubTab === "portfolios" ? styles.subTabActive : ""
          }`}
          onClick={() => setSavedSubTab("portfolios")}
        >
          <FaBookmark />
          <span>
            پروژه‌های نشان‌شده ({e2p(savedPortfolios.length)})
          </span>
        </button>

        <button
          type="button"
          className={`${styles.subTabBtn} ${
            savedSubTab === "articles" ? styles.subTabActive : ""
          }`}
          onClick={() => setSavedSubTab("articles")}
        >
          <FaHeart />
          <span>
            مقالات پسندیده‌شده ({e2p(likedArticles.length)})
          </span>
        </button>
      </div>

      {savedSubTab === "portfolios" && (
        <div className={styles.savedItemsContainer}>
          {savedPortfolioItems.length === 0 ? (
            <div className={styles.emptyState}>
              <FaBookmark className={styles.emptyIcon} />
              <h3>هیچ پروژه‌ای نشان نشده است!</h3>
              <p>
                شما می‌توانید با مراجعه به بخش نمونه‌کارها، پروژه‌های دلخواه
                را ذخیره کنید.
              </p>
              <Link to="/portfolios" className={styles.emptyLinkBtn}>
                مشاهده نمونه‌کارها
              </Link>
            </div>
          ) : (
            <div className={styles.savedGrid}>
              {savedPortfolioItems.map((item) => (
                <div key={item.id} className={styles.savedCard}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className={styles.savedImg}
                  />
                  <div className={styles.savedBody}>
                    <span className={styles.categoryBadge}>
                      {item.category}
                    </span>
                    <h4 className={styles.savedTitle}>{item.title}</h4>
                    <p className={styles.savedDesc}>{item.description}</p>
                    <div className={styles.savedFooter}>
                      <a
                        href={item.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.viewLinkBtn}
                      >
                        <span>مشاهده زنده</span>
                        <FaExternalLinkAlt />
                      </a>
                      <button
                        type="button"
                        className={styles.removeSavedBtn}
                        onClick={() => onRemovePortfolio(item.id)}
                        title="حذف از نشان‌شده‌ها"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {savedSubTab === "articles" && (
        <div className={styles.savedItemsContainer}>
          {likedArticleItems.length === 0 ? (
            <div className={styles.emptyState}>
              <FaHeart className={styles.emptyIcon} />
              <h3>هیچ مقاله‌ای لایک نشده است!</h3>
              <p>
                می‌توانید با مطالعه مقالات وبلاگ، مطالب موردعلاقه خود را لایک
                کنید.
              </p>
              <Link to="/articles" className={styles.emptyLinkBtn}>
                مشاهده وبلاگ و مقالات
              </Link>
            </div>
          ) : (
            <div className={styles.savedGrid}>
              {likedArticleItems.map((article) => (
                <div key={article.id} className={styles.savedCard}>
                  <img
                    src={article.image}
                    alt={article.title}
                    className={styles.savedImg}
                  />
                  <div className={styles.savedBody}>
                    <span className={styles.categoryBadge}>
                      {article.tags || "مقاله"}
                    </span>
                    <h4 className={styles.savedTitle}>{article.title}</h4>
                    <div className={styles.savedFooter}>
                      <Link
                        to={`/articles/${article.slug}`}
                        className={styles.viewLinkBtn}
                      >
                        <span>مطالعه مقاله</span>
                        <FaArrowLeft />
                      </Link>
                      <button
                        type="button"
                        className={styles.removeSavedBtn}
                        onClick={() => onRemoveArticle(article.id)}
                        title="حذف از پسندیده‌شده‌ها"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
