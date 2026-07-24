import { Link } from "react-router-dom";
import {
  FaGithub,
  FaEnvelope,
  FaCode,
  FaPhoneAlt,
  FaArrowLeft,
  FaFolderOpen,
  FaPaperPlane,
  FaReact,
  FaJsSquare,
} from "react-icons/fa";
import { SiTailwindcss, SiNextdotjs } from "react-icons/si";
import styles from "./Hero.module.css";
import e2p from "../utils/persianNumber";

function Hero() {
  return (
    <section className={`${styles.heroContainer} glassBG`}>
      <div className={styles.heroContent}>
        <div className={styles.profileWrapper}>
          <div className={styles.imageFrame}>
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"
              alt="پروفایل بهراد هاشمی"
              className={styles.profileImg}
            />
          </div>
          <span className={styles.onlineBadge} title="آماده پذیرش پروژه‌های جدید"></span>

          <div className={styles.floatingBadge}>
            <FaReact className={styles.reactFloatingIcon} />
            <span>React Developer</span>
          </div>
        </div>

        <div className={styles.bioWrapper}>
          <div className={styles.greetingBadge}>
            <FaCode className={styles.codeIcon} />
            <span>سلام! به وب‌سایت من خوش آمدید</span>
          </div>

          <h1 className={styles.headline}>
            من <span className={styles.highlight}>بهراد هاشمی</span> هستم؛ توسعه‌دهنده فرانت‌اند و برنامه‌نویس وب
          </h1>

          <p className={styles.bio}>
            علاقه‌مند به خلق رابط‌های کاربری مدرن، سریع و با کارایی بالا با React و JavaScript. تمرکز من بر ارائه کدهای تمیز، طراحی واکنش‌گرا و تجربه کاربری بی‌نقص برای پروژه‌ها و کسب‌وکارهای دیجیتال است.
          </p>

          <div className={styles.techChipsRow}>
            <span className={`${styles.techChip} ${styles.chipReact}`}>
              <FaReact /> React.js
            </span>
            <span className={`${styles.techChip} ${styles.chipNext}`}>
              <SiNextdotjs /> Next.js
            </span>
            <span className={`${styles.techChip} ${styles.chipJs}`}>
              <FaJsSquare /> JavaScript
            </span>
            <span className={`${styles.techChip} ${styles.chipTailwind}`}>
              <SiTailwindcss /> Tailwind CSS
            </span>
          </div>

          <div className={styles.ctaRow}>
            <Link to="/portfolios" className={styles.heroPrimaryBtn}>
              <FaFolderOpen />
              <span>مشاهده نمونه‌کارها</span>
              <FaArrowLeft className={styles.btnArrow} />
            </Link>

            <Link to="/contact-us" className={styles.heroSecondaryBtn}>
              <FaPaperPlane />
              <span>درخواست پروژه / تماس</span>
            </Link>
          </div>

          <div className={styles.statsAndActions}>
            <div className={styles.stats}>
              <div className={styles.statItem}>
                <span className={styles.statNum}>{e2p("+5")}</span>
                <span className={styles.statLabel}>سال تجربه توسعه</span>
              </div>
              <div className={styles.statDivider}></div>
              <div className={styles.statItem}>
                <span className={styles.statNum}>{e2p("+30")}</span>
                <span className={styles.statLabel}>پروژه و نمونه‌کار</span>
              </div>
            </div>

            <div className={styles.socialLinks}>
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
                href="mailto:behrahashemi1386@gmail.com"
                aria-label="ایمیل"
                title="پست الکترونیکی"
                className={styles.socialBtn}
              >
                <FaEnvelope />
              </a>
              <a
                href="tel:09336699610"
                aria-label="شماره تماس"
                title="تماس مستقیم"
                className={styles.socialBtn}
              >
                <FaPhoneAlt />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;

