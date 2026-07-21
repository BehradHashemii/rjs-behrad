import { useState } from "react";
import { Routes } from "react-router-dom";

import Header from "./layout/Header";
import Router from "./routes/Router";
import Footer from "./layout/Footer";

import ScrollToTop from "./components/ScrollToTop";
import BackgroundDots from "./components/BackgroundDots";

import "./App.css";

function App() {
  const loggedUser = false;
  return (
    <>
      <ScrollToTop />
      <BackgroundDots />
      <Header loggedUser={loggedUser} />
      <Router />
      <Footer />
    </>
  );
}

export default App;
