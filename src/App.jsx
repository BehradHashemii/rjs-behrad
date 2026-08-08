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
  return (
    <>
      <ScrollToTop />
      <Header />
      <div style={{ padding: "12px 14px" }}>
        <Router />
      </div>
      <Footer />
    </>
  );
}

export default App;
