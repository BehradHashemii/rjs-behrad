import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaTelegramPlane,
  FaGithub,
  FaLinkedinIn,
  FaEnvelope,
  FaPhoneAlt,
  FaArrowUp,
  FaHeart,
} from "react-icons/fa";
import e2p from "../utils/persianNumber";
import styles from "./Footer.module.css";

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className={`${styles.footer} glassBG`}>
      <div className={styles.footerContainer}>
        {/* Brand & About */}
        <div className={styles.brand}>
          <Link to="/" className={styles.logoLink}>
            <h2 className={styles.logoText}>
              بهـــــراد<span className={styles.logoDot}>.</span>
            </h2>
          </Link>

          <p className={styles.brandDesc}>
            توسعه‌دهنده فرانت‌اند و عاشق خلق رابط‌های کاربری مدرن، سریع و کاربرپسند با جدیدترین تکنولوژی‌های وب.
          </p>

          <div className={styles.socials}>
            <a
              href="https://instagram.com/behradhashemii"
              target="_blank"
              rel="noreferrer"
              aria-label="اینستاگرام"
              title="اینستاگرام"
              className={styles.socialBtn}
            >
              <FaInstagram />
            </a>

            <a
              href="https://t.me/behradhashemii"
              target="_blank"
              rel="noreferrer"
              aria-label="تلگرام"
              title="تلگرام"
              className={styles.socialBtn}
            >
              <FaTelegramPlane />
            </a>

            <a
              href="https://github.com/BehradHashemii"
              target="_blank"
              rel="noreferrer"
              aria-label="گیت‌هاب"
              title="گیت‌هاب"
              className={styles.socialBtn}
            >
              <FaGithub />
            </a>

            <a
              href="https://linkedin.com/in/behradhashemii"
              target="_blank"
              rel="noreferrer"
              aria-label="لینکدین"
              title="لینکدین"
              className={styles.socialBtn}
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* Quick Navigation List */}
        <div className={styles.column}>
          <h3 className={styles.columnTitle}>دسترسی سریع</h3>
          <ul className={styles.navList}>
            <li>
              <Link to="/" className={styles.navLink}>صفحه اصلی</Link>
            </li>
            <li>
              <Link to="/portfolios" className={styles.navLink}>نمونه‌کارها</Link>
            </li>
            <li>
              <Link to="/articles" className={styles.navLink}>مقالات و یادداشت‌ها</Link>
            </li>
            <li>
              <Link to="/contact-us" className={styles.navLink}>ارتباط و تماس</Link>
            </li>
          </ul>
        </div>

        {/* Services & Specialties */}
        <div className={styles.column}>
          <h3 className={styles.columnTitle}>خدمات تخصصی</h3>
          <ul className={styles.navList}>
            <li>
              <Link to="/portfolios" className={styles.navLink}>توسعه وب React & Next.js</Link>
            </li>
            <li>
              <Link to="/portfolios" className={styles.navLink}>طراحی رابط کاربری (UI/UX)</Link>
            </li>
            <li>
              <Link to="/portfolios" className={styles.navLink}>بهینه‌سازی سرعت و SEO</Link>
            </li>
            <li>
              <Link to="/contact-us" className={styles.navLink}>مشاوره فنی پروژه</Link>
            </li>
          </ul>
        </div>

        {/* Contact Details */}
        <div className={styles.contact}>
          <h3 className={styles.columnTitle}>ارتباط مستقیم</h3>
          <p className={styles.contactDesc}>
            اگر ایده‌ای در سر دارید یا نیازمند توسعه وب‌سایت هستید، آماده گفتگو هستم.
          </p>
          <div className={styles.contactDetails}>
            <a href="mailto:behrahashemi1386@gmail.com" className={styles.contactItem}>
              <FaEnvelope className={styles.contactIcon} />
              <span>behrahashemi1386@gmail.com</span>
            </a>
            <a href="tel:09336699610" className={styles.contactItem}>
              <FaPhoneAlt className={styles.contactIcon} />
              <span>{e2p("09336699610")}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className={styles.bottom}>
        <p className={styles.copyright}>
          © {e2p(2020)} - {e2p(new Date().getFullYear())} تمامی حقوق محفوظ است.
        </p>

        <div className={styles.creditAndScroll}>
          <span className={styles.credit}>
            طراحی و توسعه با <FaHeart className={styles.heartIcon} /> توسط بهراد هاشمی
          </span>
          <button
            onClick={scrollToTop}
            className={styles.scrollTopBtn}
            title="بازگشت به بالای صفحه"
            aria-label="بازگشت به بالای صفحه"
          >
            <FaArrowUp />
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
