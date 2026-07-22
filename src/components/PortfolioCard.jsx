import React from "react";
import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";
import { FiArrowUpLeft } from "react-icons/fi";
import { Link } from "react-router-dom";
import Button from "./Button";
import styles from "./PortfolioCard.module.css";
function PortfolioCard({ portfolio }) {
  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        <img
          src={portfolio.image}
          alt={portfolio.title}
          className={styles.image}
        />

        <div className={styles.category}>{portfolio.category}</div>

        {portfolio.featured && (
          <span className={styles.featured}>Featured</span>
        )}
      </div>
      <div className={styles.content}>
        <h3>{portfolio.title}</h3>
        <p className={styles.description}>{portfolio.description}</p>
        <div className={styles.technologies}>
          {portfolio.technologies.map((technology) => (
            <span key={technology}>{technology}</span>
          ))}
        </div>

        <div className={styles.footer}>
          <div className={styles.links}>
            {portfolio.liveUrl && (
              <a
                href={portfolio.liveUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="مشاهده پروژه"
              >
                <FaExternalLinkAlt />
              </a>
            )}

            {portfolio.githubUrl && (
              <a
                href={portfolio.githubUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="مشاهده گیت‌هاب"
              >
                <FaGithub />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default PortfolioCard;
