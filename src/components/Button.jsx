import { useNavigate } from "react-router-dom";
import styles from "./Button.module.css";

function Button({ title, icon, link }) {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate(`/${link}`)} className={styles.Button}>
      <span>{title}</span>
      <span className={styles.icon}>{icon}</span>
    </button>
  );
}

export default Button;
