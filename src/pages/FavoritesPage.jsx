import React from "react";
import styles from "./PortfoliosPage.module.css";
import { Link } from "react-router-dom";

function FavoritesPage() {
  return (
    <main className={styles.container}>
      <section className="glassBG" style={{ padding: "40px", borderRadius: "24px", textAlign: "center" }}>
        <h1 style={{ marginBottom: "20px", color: "#f7763d" }}>علاقه‌مندی‌ها</h1>
        <p>شما هنوز مطلبی را به علاقه‌مندی‌های خود اضافه نکرده‌اید.</p>
        <Link to="/articles" style={{ color: "#f7763d", textDecoration: "underline", marginTop: "20px", display: "inline-block" }}>
          مشاهده مقالات
        </Link>
      </section>
    </main>
  );
}

export default FavoritesPage;
