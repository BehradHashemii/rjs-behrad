import { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";
import styles from "./FloatingScrollToTop.module.css";

function FloatingScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 250) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    toggleVisibility();

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`${styles.floatingBtn} ${isVisible ? styles.visible : ""}`}
      title="بازگشت به بالای صفحه"
      aria-label="بازگشت به بالای صفحه"
    >
      <FaArrowUp className={styles.icon} />
    </button>
  );
}

export default FloatingScrollToTop;
