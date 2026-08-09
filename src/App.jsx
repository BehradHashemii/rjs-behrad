import { useEffect, useState } from "react";
import { Routes } from "react-router-dom";

import Header from "./layout/Header";
import Router from "./routes/Router";
import Footer from "./layout/Footer";

import ScrollToTop from "./components/ScrollToTop";

import styles from "./App.module.css";

function App() {
  const alert = {
    msg: "دیتابیس سایت به firebase متصل است. لطفا برای احراز هویت از فیلترشکن استفاده کنید.",
    type: "info", // type: info:#3498db, alert:#e74d3c, warning:#f1c40f
  }
  return (
    <div style={{ direction: "rtl" }}>
      <ScrollToTop />
      <marquee style={{
        width: "100%",
        margin: "0 auto",
        textAlign: "center",
        backgroundColor:
          `${alert.type === "info" ?
            "#3498db"
            : alert.type === "warning" ?
              "#f1c40f" : "#e74d3c"}`,
        color: "#fff",
        // borderRadius: "25px",
        padding: "5px",
        fontSize: "18px",
      }} scrollamount="10">
        {alert.msg}
      </marquee >
      <Header />
      <div className={styles.router}>
        <Router />
      </div>
      <Footer />
    </div>
  );
}

export default App;
