import { ToastContainer } from "react-toastify";
import Header from "./layout/Header";
import Router from "./routes/Router";
import Footer from "./layout/Footer";
import ScrollToTop from "./components/ScrollToTop";
import styles from "./App.module.css";

function App() {
  return (
    <div style={{ direction: "rtl" }}>
      <ScrollToTop />
      <Header />
      <div className={styles.router}>
        <Router />
      </div>
      <Footer />
      <ToastContainer rtl position="top-center" autoClose={3000} />
    </div>
  );
}

export default App;
