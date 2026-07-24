import { FiArrowUpLeft } from "react-icons/fi";
import styles from "./Cart.module.css";

function Cart({ id, title, description, icon, color, className, index }) {
  return (
    <article
      className={`${styles.Cart} ${styles[className]}`}
      style={{
        "--card-color": color,
        "--delay": `${index * 0.15}s`,
      }}
      >
      <div className={styles.top}>
        <span className={styles.number}>{id}</span>

        <span className={styles.status}>
          <span></span>
          AVAILABLE
        </span>
      </div>

      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <div className={styles.icon}>{icon}</div>
        </div>

        <h2>{title}</h2>

        <p>{description}</p>
      </div>

      <div className={styles.bottom}>
        <span className={styles.explore}>EXPLORE</span>

        <button className={styles.arrow}>
          <FiArrowUpLeft />
        </button>
      </div>

      <div className={styles.backgroundIcon}>{icon}</div>

      <div className={styles.glow}></div>

      <div className={`${styles.circle} ${styles.circleOne}`}></div>
      <div className={`${styles.circle} ${styles.circleTwo}`}></div>
    </article>
  );
}

export default Cart;
