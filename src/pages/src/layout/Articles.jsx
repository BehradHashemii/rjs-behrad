import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Pagination } from "swiper/modules";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

import styles from "./Articles.module.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import articlesData from "../data/mockData.json";
import { RiFilePaper2Line } from "react-icons/ri";
import ArticleCard from "../components/ArticleCard";
import { FiArrowUpLeft } from "react-icons/fi";

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
      <div className={styles.header}>
        <div>
          <span className={styles.eyebrow}>MY ARTICLE</span>

          <h2>
            <RiFilePaper2Line />
            آخرین مقالات
          </h2>
        </div>

        <Link to="/articles?sortBy=desc&page=1" className={styles.seeAll}>
          مشاهده همه
          <FiArrowUpLeft />
        </Link>
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
