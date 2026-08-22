import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";

import styles from "./Header.module.css";
import e2p from "../utils/persianNumber";
import {
  getSavedPortfolios,
  getLikedArticles,
  getLoggedUser,
} from "../utils/storage";
import LoginModal from "../components/LoginModal";
import SearchModal from "../components/SearchModal";

import { TiThMenu } from "react-icons/ti";
import { CiSearch } from "react-icons/ci";
import { IoIosHeartEmpty } from "react-icons/io";
import { IoPersonOutline } from "react-icons/io5";
import { FaTimes, FaRegBookmark } from "react-icons/fa";

function Header() {
  const [open, setOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [savedCount, setSavedCount] = useState(
    () => getSavedPortfolios().length,
  );
  const [likedCount, setLikedCount] = useState(() => getLikedArticles().length);
  const [currentUser, setCurrentUser] = useState(() => getLoggedUser());

  useEffect(() => {
    const updateCounts = () => {
      setSavedCount(getSavedPortfolios().length);
      setLikedCount(getLikedArticles().length);
      setCurrentUser(getLoggedUser());
    };

    updateCounts();

    window.addEventListener("portfolio-saved-change", updateCounts);
    window.addEventListener("article-liked-change", updateCounts);
    window.addEventListener("user-auth-change", updateCounts);

    return () => {
      window.removeEventListener("portfolio-saved-change", updateCounts);
      window.removeEventListener("article-liked-change", updateCounts);
      window.removeEventListener("user-auth-change", updateCounts);
    };
  }, []);

  return (
    <header className={styles.header}>
      <div className={`${styles.topHeader}`}>
        <Link to="/">
          <div className={styles.title}>
            <img src="/logo2.png" alt="behrad-logo" />
            <h1>بهـــــراد</h1>
          </div>
        </Link>
        <div
          className={styles.searchBoxWrapper}
          onClick={() => setIsSearchModalOpen(true)}
          title="برای جستجو کلیک کنید"
        >
          <div className={styles.searchBox}>
            <CiSearch fontSize="1.3rem" className={styles.searchIcon} />
            <input
              type="text"
              placeholder="به چی فکر می کنی؟جست و جو کن"
              readOnly
            />
          </div>
        </div>
        <div className={styles.links}>
          <button
            type="button"
            className={styles.mobileSearchTrigger}
            onClick={() => setIsSearchModalOpen(true)}
            title="جستجو"
            aria-label="جستجو"
          >
            <CiSearch style={{ fontSize: "1.4rem" }} />
          </button>

          <div className={styles.badgeWrapper}>
            <Link
              to="/saved?tab=portfolios"
              title="نمونه‌کارهای ذخیره‌شده"
              aria-label="نمونه‌کارهای ذخیره‌شده"
            >
              <FaRegBookmark color="#fff" style={{ fontSize: "1.3rem" }} />
            </Link>
            {savedCount > 0 && (
              <span className={styles.customBadge}>{e2p(savedCount)}</span>
            )}
          </div>

          <div className={styles.badgeWrapper}>
            <Link
              to="/saved?tab=articles"
              title="مقالات پسندیده‌شده"
              aria-label="مقالات پسندیده‌شده"
            >
              <IoIosHeartEmpty color="#fff" style={{ fontSize: "1.5rem" }} />
            </Link>
            {likedCount > 0 && (
              <span className={styles.customBadge}>{e2p(likedCount)}</span>
            )}
          </div>

          <button
            type="button"
            className={styles.userTriggerBtn}
            onClick={() => setIsLoginModalOpen(true)}
            title={currentUser ? currentUser.name : "حساب کاربری / ورود"}
            aria-label="حساب کاربری"
          >
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className={styles.userAvatarHeader}
              />
            ) : (
              <IoPersonOutline color="#fff" style={{ fontSize: "1.5rem" }} />
            )}
          </button>
        </div>

        {!open ? (
          <TiThMenu
            color="#fff"
            onClick={() => setOpen(true)}
            className={styles.menuToggle}
          />
        ) : (
          <FaTimes
            color="#fff"
            onClick={() => setOpen(false)}
            className={styles.menuToggle}
          />
        )}
      </div>
      <nav className={`${styles.navbar} ${open ? styles.open : ""}`}>
        {!open && (
          <TiThMenu
            color="#fff"
            onClick={() => setOpen(true)}
            className={styles.menuToggle}
          />
        )}
        <ul>
          <li>
            <NavLink to="/" onClick={() => setOpen(false)}>
              خانه
            </NavLink>
          </li>
          <li>
            <NavLink to="/portfolios" onClick={() => setOpen(false)}>
              نمونه کار
            </NavLink>
          </li>
          <li>
            <NavLink to="/articles" onClick={() => setOpen(false)}>
              مقالات
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" onClick={() => setOpen(false)}>
              تماس با ما
            </NavLink>
          </li>
        </ul>
        <hr style={{ border: "1px solid var(--primary-color)" }} />
        <div>
          <p>
            <span>شماره تماس:</span>{" "}
            <a href="tel:09336699610" style={{ color: "var(--primary-color)" }}>
              {e2p("09336699610")}
            </a>
          </p>
        </div>
      </nav>

      {/* Modals */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </header>
  );
}

export default Header;
