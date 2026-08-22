import React from "react";
import { ImBlog } from "react-icons/im";
import { FaBriefcase, FaPhoneAlt } from "react-icons/fa";

import Cart from "./Cart";
import styles from "./Carts.module.css";
import BackgroundDots from "../components/BackgroundDots";

const cards = [
  {
    id: "01",
    title: "مقالات",
    description: "مطالب، آموزش‌ها و تجربیات من در دنیای تکنولوژی",
    icon: <ImBlog />,
    color: "var(--primary-color)", // جایگزین #F7763D (#2563eb)
    className: "orange",
    link: "/articles",
  },
  {
    id: "02",
    title: "نمونه کار",
    description: "پروژه‌ها و تجربه‌هایی که در مسیر برنامه‌نویسی ساخته‌ام",
    icon: <FaBriefcase />,
    color: "var(--primary-light)", // جایگزین #FF9A6C (#3b82f6)
    className: "peach",
    link:"/portfolios"
  },
  {
    id: "03",
    title: "ارتباط با من",
    description: "اگر ایده‌ای داری یا می‌خواهی با من در ارتباط باشی",
    icon: <FaPhoneAlt />,
    color: "var(--primary-dark)", // جایگزین #D95724 (#1d4ed8)
    className: "darkOrange",
    link:"/contact"
  },
];

function Carts() {
  return (
    <section className={styles.Carts}>
      <BackgroundDots />

      <div className={styles.header}>
        <span>EXPLORE</span>

        <h1>
          چیزهای بیشتری برای
          <strong> کشف کردن</strong>
        </h1>

        <p>از مقالات و پروژه‌ها تا ارتباط مستقیم؛ همه چیز اینجاست.</p>
      </div>

      <div className={styles.grid}>
        {cards.map((card, index) => (
          <Cart key={card.id} {...card} index={index} />
        ))}
      </div>
    </section>
  );
}

export default Carts;
