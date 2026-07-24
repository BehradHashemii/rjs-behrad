import Header from "./layout/Header";
import Router from "./routes/Router";
import Footer from "./layout/Footer";

import ScrollToTop from "./components/ScrollToTop";
import ScrollProgressBar from "./components/ScrollProgressBar";
import FloatingScrollToTop from "./components/FloatingScrollToTop";

import "./App.css";

function App() {
  return (
    <>
      <ScrollProgressBar />
      <ScrollToTop />
      {/* <BackgroundDots /> */}
      <Header />
      <Router />
      <Footer />
      <FloatingScrollToTop />
    </>
  );
}

export default App;
