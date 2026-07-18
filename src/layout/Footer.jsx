import {
  FaInstagram,
  FaTelegramPlane,
  FaGithub,
  FaLinkedinIn,
} from "react-icons/fa";

import styles from "./Footer.module.css";

function Footer() {
  return (
    <footer className={`${styles.footer} glassBG`}>
      <div className={styles.footerContainer}>
        <div className={styles.brand}>
          <h2>
            بهـــــراد<span>.</span>
          </h2>
          <p>
            ساختن، یاد گرفتن و رشد کردن؛
            <br />
            هر روز بهتر از دیروز.
          </p>
          <div className={styles.socials}>
            <a href="https://instagram.com/behradhashemii" aria-label="Instagram">
              <FaInstagram />
            </a>

            <a href="https://t.me/behradhashemii?text=سلام." aria-label="Telegram">
              <FaTelegramPlane />
            </a>

            <a href="https://github.com/BehradHashemii" aria-label="GitHub">
              <FaGithub />
            </a>

            <a href="#" aria-label="LinkedIn">
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className={styles.column}>
          <h3>دسترسی سریع</h3>

          <a href="/">خانه</a>
          <a href="/blogs">مقالات</a>
          <a href="/projects">نمونه کارها</a>
          <a href="/contact">ارتباط با من</a>
        </div>

        {/* Services */}
        <div className={styles.column}>
          <h3>خدمات</h3>

          <a href="#">طراحی وب‌سایت</a>
          <a href="#">توسعه فرانت‌اند</a>
          <a href="#">React</a>
          <a href="#">مشاوره</a>
        </div>

        {/* Contact */}
        <div className={styles.contact}>
          <h3>ارتباط با من</h3>

          <p>
            اگر ایده‌ای داری، خوشحال می‌شم
            <br />
            درباره‌اش صحبت کنیم.
          </p>

          <a
            href="mailto:your@email.com"
            className={styles.email}
          >
            your@email.com
          </a>
        </div>

      </div>

      {/* Bottom */}
      <div className={styles.bottom}>
        <p>
          © {new Date().getFullYear()} تمامی حقوق محفوظ است.
        </p>

        <p>
          ساخته شده با ❤️ و React
        </p>
      </div>
    </footer>
  );
}

export default Footer;