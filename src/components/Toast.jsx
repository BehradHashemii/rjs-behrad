import { useEffect } from "react";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa";
import styles from "./Toast.module.css";
import e2p from "../utils/persianNumber";

function ToastItem({ toast, onRemove }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, toast.duration || 4000);

    return () => clearTimeout(timer);
  }, [toast, onRemove]);

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <FaCheckCircle className={styles.iconSuccess} />;
      case "error":
        return <FaExclamationCircle className={styles.iconError} />;
      case "info":
      default:
        return <FaInfoCircle className={styles.iconInfo} />;
    }
  };

  return (
    <div className={`${styles.toastCard} ${styles[toast.type] || styles.info}`}>
      <div className={styles.toastIconWrapper}>{getIcon()}</div>
      <div className={styles.toastContent}>
        <p className={styles.toastMessage}>{e2p(toast.message)}</p>
      </div>
      <button
        type="button"
        className={styles.closeBtn}
        onClick={() => onRemove(toast.id)}
        aria-label="بستن اعلان"
      >
        <FaTimes />
      </button>
      <div
        className={styles.progressBar}
        style={{ animationDuration: `${toast.duration || 4000}ms` }}
      />
    </div>
  );
}

export default function Toast({ toasts, onRemove }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className={styles.toastContainer}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}
