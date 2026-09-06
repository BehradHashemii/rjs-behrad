import { FaCalendarAlt } from "react-icons/fa";
import styles from "./PromptCard.module.css";
import { IoPersonSharp } from "react-icons/io5";
import formatPersianDate from "../utils/formatPersianDate";

function PromptCard({ data }) {
  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        <img src={data.image} alt={data.title} className={styles.image} />
      </div>

      <div className={styles.content}>
        <div className={styles.info}>
          <p>
            <IoPersonSharp />
            {data.author}
          </p>

          <p>
            <FaCalendarAlt />
            {formatPersianDate(data.createdAt)}
          </p>
        </div>

        <h2 className={styles.title}>{data.title}</h2>

        <div
          className={styles.desc}
          dangerouslySetInnerHTML={{
            __html: data.prompt,
          }}
        />
        <div className={styles.technologies}>
          {data.tags?.split(",").map((tag, index) => (
            <span key={index} className={styles.tech}>
              <a href={`/prompts?tag=${tag.trim()}`}>#{tag.trim()}</a>
            </span>
          ))}
        </div>
        {data.slug && (
          <div className={styles.links}>
            <a href={`/prompts/${data.slug}`} className={styles.liveLink}>
              مشاهده
            </a>
          </div>
        )}
      </div>
    </article>
  );
}

export default PromptCard;
