import { FaLaptopCode, FaMobileAlt, FaRocket, FaLayerGroup, FaCheck } from "react-icons/fa";
import styles from "./ServicesSection.module.css";

function ServicesSection() {
  const services = [
    {
      id: 1,
      icon: <FaLaptopCode />,
      title: "توسعه فرانت‌اند وب",
      description: "پیاده‌سازی وب‌سایت‌ها و اپلیکیشن‌های مدرن و تک‌صفحه‌ای (SPA) با استفاده از React و JavaScript.",
      features: ["کدنویسی تمیز و استاندارد", "استفاده از آخرین متدهای مدرن", "کامپوننت‌های قابل بازاستفاده"],
    },
    {
      id: 2,
      icon: <FaMobileAlt />,
      title: "طراحی واکنش‌گرا (Responsive)",
      description: "تضمین نمایش کاملاً سازگار و چشم‌نواز وب‌سایت در تمامی نمایشگرها مانند موبایل، تبلت و دسکتاپ.",
      features: ["رویکرد Mobile-First", "تست در ابعاد مختلف", "تجربه کاربری نرم و سریع"],
    },
    {
      id: 3,
      icon: <FaRocket />,
      title: "بهینه‌سازی سرعت و SEO",
      description: "ارتقای کارایی و سرعت بارگذاری کدهای فرانت‌اند و رعایت اصول فنی سئو جهت رتبه‌بندی بهتر.",
      features: ["بارگذاری بهینه تصاویر", "کاهش حجم باندل کدهای JS", "کدنویسی بهینه برای موتورهای جستجو"],
    },
    {
      id: 4,
      icon: <FaLayerGroup />,
      title: "طراحی UI/UX و معماری فرانت",
      description: "تبدیل طرح‌های Figma و عکس‌ها به کدهای کاملاً زنده، استاندارد و تعاملی با افکت‌های بصری جذاب.",
      features: ["پیاده‌سازی دقیق طرح Figma", "طراحی سیستم کامپوننت", "انیمیشن‌ها و ترنزیشن‌های نرم"],
    },
  ];

  return (
    <section className={styles.servicesContainer}>
      <div className={styles.header}>
        <span className={styles.badge}>تخصص‌ها و خدمات</span>
        <h2 className={styles.title}>چه کارهایی انجام می‌دهم؟</h2>
        <p className={styles.subtitle}>
          ارائه راهکارهای تخصصی فرانت‌اند و توسعه وب با بالاترین کیفیت برای رشد کسب‌وکار و پروژه‌های شما
        </p>
      </div>

      <div className={styles.grid}>
        {services.map((item) => (
          <div key={item.id} className={`${styles.serviceCard} glassBG`}>
            <div className={styles.iconBox}>{item.icon}</div>
            <h3 className={styles.cardTitle}>{item.title}</h3>
            <p className={styles.cardDesc}>{item.description}</p>
            <ul className={styles.featureList}>
              {item.features.map((feat, idx) => (
                <li key={idx} className={styles.featureItem}>
                  <FaCheck className={styles.checkIcon} />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ServicesSection;
