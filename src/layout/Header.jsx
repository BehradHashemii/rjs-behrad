import { useState } from "react";
import { NavLink, Link } from "react-router-dom";

import styles from "./Header.module.css";
import e2p from "../utils/persianNumber";

import { TiThMenu } from "react-icons/ti";
import { CiShoppingCart, CiSearch } from "react-icons/ci";
import { IoIosHeartEmpty } from "react-icons/io";
import { IoPersonOutline } from "react-icons/io5";
import { Badge } from "@mui/material";
import { FaTimes } from "react-icons/fa";

function Header({ loggedUser }) {
  const [open, setOpen] = useState(false);
  // const { favorites } = useFavorites();
  return (
    <header className={styles.header}>
      <div className={`${styles.topHeader} glassBG`}>
        <Link to="/">
          <div className={styles.title}>
            <img src="/logo2.png" alt="Behrad-logo" />
            <h1>بهـــــراد</h1>
          </div>
        </Link>

        <div className={styles.searchBox}>
          <CiSearch fontSize="1.3rem" className={styles.searchIcon} />
          <input type="text" placeholder="هرچیزی فکر میکنی رو سرچ کن ..." />
        </div>

        <div className={styles.links}>
          <Badge badgeContent={e2p(0)} color="warning">
            <Link to="/cart">
              <CiShoppingCart color="#fff"style={{ fontSize: "1.5rem" }} />
            </Link>
          </Badge>

          <Badge badgeContent={e2p(0)} color="warning">
            <Link to="/favorites">
              <IoIosHeartEmpty color="#fff"style={{ fontSize: "1.5rem" }} />
            </Link>
          </Badge>

          <Link to={loggedUser ? "/dashboard" : "/login"}>
            <IoPersonOutline color="#fff"style={{ fontSize: "1.5rem" }} />
          </Link>
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

      <nav className={`${styles.navbar} glassBG ${open ? styles.open : ""}`}>
        {!open && (
          <TiThMenu
            color="#fff"
            onClick={() => setOpen(true)}
            className={styles.menuToggle}
          />
        )}

        <ul>
          <li>
            <NavLink to="/">خانه</NavLink>
          </li>
          <li>
            <NavLink to="/portfolios">نمونه کار</NavLink>
          </li>
          <li>
            <NavLink to="/articles">مقالات</NavLink>
          </li>
          <li>
            <NavLink to="/contact-us">تماس با ما</NavLink>
          </li>
          <li>
            <NavLink to="/about-us">درباره ما</NavLink>
          </li>
        </ul>

        <div>
          <p>
            <span>شماره تماس:</span>
            <a href="tel:09336699610">۰۹۳۳۶۶۹۹۶۱۰</a>
          </p>
        </div>
      </nav>
    </header>
  );
}

export default Header;
