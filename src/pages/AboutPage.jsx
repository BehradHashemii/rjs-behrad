import React from "react";
import styles from "./PortfoliosPage.module.css";

function AboutPage() {
  return (
    <main className={styles.container}>
      <section className="glassBG" style={{ padding: "40px", borderRadius: "24px", color: "#333", lineHeight: "1.8" }}>
        <h1 style={{ marginBottom: "20px", color: "#f7763d" }}>درباره ما</h1>
        <p>
          به وب‌سایت شخصی بهراد خوش آمدید. من یک توسعه‌دهنده علاقه‌مند به دنیای تکنولوژی هستم که تجربیات و پروژه‌های خود را در اینجا به اشتراک می‌گذارم.
        </p>
        <p>
          هدف من از راه‌اندازی این وب‌سایت، ارائه آموزش‌های کاربردی و معرفی پروژه‌هایی است که در طول مسیر یادگیری و فعالیت حرفه‌ای خود انجام داده‌ام.
        </p>
      </section>
    </main>
  );
}

export default AboutPage;
