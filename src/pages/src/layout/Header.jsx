import { useState, useEffect, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";

import styles from "./Header.module.css";
import e2p from "../utils/persianNumber";
import mockData from "../data/mockData.json";
import { getSavedPortfolios, getLikedArticles, getLoggedUser } from "../utils/storage";
import LoginModal from "../components/LoginModal";

import { TiThMenu } from "react-icons/ti";
import { CiSearch } from "react-icons/ci";
import { IoIosHeartEmpty } from "react-icons/io";
import { IoPersonOutline } from "react-icons/io5";
import { Badge } from "@mui/material";
import { FaTimes, FaFolderOpen, FaNewspaper, FaLink, FaArrowLeft, FaRegBookmark } from "react-icons/fa";

// Utility to remove HTML tags for clean text snippets
function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "").trim();
}

function Header() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [savedCount, setSavedCount] = useState(() => getSavedPortfolios().length);
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

  const searchContainerRef = useRef(null);
  const navigate = useNavigate();

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter site content
  const query = searchQuery.trim().toLowerCase();

  const matchedPortfolios = query
    ? (mockData.portfolios || []).filter((item) => {
        const titleMatch = item.title?.toLowerCase().includes(query);
        const descMatch = item.description?.toLowerCase().includes(query);
        const catMatch = item.category?.toLowerCase().includes(query);
        const techMatch = item.technologies?.some((t) =>
          t.toLowerCase().includes(query)
        );
        return titleMatch || descMatch || catMatch || techMatch;
      })
    : [];

  const matchedArticles = query
    ? (mockData.articles || []).filter((item) => {
        const titleMatch = item.title?.toLowerCase().includes(query);
        const cleanDesc = stripHtml(item.description).toLowerCase();
        const descMatch = cleanDesc.includes(query);
        const tagMatch = item.tags?.toLowerCase().includes(query);
        return titleMatch || descMatch || tagMatch;
      })
    : [];

  // Static site pages check
  const sitePages = [
    { title: "صفحه اصلی", path: "/", icon: <FaLink /> },
    { title: "نمونه‌کارها و پروژه‌ها", path: "/portfolios", icon: <FaFolderOpen /> },
    { title: "مقالات و یادداشت‌ها", path: "/articles", icon: <FaNewspaper /> },
    { title: "تماس و ارتباط با بهراد", path: "/contact-us", icon: <FaLink /> },
  ];

  const matchedPages = query
    ? sitePages.filter((p) => p.title.toLowerCase().includes(query))
    : [];

  const totalResultsCount =
    matchedPortfolios.length + matchedArticles.length + matchedPages.length;

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (!query) return;

    setIsSearchOpen(false);
    setShowMobileSearch(false);

    // Default to portfolios page if query exists
    navigate(`/portfolios?search=${encodeURIComponent(query)}`);
  };

  const handleItemClick = (path) => {
    setIsSearchOpen(false);
    setShowMobileSearch(false);
    setSearchQuery("");
    navigate(path);
  };

  return (
    <header className={styles.header}>
      <div className={`${styles.topHeader} glassBG`}>
        <Link to="/">
          <div className={styles.title}>
            <img src="/logo2.png" alt="Behrad-logo" />
            <h1>بهـــــراد</h1>
          </div>
        </Link>

        {/* Desktop & Tablet Search Box */}
        <div className={styles.searchBoxWrapper} ref={searchContainerRef}>
          <form className={styles.searchBox} onSubmit={handleSearchSubmit}>
            <CiSearch fontSize="1.3rem" className={styles.searchIcon} />
            <input
              type="text"
              placeholder="جستجو در کل سایت (پروژه‌ها، مقالات و...)"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
            />
            {searchQuery && (
              <button
                type="button"
                className={styles.clearSearchBtn}
                onClick={() => setSearchQuery("")}
                title="پاک کردن"
              >
                <FaTimes />
              </button>
            )}
          </form>

          {/* Search Dropdown Results */}
          {isSearchOpen && query.length > 0 && (
            <div className={`${styles.searchResultsDropdown} glassBG`}>
              {totalResultsCount === 0 ? (
                <div className={styles.noResults}>
                  <p>هیچ نتیجه‌ای برای «{searchQuery}» یافت نشد.</p>
                  <span>پیشنهاد: واژگان دیگری مانند «React» یا «پت شاپ» را امتحان کنید.</span>
                </div>
              ) : (
                <>
                  {/* Portfolios Group */}
                  {matchedPortfolios.length > 0 && (
                    <div className={styles.resultGroup}>
                      <div className={styles.groupHeader}>
                        <FaFolderOpen />
                        <span>نمونه‌کارها ({e2p(matchedPortfolios.length)})</span>
                      </div>
                      <div className={styles.groupList}>
                        {matchedPortfolios.slice(0, 3).map((item) => (
                          <div
                            key={item.id}
                            className={styles.resultItem}
                            onClick={() => handleItemClick(`/portfolios?search=${encodeURIComponent(item.title)}`)}
                          >
                            <img
                              src={item.image}
                              alt={item.title}
                              className={styles.resultThumb}
                            />
                            <div className={styles.resultInfo}>
                              <div className={styles.resultTitle}>{item.title}</div>
                              <div className={styles.resultMeta}>{item.category}</div>
                            </div>
                            <FaArrowLeft className={styles.resultArrow} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Articles Group */}
                  {matchedArticles.length > 0 && (
                    <div className={styles.resultGroup}>
                      <div className={styles.groupHeader}>
                        <FaNewspaper />
                        <span>مقالات ({e2p(matchedArticles.length)})</span>
                      </div>
                      <div className={styles.groupList}>
                        {matchedArticles.slice(0, 3).map((article) => (
                          <div
                            key={article.id}
                            className={styles.resultItem}
                            onClick={() => handleItemClick(`/articles/${article.slug}`)}
                          >
                            <img
                              src={article.image}
                              alt={article.title}
                              className={styles.resultThumb}
                            />
                            <div className={styles.resultInfo}>
                              <div className={styles.resultTitle}>{article.title}</div>
                              <div className={styles.resultMeta}>
                                {stripHtml(article.description).substring(0, 50)}...
                              </div>
                            </div>
                            <FaArrowLeft className={styles.resultArrow} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pages Group */}
                  {matchedPages.length > 0 && (
                    <div className={styles.resultGroup}>
                      <div className={styles.groupHeader}>
                        <FaLink />
                        <span>صفحات ({e2p(matchedPages.length)})</span>
                      </div>
                      <div className={styles.groupList}>
                        {matchedPages.map((page, index) => (
                          <div
                            key={index}
                            className={styles.resultItem}
                            onClick={() => handleItemClick(page.path)}
                          >
                            <div className={styles.pageIconBox}>{page.icon}</div>
                            <div className={styles.resultInfo}>
                              <div className={styles.resultTitle}>{page.title}</div>
                            </div>
                            <FaArrowLeft className={styles.resultArrow} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* View All Footer */}
                  <div className={styles.dropdownFooter}>
                    <button
                      type="button"
                      className={styles.viewAllBtn}
                      onClick={() => handleSearchSubmit()}
                    >
                      مشاهده همه نتایج در نمونه‌کارها ({e2p(totalResultsCount)})
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Action Icons */}
        <div className={styles.links}>
          {/* Mobile Search Icon Button */}
          <button
            type="button"
            className={styles.mobileSearchTrigger}
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            title="جستجو"
            aria-label="جستجو"
          >
            <CiSearch style={{ fontSize: "1.4rem" }} />
          </button>

          <Badge badgeContent={e2p(savedCount)} color="warning">
            <Link to="/saved?tab=portfolios" title="نمونه‌کارهای ذخیره‌شده">
              <FaRegBookmark color="#fff" style={{ fontSize: "1.3rem" }} />
            </Link>
          </Badge>

          <Badge badgeContent={e2p(likedCount)} color="warning">
            <Link to="/saved?tab=articles" title="مقالات پسندیده‌شده">
              <IoIosHeartEmpty color="#fff" style={{ fontSize: "1.5rem" }} />
            </Link>
          </Badge>

          <button
            type="button"
            className={styles.userTriggerBtn}
            onClick={() => setIsLoginModalOpen(true)}
            title={currentUser ? currentUser.name : "حساب کاربری / ورود"}
            aria-label="حساب کاربری"
          >
            {currentUser?.avatar ? (
              <img src={currentUser.avatar} alt={currentUser.name} className={styles.userAvatarHeader} />
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

      {/* Mobile Expandable Search Bar */}
      {showMobileSearch && (
        <div className={`${styles.mobileSearchOverlay} glassBG`}>
          <form className={styles.mobileSearchForm} onSubmit={handleSearchSubmit}>
            <CiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="جستجو در کل سایت..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <button
              type="button"
              className={styles.closeMobileSearch}
              onClick={() => setShowMobileSearch(false)}
            >
              <FaTimes />
            </button>
          </form>

          {query.length > 0 && (
            <div className={styles.mobileResultsList}>
              {matchedPortfolios.length > 0 && (
                <div className={styles.mobileGroup}>
                  <h4>پروژه‌ها</h4>
                  {matchedPortfolios.map((item) => (
                    <div
                      key={item.id}
                      className={styles.mobileResultRow}
                      onClick={() => handleItemClick(`/portfolios?search=${encodeURIComponent(item.title)}`)}
                    >
                      <span>{item.title}</span>
                      <small>{item.category}</small>
                    </div>
                  ))}
                </div>
              )}

              {matchedArticles.length > 0 && (
                <div className={styles.mobileGroup}>
                  <h4>مقالات</h4>
                  {matchedArticles.map((article) => (
                    <div
                      key={article.id}
                      className={styles.mobileResultRow}
                      onClick={() => handleItemClick(`/articles/${article.slug}`)}
                    >
                      <span>{article.title}</span>
                    </div>
                  ))}
                </div>
              )}

              {totalResultsCount === 0 && (
                <p className={styles.noResultsText}>نتیجه‌ای یافت نشد.</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Navigation Navbar */}
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
            <NavLink to="/" onClick={() => setOpen(false)}>خانه</NavLink>
          </li>
          <li>
            <NavLink to="/portfolios" onClick={() => setOpen(false)}>نمونه کار</NavLink>
          </li>
          <li>
            <NavLink to="/articles" onClick={() => setOpen(false)}>مقالات</NavLink>
          </li>
          <li>
            <NavLink to="/contact-us" onClick={() => setOpen(false)}>تماس با ما</NavLink>
          </li>
        </ul>

        <div>
          <p>
            <span>شماره تماس:</span>{" "}
            <a href="tel:09336699610">{e2p("09336699610")}</a>
          </p>
        </div>
      </nav>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </header>
  );
}

export default Header;
