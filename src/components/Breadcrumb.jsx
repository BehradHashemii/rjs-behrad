import { Link } from "react-router-dom";
import styles from "./Breadcrumb.module.css";

function Breadcrumb({ items }) {
  return (
    <nav aria-label="breadcrumb" className={styles.breadcrumbNav} dir="rtl">
      <ol className={styles.breadcrumbList}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className={styles.breadcrumbItem}>
              {isLast || !item.link ? (
                <span className={styles.current} aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link to={item.link} className={styles.link}>
                  {item.label}
                </Link>
              )}

              {!isLast && (
                <svg
                  className={styles.separatorIcon}
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
