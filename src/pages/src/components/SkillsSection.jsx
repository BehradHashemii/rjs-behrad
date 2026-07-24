import { FaReact, FaJsSquare, FaHtml5, FaGitAlt, FaNodeJs } from "react-icons/fa";
import { SiRedux, SiTailwindcss, SiMui } from "react-icons/si";
import styles from "./SkillsSection.module.css";
import e2p from "../utils/persianNumber";

function SkillsSection() {
  const skills = [
    { id: 1, name: "React.js & Next.js", level: 90, icon: <FaReact /> },
    { id: 2, name: "JavaScript (ES6+)", level: 95, icon: <FaJsSquare /> },
    { id: 3, name: "Redux & State Management", level: 85, icon: <SiRedux /> },
    { id: 4, name: "Tailwind CSS & CSS Modules", level: 90, icon: <SiTailwindcss /> },
    { id: 5, name: "HTML5 & Semantic Markup", level: 95, icon: <FaHtml5 /> },
    { id: 6, name: "Git & GitHub Version Control", level: 88, icon: <FaGitAlt /> },
    { id: 7, name: "Material UI (MUI)", level: 82, icon: <SiMui /> },
    { id: 8, name: "Node.js & Express Basics", level: 75, icon: <FaNodeJs /> },
  ];

  const extraChips = [
    "RESTful API Integration",
    "Responsive Web Design",
    "Single Page Applications (SPA)",
    "Clean Code & Architecture",
    "Vite & Build Tools",
    "UI/UX Design Concepts",
  ];

  return (
    <section className={styles.skillsContainer}>
      <div className={styles.header}>
        <span className={styles.badge}>دانش فنی</span>
        <h2 className={styles.title}>مهارت‌ها و ابزارها</h2>
        <p className={styles.subtitle}>
          تکنولوژی‌ها و ابزارهایی که روزانه برای خلق تجربه‌های دیجیتال مدرن استفاده می‌کنم
        </p>
      </div>

      <div className={styles.grid}>
        {skills.map((skill) => (
          <div key={skill.id} className={`${styles.skillCard} glassBG`}>
            <div className={styles.cardHeader}>
              <div className={styles.skillNameBox}>
                <span className={styles.iconWrapper}>{skill.icon}</span>
                <h3 className={styles.skillName}>{skill.name}</h3>
              </div>
              <span className={styles.skillPercent}>{e2p(`%${skill.level}`)}</span>
            </div>

            <div className={styles.progressTrack}>
              <div
                className={styles.progressBar}
                style={{ width: `${skill.level}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.techChips}>
        {extraChips.map((chip, idx) => (
          <span key={idx} className={styles.chip}>
            ✨ {chip}
          </span>
        ))}
      </div>
    </section>
  );
}

export default SkillsSection;
