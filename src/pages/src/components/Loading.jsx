import styles from "./Loading.module.css";

function Loading() {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.bubbles}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <p>در حال بارگذاری...</p>
    </div>
  );
}

export default Loading;