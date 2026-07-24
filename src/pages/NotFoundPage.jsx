import { Link } from "react-router-dom";
import { FaHome, FaFolderOpen, FaEnvelope, FaExclamationTriangle } from "react-icons/fa";
import ScrollReveal from "../components/ScrollReveal";
import e2p from "../utils/persianNumber";
import styles from "./NotFoundPage.module.css";

function NotFoundPage() {
  return (
    <main className={styles.notFoundContainer}>
      <ScrollReveal direction="up" delay={50}>
        <div className={`${styles.card} glassBG`}>
          <div className={styles.badge}>
            <FaExclamationTriangle className={styles.warningIcon} />
            <span>خطای آدرس یا صفحه</span>
          </div>

          <h1 className={styles.codeText}>{e2p("404")}</h1>

          <h2 className={styles.title}>صفحه مورد نظر یافت نشد!</h2>

          <p className={styles.description}>
            آدرسی که وارد کرده‌اید اشتباه است، منتقل شده یا ممکن است کلا وجود نداشته باشد.
            می‌توانید از طریق لینک‌های زیر به بخش‌های اصلی وب‌سایت بازگردید.
          </p>

          <div className={styles.actionsRow}>
            <Link to="/" className={styles.primaryBtn}>
              <FaHome />
              <span>بازگشت به صفحه اصلی</span>
            </Link>

            <Link to="/portfolios" className={styles.secondaryBtn}>
              <FaFolderOpen />
              <span>مشاهده نمونه‌کارها</span>
            </Link>

            <Link to="/contact-us" className={styles.outlineBtn}>
              <FaEnvelope />
              <span>ارتباط و تماس</span>
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </main>
  );
}

export default NotFoundPage;
