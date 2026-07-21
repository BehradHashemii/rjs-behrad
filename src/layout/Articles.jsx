import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Pagination } from "swiper/modules";
import { Link } from "react-router-dom";
import { IoPersonSharp } from "react-icons/io5";
import { FaArrowLeft, FaArrowRight, FaCalendarAlt } from "react-icons/fa";

import styles from "./Articles.module.css";
import formatPersianDate from "../utils/formatPersianDate";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import articlesData from "../data/mockData.json";
import { ImBlog } from "react-icons/im";
import { RiFilePaper2Line } from "react-icons/ri";
import ArticleCard from "../components/ArticleCard";

function Articles() {
  const articles = articlesData.articles.slice(-5).reverse();

  const articleSlides = articles.map((article) => (
    <SwiperSlide key={article.id} className={styles.card}>
      {/* <Link to={`/articles/${article.slug}`}> */}
        <ArticleCard article={article} />
      {/* </Link> */}
    </SwiperSlide>
  ));

  return (
    <div className={styles.container}>
      <div className={styles.link}>
        <h2>
          <Link to="/articles?sort=desc">
            <RiFilePaper2Line style={{ marginLeft: "5px" }} /> آخرین مقالات
          </Link>
        </h2>
        <Link to="/articles">مشاهده همه</Link>
      </div>

      <Swiper
        modules={[Navigation, Pagination, FreeMode]}
        loop={false}
        spaceBetween={50}
        navigation={{
          clickable: true,
          nextEl: ".scroll-swiper-button-next",
          prevEl: ".scroll-swiper-button-prev",
        }}
        pagination={{
          el: "#pagination-articles",
        }}
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {articleSlides}
      </Swiper>
      <div className={styles.swiperButtons}>
        <div className={styles.navigation}>
          <div className="scroll-swiper-button-prev">
            <FaArrowRight
              color="#f7763d"
              style={{ fontSize: "2rem", cursor: "pointer" }}
            />
          </div>
          <div className="scroll-swiper-button-next">
            <FaArrowLeft
              color="#f7763d"
              style={{ fontSize: "2rem", cursor: "pointer" }}
            />
          </div>
        </div>
        <div className={styles.pagination}>
          <div id="pagination-articles"></div>
        </div>
      </div>
    </div>
  );
}

export default Articles;
