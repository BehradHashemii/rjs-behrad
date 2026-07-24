import { useEffect, useRef, useState } from "react";

function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 750,
  className = "",
  threshold = 0.12,
  once = true,
  style = {},
  ...props
}) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const node = elementRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(node);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -30px 0px",
      }
    );

    observer.observe(node);

    return () => {
      if (node) {
        observer.unobserve(node);
      }
    };
  }, [threshold, once]);

  const combinedStyle = {
    transitionDelay: `${delay}ms`,
    transitionDuration: `${duration}ms`,
    ...style,
  };

  return (
    <div
      ref={elementRef}
      className={`scroll-reveal ${isVisible ? "reveal-visible" : ""} ${className}`}
      data-direction={direction}
      style={combinedStyle}
      {...props}
    >
      {children}
    </div>
  );
}

export default ScrollReveal;
