import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Pagination } from "swiper/modules";
import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaExternalLinkAlt,
  FaGithub,
} from "react-icons/fa";
import { VscGithubProject } from "react-icons/vsc";
import { FiArrowUpLeft } from "react-icons/fi";

import styles from "./Portfolios.module.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import mockData from "../data/mockData.json";
import PortfolioCard from "../components/PortfolioCard";

function Portfolios() {
  const [portfolios, setPortfolios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setPortfolios(mockData.portfolios.slice(-5).reverse() || []);
    setIsLoading(false);
  }, []);
  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <div>
          <span className={styles.eyebrow}>MY WORK</span>
          <h2>
            <VscGithubProject />
            آخرین نمونه‌کارها
          </h2>
        </div>
        <Link to="/portfolios" className={styles.seeAll}>
          مشاهده همه
          <FiArrowUpLeft />
        </Link>
      </div>
      <Swiper
        modules={[Navigation, Pagination, FreeMode]}
        spaceBetween={24}
        loop={false}
        navigation={{
          nextEl: ".scroll-portfolio-button-next",
          prevEl: ".scroll-portfolio-button-prev",
        }}
        pagination={{
          el: "#pagination-portfolio",
          clickable: true,
        }}
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
        }}
        className={styles.swiper}
      >
        {portfolios.map((portfolio) => (
          <SwiperSlide key={portfolio._id}>
            <PortfolioCard portfolio={portfolio} />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className={styles.swiperButtons}>
        <div className={styles.navigation}>
          <div className="scroll-portfolio-button-prev">
            <FaArrowRight
              color="#f7763d"
              style={{ fontSize: "2rem", cursor: "pointer" }}
            />
          </div>
          <div className="scroll-portfolio-button-next">
            <FaArrowLeft
              color="#f7763d"
              style={{ fontSize: "2rem", cursor: "pointer" }}
            />
          </div>
        </div>
        <div className={styles.pagination}>
          <div id="pagination-portfolio"></div>
        </div>
      </div>
    </section>
  );
}

export default Portfolios;
