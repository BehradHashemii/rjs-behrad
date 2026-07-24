import { Link } from "react-router-dom";
import { FaPaperPlane, FaFolderOpen } from "react-icons/fa";
import styles from "./CTASection.module.css";

function CTASection() {
  return (
    <section className={`${styles.ctaContainer} glassBG`}>
      <div className={styles.content}>
        <span className={styles.badge}>فرصت‌های جدید برای همکاری</span>
        <h2 className={styles.title}>آیا پروژه‌ای در ذهن دارید یا نیازمند توسعه‌دهنده هستید؟</h2>
        <p className={styles.description}>
          آماده دریافت ایده‌های جدید، همفکری و پیاده‌سازی وب‌سایت‌های مدرن و سفارشی شما هستم.
        </p>

        <div className={styles.buttons}>
          <Link to="/contact-us" className={styles.primaryBtn}>
            <FaPaperPlane />
            <span>شروع گفتگو و تماس</span>
          </Link>

          <Link to="/portfolios" className={styles.secondaryBtn}>
            <FaFolderOpen />
            <span>مشاهده همه نمونه‌کارها</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
