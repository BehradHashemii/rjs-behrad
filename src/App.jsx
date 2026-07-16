import { useState } from "react";
import { Routes } from "react-router-dom";

import Router from "./routes/Router";
import Header from "./layout/Header";
import Footer from "./layout/Footer";

import "./App.css";

function App() {
  const loggedUser = false;
  return (
    <>
      <Header loggedUser={loggedUser}/>
      <Router />
      <Footer />
    </>
  );
}

export default App;
