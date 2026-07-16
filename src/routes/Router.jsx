import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import Header from "../layout/Header";

function Router() {
  return (
    <>
      
      <Routes>
        <Route element={<HomePage />} path="/"></Route>
      </Routes>
    </>
  );
}

export default Router;
