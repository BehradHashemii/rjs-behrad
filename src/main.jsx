import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import App from "./App.jsx";
import AuthProvider from "./context/AuthProvider";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StrictMode>
      <HelmetProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </HelmetProvider>
    </StrictMode>
  </BrowserRouter>,
);
