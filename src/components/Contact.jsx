import { useState } from "react";
import {
  FaPaperPlane,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import styles from "./Contact.module.css";
import e2p from "../utils/persianNumber";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState({
    submitting: false,
    submitted: false,
    error: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (status.error) {
      setStatus((prev) => ({ ...prev, error: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setStatus({ submitting: false, submitted: false, error: "لطفاً نام و نام خانوادگی خود را وارد کنید." });
      return;
    }

    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      setStatus({ submitting: false, submitted: false, error: "لطفاً یک آدرس ایمیل معتبر وارد کنید." });
      return;
    }

    if (!formData.message.trim()) {
      setStatus({ submitting: false, submitted: false, error: "لطفاً متن پیام خود را بنویسید." });
      return;
    }

    setStatus({ submitting: true, submitted: false, error: "" });

    // Simulate form submission delay
    setTimeout(() => {
      setStatus({ submitting: false, submitted: true, error: "" });
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1200);
  };

  return (
    <section className={styles.contactContainer}>
      <div className={`${styles.headerSection} glassBG`}>
        <h2 className={styles.title}>تماس با ما</h2>
        <p className={styles.subtitle}>
          خوشحال می‌شویم نظرات، پیشنهادات یا سوالات خود را با ما در میان بگذارید.
        </p>
      </div>

      <div className={styles.contactGrid}>
        {/* Contact Info Cards */}
        <div className={styles.infoWrapper}>
          <div className={`${styles.infoCard} glassBG`}>
            <div className={styles.iconBox}>
              <FaPhoneAlt />
            </div>
            <div>
              <h3>شماره تماس</h3>
              <p>{e2p("09336699610")}</p>
              <a href="tel:09336699610" className={styles.actionLink}>
                تماس مستقیم
              </a>
            </div>
          </div>

          <div className={`${styles.infoCard} glassBG`}>
            <div className={styles.iconBox}>
              <FaEnvelope />
            </div>
            <div>
              <h3>پست الکترونیکی</h3>
              <p>behrahashemi1386@gmail.com</p>
              <a href="mailto:behrahashemi1386@gmail.com" className={styles.actionLink}>
                ارسال ایمیل
              </a>
            </div>
          </div>

          <div className={`${styles.infoCard} glassBG`}>
            <div className={styles.iconBox}>
              <FaMapMarkerAlt />
            </div>
            <div>
              <h3>موقعیت و آدرس</h3>
              <p>اصفهان، ایران</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className={`${styles.formCard} glassBG`}>
          <h3 className={styles.formTitle}>ارسال پیام</h3>

          {status.submitted ? (
            <div className={styles.successBox}>
              <FaCheckCircle className={styles.successIcon} />
              <h4>پیام شما با موفقیت ارسال شد!</h4>
              <p>با تشکر از ارتباط شما. به‌زودی با شما تماس خواهیم گرفت.</p>
              <button
                type="button"
                className={styles.resetBtn}
                onClick={() => setStatus((prev) => ({ ...prev, submitted: false }))}
              >
                ارسال پیام جدید
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              {status.error && (
                <div className={styles.errorBanner}>
                  <FaExclamationTriangle />
                  <span>{status.error}</span>
                </div>
              )}

              <div className={styles.inputGroup}>
                <label htmlFor="name">نام و نام خانوادگی *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="مثال: بهراد هاشمی"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="email">پست الکترونیکی *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  dir="ltr"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="subject">موضوع پیام</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="موضوع درخواست یا پیشنهاد"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="message">متن پیام *</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="پیام خود را در این قسمت بنویسید..."
                  className={styles.textarea}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={status.submitting}
                className={styles.submitBtn}
              >
                {status.submitting ? (
                  <span>در حال ارسال...</span>
                ) : (
                  <>
                    <span>ارسال پیام</span>
                    <FaPaperPlane className={styles.sendIcon} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export default Contact;
