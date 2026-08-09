import { useEffect, useState } from "react";
import { Routes } from "react-router-dom";

import Header from "./layout/Header";
import Router from "./routes/Router";
import Footer from "./layout/Footer";

import ScrollToTop from "./components/ScrollToTop";

import "./App.css";

function App() {
  useEffect(() => {
    document.documentElement.dir = "rtl"; // اگر صفحه ادمن LTR است

    return () => {
      document.documentElement.dir = "rtl"; // موقع خروج دوباره RTL می‌شود
    };
  }, []);
  const alert = {
    msg: "دیتابیس سایت به firebase متصل است. لطفا برای احراز هویت از فیلترشکن استفاده کنید.",
    type: "info", // type: info:#3498db, alert:#e74d3c, warning:#f1c40f
  }
  return (
    <>
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
      <div style={{ padding: "12px 10rem" }}>
        <Router />
      </div>
      <Footer />
    </>
  );
}

export default App;
