import React from "react";
import styles from "./PortfoliosPage.module.css";

function LoginPage() {
  return (
    <main className={styles.container}>
      <section className="glassBG" style={{ padding: "40px", borderRadius: "24px", maxWidth: "400px", margin: "0 auto", textAlign: "center" }}>
        <h1 style={{ marginBottom: "20px", color: "#f7763d" }}>ورود به حساب</h1>
        <form style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <input
            type="text"
            placeholder="نام کاربری یا ایمیل"
            style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ddd" }}
          />
          <input
            type="password"
            placeholder="رمز عبور"
            style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ddd" }}
          />
          <button
            type="submit"
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#f7763d",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            ورود
          </button>
        </form>
      </section>
    </main>
  );
}

export default LoginPage;
