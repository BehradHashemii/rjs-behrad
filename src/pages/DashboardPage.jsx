import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  FaUser,
  FaShieldAlt,
  FaBookmark,
  FaHeart,
  FaTicketAlt,
  FaRocket,
  FaPlus,
  FaPaperPlane,
  FaTrash,
  FaExternalLinkAlt,
  FaSignOutAlt,
  FaEdit,
  FaCheckCircle,
  FaClock,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaBell,
  FaLock,
  FaArrowLeft,
  FaUserCheck,
} from "react-icons/fa";
import { Helmet } from "react-helmet-async";
import styles from "./DashboardPage.module.css";
import e2p from "../utils/persianNumber";
import useAuth from "../hooks/useAuth";
import LoginModal from "../components/LoginModal";

import {
  getSavedPortfolios,
  toggleSavePortfolio,
  getLikedArticles,
  toggleLikeArticle,
  getUserTickets,
  addSupportTicket,
  addMessageToTicket,
  getUserOrders,
  addProjectOrder,
  getUserActivities,
  addActivity,
  saveLoggedUser,
} from "../utils/storage";

import mockData from "../data/mockData.json";
import { toast } from "react-toastify";

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
];

export default function DashboardPage() {
  const { user, login, logout } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active tab in dashboard: 'overview' | 'profile' | 'saved' | 'tickets' | 'orders'
  const activeTab = searchParams.get("tab") || "overview";

  const setTab = (tabName) => {
    setSearchParams({ tab: tabName });
  };

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Storage Data States
  const [savedPortfolios, setSavedPortfolios] = useState(() =>
    getSavedPortfolios(),
  );
  const [likedArticles, setLikedArticles] = useState(() => getLikedArticles());
  const [tickets, setTickets] = useState(() => getUserTickets());
  const [orders, setOrders] = useState(() => getUserOrders());
  const [activities, setActivities] = useState(() => getUserActivities());

  // Sub-tabs in Saved section: 'portfolios' | 'articles'
  const [savedSubTab, setSavedSubTab] = useState("portfolios");

  // Profile Edit State initial configuration
  const [profileForm, setProfileForm] = useState(() => ({
    name: user?.name || "کاربر جدید",
    email: user?.email || "user@behradhashemii.ir",
    phone: user?.phone || "09123456789",
    bio: user?.bio || "علاقه‌مند به دنیای فناوری، برنامه‌نویسی و طراحی وب‌سایت",
    location: user?.location || "تهران، ایران",
    avatar: user?.avatar || AVATAR_PRESETS[0],
  }));

  // Ticket Modal & Detail State
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [newTicketData, setNewTicketData] = useState({
    title: "",
    category: "مشاوره پروژه",
    priority: "عادی",
    description: "",
  });
  const [replyMessageText, setReplyMessageText] = useState("");

  // Order Modal & State
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [newOrderData, setNewOrderData] = useState({
    title: "",
    serviceType: "توسعه وب‌سایت فرانت‌اند و بک‌اند",
    budget: "۲۰ تا ۴۰ میلیون تومان",
    description: "",
  });

  const reloadData = () => {
    setSavedPortfolios(getSavedPortfolios());
    setLikedArticles(getLikedArticles());
    setTickets(getUserTickets());
    setOrders(getUserOrders());
    setActivities(getUserActivities());
  };

  useEffect(() => {
    window.addEventListener("portfolio-saved-change", reloadData);
    window.addEventListener("article-liked-change", reloadData);
    window.addEventListener("user-tickets-change", reloadData);
    window.addEventListener("user-orders-change", reloadData);

    return () => {
      window.removeEventListener("portfolio-saved-change", reloadData);
      window.removeEventListener("article-liked-change", reloadData);
      window.removeEventListener("user-tickets-change", reloadData);
      window.removeEventListener("user-orders-change", reloadData);
    };
  }, []);

  // Quick Guest Login
  const handleDemoLogin = () => {
    const demoUser = {
      name: "بهراد هاشمی (کاربر تست)",
      phone: "09123456789",
      email: "behrad@behradhashemii.ir",
      avatar: AVATAR_PRESETS[0],
      joinedDate: new Date().toLocaleDateString("fa-IR"),
      bio: "توسعه‌دهنده فرانت‌اند و طراح سیستم‌های تحت وب",
      location: "تهران، ایران",
    };
    login(demoUser);
    addActivity("ورود سریع به حساب کاربری مهمان (تست)", "security");
    toast.success("با موفقیت به عنوان کاربر آزمایشی وارد پنل کاربری شدید.");
  };

  // Profile Form Save
  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) {
      toast.error("لطفاً نام و نام خانوادگی را وارد کنید.");
      return;
    }
    const updatedUser = {
      ...user,
      ...profileForm,
    };
    saveLoggedUser(updatedUser);
    addActivity("ویرایش و به‌روزرسانی اطلاعات حساب کاربری", "info");
    toast.success("اطلاعات حساب کاربری با موفقیت ویرایش شد.");
  };

  // Remove Saved Item
  const handleRemoveSavedPortfolio = (id) => {
    toggleSavePortfolio(id);
    setSavedPortfolios(getSavedPortfolios());
    toast.info("پروژه از لیست نشان‌شده‌ها حذف شد.");
  };

  const handleRemoveLikedArticle = (id) => {
    toggleLikeArticle(id);
    setLikedArticles(getLikedArticles());
    toast.info("مقاله از لیست علاقمندی‌ها حذف شد.");
  };

  // Submit New Support Ticket
  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!newTicketData.title.trim() || !newTicketData.description.trim()) {
      toast.error("لطفاً عنوان و متن تیکت را وارد کنید.");
      return;
    }

    addSupportTicket(newTicketData);
    addActivity(`ثبت تیکت جدید: ${newTicketData.title}`, "ticket");
    setTickets(getUserTickets());
    setIsNewTicketModalOpen(false);
    setNewTicketData({
      title: "",
      category: "مشاوره پروژه",
      priority: "عادی",
      description: "",
    });
    toast.success("تیکت پشتیبانی شما با موفقیت ثبت شد و در حال بررسی است.");
  };

  // Reply to Ticket
  const handleSendTicketReply = (e) => {
    e.preventDefault();
    if (!replyMessageText.trim() || !selectedTicket) return;

    const updated = addMessageToTicket(selectedTicket.id, replyMessageText);
    setTickets(updated);
    const updatedSel = updated.find((t) => t.id === selectedTicket.id);
    setSelectedTicket(updatedSel);
    setReplyMessageText("");
    addActivity(`ارسال پاسخ جدید در تیکت ${selectedTicket.id}`, "ticket");
    toast.success("پاسخ شما ارسال شد.");
  };

  // Submit New Project Order
  const handleCreateOrder = (e) => {
    e.preventDefault();
    if (!newOrderData.title.trim() || !newOrderData.description.trim()) {
      toast.error("لطفاً عنوان پروژه و شرح نیازمندی‌ها را وارد کنید.");
      return;
    }

    addProjectOrder(newOrderData);
    addActivity(`درخواست مشاوره پروژه جدید: ${newOrderData.title}`, "order");
    setOrders(getUserOrders());
    setIsNewOrderModalOpen(false);
    setNewOrderData({
      title: "",
      serviceType: "توسعه وب‌سایت فرانت‌اند و بک‌اند",
      budget: "۲۰ تا ۴۰ میلیون تومان",
      description: "",
    });
    toast.success("درخواست مشاوره پروژه ثبت شد. به زودی با شما تماس می‌گیریم.");
  };

  // Filtered Portfolio & Article Objects
  const savedPortfolioItems = mockData.portfolios.filter((p) =>
    savedPortfolios.includes(p.id),
  );

  const likedArticleItems = mockData.articles.filter((a) =>
    likedArticles.includes(a.id),
  );

  // If user is not logged in:
  if (!user) {
    return (
      <div className={styles.dashboardPage}>
        <Helmet>
          <title>پنل کاربری و ورود | وب‌سایت شخصی بهراد</title>
        </Helmet>

        <div className={styles.container}>
          <div className={`${styles.unauthCard} glassBG`}>
            <div className={styles.unauthIconWrapper}>
              <FaLock />
            </div>

            <h1 className={styles.unauthTitle}>ورود به پنل کاربری بهراد</h1>
            <p className={styles.unauthSub}>
              برای دسترسی به پیش‌خوان مدیریت، مشاهده پروژه‌ها و مقالات نشان‌شده،
              ثبت تیکت‌های پشتیبانی و استعلام هزینه پروژه، لطفاً وارد حساب
              کاربری خود شوید.
            </p>

            <div className={styles.unauthActions}>
              <button
                type="button"
                className={styles.loginTriggerBtn}
                onClick={() => setIsLoginModalOpen(true)}
              >
                <FaPhoneAlt />
                <span>ورود با شماره همراه (رمز یک‌بار مصرف)</span>
              </button>

              <button
                type="button"
                className={styles.demoLoginBtn}
                onClick={handleDemoLogin}
              >
                <FaUserCheck />
                <span>ورود سریع به عنوان کاربر مهمان (تست پنل)</span>
              </button>
            </div>

            <div className={styles.unauthFeatures}>
              <div className={styles.featureItem}>
                <FaShieldAlt className={styles.featIcon} />
                <div>
                  <h4>ورود امن و بدون کلمه عبور</h4>
                  <p>ارسال کد ۴ رقمی یک‌بار مصرف OTP به شماره همراه ایران</p>
                </div>
              </div>
              <div className={styles.featureItem}>
                <FaBookmark className={styles.featIcon} />
                <div>
                  <h4>مدیریت علاقمندی‌ها</h4>
                  <p>ذخیره‌سازی پورتفولیوها و مقالات مورد علاقه در یک مکان</p>
                </div>
              </div>
              <div className={styles.featureItem}>
                <FaTicketAlt className={styles.featIcon} />
                <div>
                  <h4>پشتیبانی آنلاین و تیکتینگ</h4>
                  <p>ارسال تیکت‌های مشاوره فنی و پیگیری پاسخ کارشناسان</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className={styles.dashboardPage}>
      <Helmet>
        <title>{`داشبورد کاربری (${user.name}) | بهراد`}</title>
      </Helmet>

      <div className={styles.container}>
        {/* Profile Banner Header */}
        <div className={`${styles.profileBanner} glassBG`}>
          <div className={styles.bannerLeft}>
            <div className={styles.avatarWrapper}>
              <img
                src={user.avatar || AVATAR_PRESETS[0]}
                alt={user.name}
                className={styles.avatarImg}
              />
              <div
                className={styles.verifiedBadge}
                title="حساب کاربری تایید شده"
              >
                <FaCheckCircle />
              </div>
            </div>

            <div className={styles.profileDetails}>
              <div className={styles.nameRow}>
                <h1 className={styles.profileName}>{user.name}</h1>
                <span className={styles.authBadge}>
                  <FaShieldAlt />
                  <span>ورود OTP دو مرحله‌ای</span>
                </span>
              </div>
              <p className={styles.profilePhone}>
                {e2p(user.phone || "09123456789")}
              </p>
              <p className={styles.profileMeta}>
                <span>عضویت: {user.joinedDate || "۱۴۰۴/۰۵/۰۱"}</span>
                <span className={styles.dotSeparator}>•</span>
                <span>پست الکترونیک: {user.email || "ثبت‌نشده"}</span>
              </p>
            </div>
          </div>

          <div className={styles.bannerRight}>
            <button
              type="button"
              className={styles.bannerActionBtn}
              onClick={() => setTab("profile")}
            >
              <FaEdit />
              <span>ویرایش مشخصات</span>
            </button>
            <button
              type="button"
              className={styles.logoutBtn}
              onClick={() => {
                logout();
                toast("از حساب کاربری خارج شدید.", "info");
              }}
            >
              <FaSignOutAlt />
              <span>خروج</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className={styles.statsGrid}>
          <div
            className={`${styles.statCard} glassBG`}
            onClick={() => {
              setTab("saved");
              setSavedSubTab("portfolios");
            }}
          >
            <div className={`${styles.statIconBox} ${styles.statIconBlue}`}>
              <FaBookmark />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statCount}>
                {e2p(savedPortfolios.length)}
              </span>
              <span className={styles.statLabel}>پروژه‌های نشان‌شده</span>
            </div>
          </div>

          <div
            className={`${styles.statCard} glassBG`}
            onClick={() => {
              setTab("saved");
              setSavedSubTab("articles");
            }}
          >
            <div className={`${styles.statIconBox} ${styles.statIconPink}`}>
              <FaHeart />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statCount}>
                {e2p(likedArticles.length)}
              </span>
              <span className={styles.statLabel}>مقالات پسندیده‌شده</span>
            </div>
          </div>

          <div
            className={`${styles.statCard} glassBG`}
            onClick={() => setTab("tickets")}
          >
            <div className={`${styles.statIconBox} ${styles.statIconGreen}`}>
              <FaTicketAlt />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statCount}>{e2p(tickets.length)}</span>
              <span className={styles.statLabel}>تیکت‌های پشتیبانی</span>
            </div>
          </div>

          <div
            className={`${styles.statCard} glassBG`}
            onClick={() => setTab("orders")}
          >
            <div className={`${styles.statIconBox} ${styles.statIconPurple}`}>
              <FaRocket />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statCount}>{e2p(orders.length)}</span>
              <span className={styles.statLabel}>سفارشات پروژه</span>
            </div>
          </div>
        </div>

        {/* Main Dashboard Layout (Sidebar + Content) */}
        <div className={styles.dashboardLayout}>
          {/* Nav Sidebar */}
          <aside className={`${styles.sidebarNav} glassBG`}>
            <button
              type="button"
              className={`${styles.navItem} ${activeTab === "overview" ? styles.navActive : ""}`}
              onClick={() => setTab("overview")}
            >
              <FaUser />
              <span>پیش‌خوان اصلی</span>
            </button>

            <button
              type="button"
              className={`${styles.navItem} ${activeTab === "profile" ? styles.navActive : ""}`}
              onClick={() => setTab("profile")}
            >
              <FaEdit />
              <span>ویرایش حساب کاربری</span>
            </button>

            <button
              type="button"
              className={`${styles.navItem} ${activeTab === "saved" ? styles.navActive : ""}`}
              onClick={() => setTab("saved")}
            >
              <FaBookmark />
              <span>نشان‌شده‌ها و علاقمندی‌ها</span>
              <span className={styles.navCountBadge}>
                {e2p(savedPortfolios.length + likedArticles.length)}
              </span>
            </button>

            <button
              type="button"
              className={`${styles.navItem} ${activeTab === "tickets" ? styles.navActive : ""}`}
              onClick={() => setTab("tickets")}
            >
              <FaTicketAlt />
              <span>تیکت‌های پشتیبانی</span>
              <span className={styles.navCountBadge}>
                {e2p(tickets.length)}
              </span>
            </button>

            <button
              type="button"
              className={`${styles.navItem} ${activeTab === "orders" ? styles.navActive : ""}`}
              onClick={() => setTab("orders")}
            >
              <FaRocket />
              <span>درخواست و مشاوره پروژه</span>
            </button>
          </aside>

          {/* Tab Content Box */}
          <main className={`${styles.contentArea} glassBG`}>
            {/* 1. Overview Tab */}
            {activeTab === "overview" && (
              <div className={styles.tabSection}>
                <div className={styles.sectionHeader}>
                  <h2>پیش‌خوان کاربر</h2>
                  <p>خلاصه فعالیت‌ها و دسترسی سریع به بخش‌های مختلف پنل</p>
                </div>

                <div className={styles.welcomeCard}>
                  <div className={styles.welcomeText}>
                    <h3>خوش آمدید، {user.name}! 👋</h3>
                    <p>
                      از طریق این پنل می‌توانید پروژه‌های نشان‌شده خود را مدیریت
                      کنید، درخواست مشاوره برای ساخت وب‌سایت جدید ثبت کنید و
                      تیکت‌های پشتیبانی را پیگیری کنید.
                    </p>
                  </div>
                  <div className={styles.quickLaunchBtns}>
                    <button
                      type="button"
                      className={styles.quickLaunchBtnPrimary}
                      onClick={() => setIsNewTicketModalOpen(true)}
                    >
                      <FaPlus />
                      <span>ثبت تیکت جدید</span>
                    </button>
                    <button
                      type="button"
                      className={styles.quickLaunchBtnSecondary}
                      onClick={() => setIsNewOrderModalOpen(true)}
                    >
                      <FaRocket />
                      <span>درخواست مشاوره پروژه</span>
                    </button>
                  </div>
                </div>

                {/* Activity Feed */}
                <div className={styles.activityBox}>
                  <h3 className={styles.subTitle}>آخرین فعالیت‌های سیستم</h3>
                  <div className={styles.activityList}>
                    {activities.map((act) => (
                      <div key={act.id} className={styles.activityItem}>
                        <div className={styles.actIcon}>
                          <FaClock />
                        </div>
                        <div className={styles.actContent}>
                          <p className={styles.actTitle}>{act.title}</p>
                          <span className={styles.actTime}>{act.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. Profile & Security Tab */}
            {activeTab === "profile" && (
              <div className={styles.tabSection}>
                <div className={styles.sectionHeader}>
                  <h2>تنظیمات حساب کاربری و امنیت</h2>
                  <p>
                    ویرایش مشخصات شخصی، انتخاب تصویر آواتار و تنظیمات
                    اطلاع‌رسانی
                  </p>
                </div>

                <form
                  onSubmit={handleSaveProfile}
                  className={styles.profileFormGrid}
                >
                  {/* Avatar Selector */}
                  <div className={styles.fullWidthGroup}>
                    <label>انتخاب تصویر آواتار حساب:</label>
                    <div className={styles.avatarPresets}>
                      {AVATAR_PRESETS.map((url, i) => (
                        <img
                          key={i}
                          src={url}
                          alt={`Avatar ${i}`}
                          className={`${styles.presetImg} ${profileForm.avatar === url ? styles.presetSelected : ""}`}
                          onClick={() =>
                            setProfileForm({ ...profileForm, avatar: url })
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="pf-name">نام و نام خانوادگی:</label>
                    <div className={styles.inputIconWrapper}>
                      <FaUser className={styles.fIcon} />
                      <input
                        id="pf-name"
                        type="text"
                        value={profileForm.name}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            name: e.target.value,
                          })
                        }
                        placeholder="مثال: بهراد هاشمی"
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="pf-phone">
                      شماره همراه (تایید شده با OTP):
                    </label>
                    <div className={styles.inputIconWrapper}>
                      <FaPhoneAlt className={styles.fIcon} />
                      <input
                        id="pf-phone"
                        type="text"
                        dir="ltr"
                        value={e2p(profileForm.phone)}
                        readOnly
                        className={styles.readOnlyInput}
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="pf-email">
                      آدرس پست الکترونیکی (ایمیل):
                    </label>
                    <div className={styles.inputIconWrapper}>
                      <FaEnvelope className={styles.fIcon} />
                      <input
                        id="pf-email"
                        type="email"
                        dir="ltr"
                        value={profileForm.email}
                        placeholder="behrad@example.com"
                        className={styles.readOnlyInput}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="pf-loc">شهر / استان محل سکونت:</label>
                    <div className={styles.inputIconWrapper}>
                      <FaMapMarkerAlt className={styles.fIcon} />
                      <input
                        id="pf-loc"
                        type="text"
                        value={profileForm.location}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            location: e.target.value,
                          })
                        }
                        placeholder="تهران، ایران"
                      />
                    </div>
                  </div>

                  <div className={styles.fullWidthGroup}>
                    <label htmlFor="pf-bio">درباره شما (بیوگرافی کوتاه):</label>
                    <textarea
                      id="pf-bio"
                      rows={3}
                      value={profileForm.bio}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, bio: e.target.value })
                      }
                      placeholder="توضیحات کوتاه درباره حوزه فعالیت، تخصص‌ها یا پروژه‌های موردعلاقه‌تان..."
                    />
                  </div>

                  <div className={styles.fullWidthGroup}>
                    <button type="submit" className={styles.saveProfileBtn}>
                      <FaCheckCircle />
                      <span>ذخیره تغییرات حساب</span>
                    </button>
                  </div>
                </form>

                {/* Security Status Box */}
                <div className={styles.securityBox}>
                  <h3 className={styles.subTitle}>
                    وضعیت امنیت و نشست‌های فعال
                  </h3>
                  <div className={styles.secRows}>
                    <div className={styles.secRow}>
                      <div className={styles.secLabel}>
                        <FaShieldAlt className={styles.secIcon} />
                        <div>
                          <strong>روش احراز هویت:</strong>
                          <p>
                            پیامک یک‌بار مصرف OTP به شماره{" "}
                            {e2p(user.phone || "09123456789")}
                          </p>
                        </div>
                      </div>
                      <span className={styles.activePill}>فعال و ایمن</span>
                    </div>

                    <div className={styles.secRow}>
                      <div className={styles.secLabel}>
                        <FaBell className={styles.secIcon} />
                        <div>
                          <strong>اطلاع‌رسانی پیامکی و ایمیلی:</strong>
                          <p>دریافت آخرین اخبار تیکت‌ها و پروژه‌ها</p>
                        </div>
                      </div>
                      <span className={styles.activePill}>فعال</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Saved & Favorites Tab */}
            {activeTab === "saved" && (
              <div className={styles.tabSection}>
                <div className={styles.sectionHeader}>
                  <h2>نشان‌شده‌ها و علاقمندی‌ها</h2>
                  <p>
                    مدیریت پروژه‌ها و مقالاتی که برای مطالعه یا بررسی بعدی ذخیره
                    کرده‌اید
                  </p>
                </div>

                <div className={styles.subTabNav}>
                  <button
                    type="button"
                    className={`${styles.subTabBtn} ${savedSubTab === "portfolios" ? styles.subTabActive : ""}`}
                    onClick={() => setSavedSubTab("portfolios")}
                  >
                    <FaBookmark />
                    <span>
                      پروژه‌های نشان‌شده ({e2p(savedPortfolios.length)})
                    </span>
                  </button>

                  <button
                    type="button"
                    className={`${styles.subTabBtn} ${savedSubTab === "articles" ? styles.subTabActive : ""}`}
                    onClick={() => setSavedSubTab("articles")}
                  >
                    <FaHeart />
                    <span>
                      مقالات پسندیده‌شده ({e2p(likedArticles.length)})
                    </span>
                  </button>
                </div>

                {savedSubTab === "portfolios" && (
                  <div className={styles.savedItemsContainer}>
                    {savedPortfolioItems.length === 0 ? (
                      <div className={styles.emptyState}>
                        <FaBookmark className={styles.emptyIcon} />
                        <h3>هیچ پروژه‌ای نشان نشده است!</h3>
                        <p>
                          شما می‌توانید با مراجعه به بخش نمونه‌کارها، پروژه‌های
                          دلخواه را ذخیره کنید.
                        </p>
                        <Link to="/portfolios" className={styles.emptyLinkBtn}>
                          مشاهده نمونه‌کارها
                        </Link>
                      </div>
                    ) : (
                      <div className={styles.savedGrid}>
                        {savedPortfolioItems.map((item) => (
                          <div key={item.id} className={styles.savedCard}>
                            <img
                              src={item.image}
                              alt={item.title}
                              className={styles.savedImg}
                            />
                            <div className={styles.savedBody}>
                              <span className={styles.categoryBadge}>
                                {item.category}
                              </span>
                              <h4 className={styles.savedTitle}>
                                {item.title}
                              </h4>
                              <p className={styles.savedDesc}>
                                {item.description}
                              </p>
                              <div className={styles.savedFooter}>
                                <a
                                  href={item.liveUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={styles.viewLinkBtn}
                                >
                                  <span>مشاهده زنده</span>
                                  <FaExternalLinkAlt />
                                </a>
                                <button
                                  type="button"
                                  className={styles.removeSavedBtn}
                                  onClick={() =>
                                    handleRemoveSavedPortfolio(item.id)
                                  }
                                  title="حذف از نشان‌شده‌ها"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {savedSubTab === "articles" && (
                  <div className={styles.savedItemsContainer}>
                    {likedArticleItems.length === 0 ? (
                      <div className={styles.emptyState}>
                        <FaHeart className={styles.emptyIcon} />
                        <h3>هیچ مقاله‌ای لایک نشده است!</h3>
                        <p>
                          می‌توانید با مطالعه مقالات وبلاگ، مطالب موردعلاقه خود
                          را لایک کنید.
                        </p>
                        <Link to="/articles" className={styles.emptyLinkBtn}>
                          مشاهده وبلاگ و مقالات
                        </Link>
                      </div>
                    ) : (
                      <div className={styles.savedGrid}>
                        {likedArticleItems.map((article) => (
                          <div key={article.id} className={styles.savedCard}>
                            <img
                              src={article.image}
                              alt={article.title}
                              className={styles.savedImg}
                            />
                            <div className={styles.savedBody}>
                              <span className={styles.categoryBadge}>
                                {article.tags || "مقاله"}
                              </span>
                              <h4 className={styles.savedTitle}>
                                {article.title}
                              </h4>
                              <div className={styles.savedFooter}>
                                <Link
                                  to={`/articles/${article.slug}`}
                                  className={styles.viewLinkBtn}
                                >
                                  <span>مطالعه مقاله</span>
                                  <FaArrowLeft />
                                </Link>
                                <button
                                  type="button"
                                  className={styles.removeSavedBtn}
                                  onClick={() =>
                                    handleRemoveLikedArticle(article.id)
                                  }
                                  title="حذف از پسندیده‌شده‌ها"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 4. Support Tickets Tab */}
            {activeTab === "tickets" && (
              <div className={styles.tabSection}>
                <div className={styles.sectionHeaderRow}>
                  <div>
                    <h2>تیکت‌های پشتیبانی و مشاوره</h2>
                    <p>
                      پیگیری پاسخ سوالات فنی، مشاوره پیاده‌سازی و استعلام قیمت
                    </p>
                  </div>
                  <button
                    type="button"
                    className={styles.newTicketHeaderBtn}
                    onClick={() => setIsNewTicketModalOpen(true)}
                  >
                    <FaPlus />
                    <span>ارسال تیکت جدید</span>
                  </button>
                </div>

                {/* Ticket Thread View */}
                {selectedTicket ? (
                  <div className={styles.ticketDetailView}>
                    <button
                      type="button"
                      className={styles.backToTicketsBtn}
                      onClick={() => setSelectedTicket(null)}
                    >
                      <FaArrowLeft />
                      <span>بازگشت به لیست تیکت‌ها</span>
                    </button>

                    <div className={styles.ticketHeaderCard}>
                      <div className={styles.thTop}>
                        <span className={styles.tckIdBadge}>
                          {selectedTicket.id}
                        </span>
                        <span className={styles.tckStatusBadge}>
                          {selectedTicket.status}
                        </span>
                        <span className={styles.tckCategory}>
                          {selectedTicket.category}
                        </span>
                      </div>
                      <h3 className={styles.thTitle}>{selectedTicket.title}</h3>
                      <p className={styles.thDate}>
                        تاریخ ثبت: {selectedTicket.date}
                      </p>
                    </div>

                    <div className={styles.threadMessages}>
                      {selectedTicket.messages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`${styles.msgBubble} ${msg.sender === "user" ? styles.msgUser : styles.msgSupport}`}
                        >
                          <div className={styles.msgHeader}>
                            <strong>
                              {msg.sender === "user"
                                ? user.name
                                : "پشتیبانی بهراد"}
                            </strong>
                            <span>{msg.time}</span>
                          </div>
                          <p className={styles.msgText}>{msg.text}</p>
                        </div>
                      ))}
                    </div>

                    <form
                      onSubmit={handleSendTicketReply}
                      className={styles.replyBox}
                    >
                      <textarea
                        rows={3}
                        placeholder="پاسخ خود را بنویسید..."
                        value={replyMessageText}
                        onChange={(e) => setReplyMessageText(e.target.value)}
                      />
                      <button type="submit" className={styles.sendReplyBtn}>
                        <FaPaperPlane />
                        <span>ارسال پاسخ</span>
                      </button>
                    </form>
                  </div>
                ) : (
                  /* Tickets List */
                  <div className={styles.ticketsList}>
                    {tickets.length === 0 ? (
                      <div className={styles.emptyState}>
                        <FaTicketAlt className={styles.emptyIcon} />
                        <h3>هیچ تیکتی تاکنون ثبت نشده است!</h3>
                        <p>
                          در صورت داشتن سوال فنی یا نیاز به مشاوره پروژه، یک
                          تیکت جدید ارسال کنید.
                        </p>
                      </div>
                    ) : (
                      tickets.map((tck) => (
                        <div
                          key={tck.id}
                          className={styles.ticketRowCard}
                          onClick={() => setSelectedTicket(tck)}
                        >
                          <div className={styles.tckMainInfo}>
                            <div className={styles.tckBadges}>
                              <span className={styles.tckCode}>{tck.id}</span>
                              <span className={styles.tckStatus}>
                                {tck.status}
                              </span>
                              <span className={styles.tckPri}>
                                {tck.priority}
                              </span>
                            </div>
                            <h4 className={styles.tckTitleText}>{tck.title}</h4>
                            <p className={styles.tckLastMsg}>
                              آخرین پیام:{" "}
                              {tck.messages[
                                tck.messages.length - 1
                              ]?.text.slice(0, 80)}
                              ...
                            </p>
                          </div>
                          <div className={styles.tckSideInfo}>
                            <span className={styles.tckDateText}>
                              {tck.date}
                            </span>
                            <span className={styles.openThreadBtn}>
                              مشاهده گفتگو
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 5. Project Orders Tab */}
            {activeTab === "orders" && (
              <div className={styles.tabSection}>
                <div className={styles.sectionHeaderRow}>
                  <div>
                    <h2>درخواست و مشاوره پروژه جدید</h2>
                    <p>
                      ثبت سفارش طراحی وب‌سایت، اپلیکیشن، سئو و سیستم‌های اختصاصی
                    </p>
                  </div>
                  <button
                    type="button"
                    className={styles.newTicketHeaderBtn}
                    onClick={() => setIsNewOrderModalOpen(true)}
                  >
                    <FaRocket />
                    <span>درخواست مشاوره جدید</span>
                  </button>
                </div>

                <div className={styles.ordersList}>
                  {orders.length === 0 ? (
                    <div className={styles.emptyState}>
                      <FaRocket className={styles.emptyIcon} />
                      <h3>هیچ درخواست پروژه‌ای ثبت نشده است!</h3>
                      <p>
                        می‌توانید برای برآورد هزینه و مشاوره فنی، درخواست خود را
                        ثبت کنید.
                      </p>
                    </div>
                  ) : (
                    orders.map((ord) => (
                      <div key={ord.id} className={styles.orderCard}>
                        <div className={styles.orderTop}>
                          <span className={styles.ordCode}>{ord.id}</span>
                          <span className={styles.ordStatus}>{ord.status}</span>
                        </div>
                        <h3 className={styles.ordTitle}>{ord.title}</h3>
                        <p className={styles.ordDesc}>{ord.description}</p>
                        <div className={styles.ordMetaRow}>
                          <span>
                            نوع سرویس: <strong>{ord.serviceType}</strong>
                          </span>
                          <span>
                            حدود بودجه: <strong>{ord.budget}</strong>
                          </span>
                          <span>
                            تاریخ ثبت: <strong>{ord.date}</strong>
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* New Ticket Modal */}
      {isNewTicketModalOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setIsNewTicketModalOpen(false)}
        >
          <div
            className={`${styles.modalBox} glassBG`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={styles.modalHeading}>ثبت تیکت جدید پشتیبانی</h3>
            <form onSubmit={handleCreateTicket} className={styles.modalForm}>
              <div className={styles.mGroup}>
                <label>عنوان تیکت:</label>
                <input
                  type="text"
                  placeholder="مثال: استعلام هزینه طراحی وب‌سایت فروشگاهی"
                  value={newTicketData.title}
                  onChange={(e) =>
                    setNewTicketData({
                      ...newTicketData,
                      title: e.target.value,
                    })
                  }
                />
              </div>

              <div className={styles.mGrid2}>
                <div className={styles.mGroup}>
                  <label>دسته‌بندی:</label>
                  <select
                    value={newTicketData.category}
                    onChange={(e) =>
                      setNewTicketData({
                        ...newTicketData,
                        category: e.target.value,
                      })
                    }
                  >
                    <option value="مشاوره پروژه">مشاوره پروژه</option>
                    <option value="استعلام قیمت">استعلام قیمت</option>
                    <option value="پشتیبانی فنی">پشتیبانی فنی</option>
                    <option value="سایر">سایر</option>
                  </select>
                </div>

                <div className={styles.mGroup}>
                  <label>اولویت:</label>
                  <select
                    value={newTicketData.priority}
                    onChange={(e) =>
                      setNewTicketData({
                        ...newTicketData,
                        priority: e.target.value,
                      })
                    }
                  >
                    <option value="عادی">عادی</option>
                    <option value="مهم">مهم</option>
                    <option value="فوری">فوری</option>
                  </select>
                </div>
              </div>

              <div className={styles.mGroup}>
                <label>توضیحات کامل درخواست:</label>
                <textarea
                  rows={4}
                  placeholder="نیازمندی‌ها، امکانات مد نظر یا سوال خود را بنویسید..."
                  value={newTicketData.description}
                  onChange={(e) =>
                    setNewTicketData({
                      ...newTicketData,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className={styles.modalBtns}>
                <button type="submit" className={styles.mSubmitBtn}>
                  ارسال تیکت
                </button>
                <button
                  type="button"
                  className={styles.mCancelBtn}
                  onClick={() => setIsNewTicketModalOpen(false)}
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Order Quote Modal */}
      {isNewOrderModalOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setIsNewOrderModalOpen(false)}
        >
          <div
            className={`${styles.modalBox} glassBG`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={styles.modalHeading}>
              درخواست مشاوره و برآورد هزینه پروژه
            </h3>
            <form onSubmit={handleCreateOrder} className={styles.modalForm}>
              <div className={styles.mGroup}>
                <label>عنوان پروژه:</label>
                <input
                  type="text"
                  placeholder="مثال: طراحی وب‌سایت شرکتی با ری‌اکت"
                  value={newOrderData.title}
                  onChange={(e) =>
                    setNewOrderData({ ...newOrderData, title: e.target.value })
                  }
                />
              </div>

              <div className={styles.mGrid2}>
                <div className={styles.mGroup}>
                  <label>نوع سرویس:</label>
                  <select
                    value={newOrderData.serviceType}
                    onChange={(e) =>
                      setNewOrderData({
                        ...newOrderData,
                        serviceType: e.target.value,
                      })
                    }
                  >
                    <option value="توسعه وب‌سایت فرانت‌اند و بک‌اند">
                      توسعه وب‌سایت فرانت‌اند و بک‌اند
                    </option>
                    <option value="طراحی آنلاین‌شاپ و فروشگاه">
                      طراحی آنلاین‌شاپ و فروشگاه
                    </option>
                    <option value="طراحی رابط و تجربه کاربری (UI/UX)">
                      طراحی رابط و تجربه کاربری (UI/UX)
                    </option>
                    <option value="سئو و بهینه‌سازی موتورهای جستجو">
                      سئو و بهینه‌سازی موتورهای جستجو
                    </option>
                  </select>
                </div>

                <div className={styles.mGroup}>
                  <label>حدود بودجه در نظر گرفته‌شده:</label>
                  <select
                    value={newOrderData.budget}
                    onChange={(e) =>
                      setNewOrderData({
                        ...newOrderData,
                        budget: e.target.value,
                      })
                    }
                  >
                    <option value="۱۰ تا ۲۰ میلیون تومان">
                      ۱۰ تا ۲۰ میلیون تومان
                    </option>
                    <option value="۲۰ تا ۴۰ میلیون تومان">
                      ۲۰ تا ۴۰ میلیون تومان
                    </option>
                    <option value="۴۰ تا ۸۰ میلیون تومان">
                      ۴۰ تا ۸۰ میلیون تومان
                    </option>
                    <option value="بالای ۱۰۰ میلیون تومان">
                      بالای ۱۰۰ میلیون تومان
                    </option>
                  </select>
                </div>
              </div>

              <div className={styles.mGroup}>
                <label>شرح نیازمندی‌ها و ویژگی‌های کلیدی پروژه:</label>
                <textarea
                  rows={4}
                  placeholder="توضیحات کامل درباره اهداف کسب‌وکار، امکانات درخواستی و زمان‌بندی مد نظر..."
                  value={newOrderData.description}
                  onChange={(e) =>
                    setNewOrderData({
                      ...newOrderData,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className={styles.modalBtns}>
                <button type="submit" className={styles.mSubmitBtn}>
                  ثبت درخواست مشاوره
                </button>
                <button
                  type="button"
                  className={styles.mCancelBtn}
                  onClick={() => setIsNewOrderModalOpen(false)}
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
