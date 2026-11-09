import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Pagination } from "swiper/modules";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { IoSparklesOutline } from "react-icons/io5";
import { FiArrowUpLeft } from "react-icons/fi";

import styles from "./Prompts.module.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import promptsData from "../data/prompts.json";
import PromptCard from "../components/PromptCard";

function Prompts() {
  const [prompts] = useState(() => (promptsData || []).slice(0, 6));

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <div>
          <span className={styles.eyebrow}>AI PROMPTS</span>
          <h2>
            <IoSparklesOutline />
            بانک پرامپت‌های هوش مصنوعی
          </h2>
        </div>
        <Link to="/prompts" className={styles.seeAll}>
          مشاهده همه
          <FiArrowUpLeft />
        </Link>
      </div>

      <Swiper
        modules={[Navigation, Pagination, FreeMode]}
        spaceBetween={24}
        loop={false}
        navigation={{
          nextEl: ".scroll-prompt-button-next",
          prevEl: ".scroll-prompt-button-prev",
        }}
        pagination={{
          el: "#pagination-prompts",
          clickable: true,
        }}
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className={styles.swiper}
      >
        {prompts.map((item) => (
          <SwiperSlide key={item.id} className={styles.swiperSlide}>
            <PromptCard data={item} />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className={styles.swiperButtons}>
        <div className={styles.navigation}>
          <div className="scroll-prompt-button-prev" title="قبلی">
            <FaArrowRight
              color="#6366f1"
              style={{ fontSize: "1.4rem", cursor: "pointer" }}
            />
          </div>
          <div className="scroll-prompt-button-next" title="بعدی">
            <FaArrowLeft
              color="#6366f1"
              style={{ fontSize: "1.4rem", cursor: "pointer" }}
            />
          </div>
        </div>
        <div className={styles.pagination}>
          <div id="pagination-prompts"></div>
        </div>
      </div>
    </section>
  );
}

export default Prompts;
