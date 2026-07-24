import { useNavigate } from "react-router-dom";
import styles from "./Button.module.css";

function Button({ title, icon, link }) {
  const navigate = useNavigate();
  return (
    <button onClick={link ? () => navigate(`/${link}`) : null} className={styles.Button}>
      {title ? <span>{title}</span> : null}
      {icon ? <span className={styles.icon}>{icon}</span> : null}
    </button>
  );
}

export default Button;
