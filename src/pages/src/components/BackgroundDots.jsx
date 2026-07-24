import styles from "./BackgroundDots.module.css";

function BackgroundDots() {
  return (
    <div className={styles.backgroundDots}>
      <span className={`${styles.dot} ${styles.dot1}`} />
      <span className={`${styles.dot} ${styles.dot2}`} />
    </div>
  );
}

export default BackgroundDots;