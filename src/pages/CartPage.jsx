import React from "react";
import styles from "./PortfoliosPage.module.css";
import { Link } from "react-router-dom";

function CartPage() {
  return (
    <main className={styles.container}>
      <section className="glassBG" style={{ padding: "40px", borderRadius: "24px", textAlign: "center" }}>
        <h1 style={{ marginBottom: "20px", color: "#f7763d" }}>سبد خرید</h1>
        <p>سبد خرید شما در حال حاضر خالی است.</p>
        <Link to="/articles" style={{ color: "#f7763d", textDecoration: "underline", marginTop: "20px", display: "inline-block" }}>
          مشاهده مقالات و دوره‌ها
        </Link>
      </section>
    </main>
  );
}

export default CartPage;
