import Header from "./layout/Header";
import Router from "./routes/Router";
import Footer from "./layout/Footer";

import ScrollToTop from "./components/ScrollToTop";

import "./App.css";

function App() {
  return (
    <>
      <ScrollToTop />
      <div style={{ padding: "12px 14px" }}>
        <Header />
        <Router />
        <Footer />
      </div>
    </>
  );
}

export default App;
