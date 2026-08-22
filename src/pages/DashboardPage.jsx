import { useState, useEffect } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import {
  FaUser,
  FaShieldAlt,
  FaBookmark,
  FaHeart,
  FaTicketAlt,
  FaRocket,
  FaSignOutAlt,
  FaEdit,
  FaCheckCircle,
} from "react-icons/fa";
import SEOConfig from "../components/SEOConfig";
import styles from "./DashboardPage.module.css";
import e2p from "../utils/persianNumber";
import useAuth from "../hooks/useAuth";
import { toast, ToastContainer } from "react-toastify";

// ایمپورت ابزار ارتباط با بک‌اند (جایگزین apiService شد)
import api from "../utils/axiosInstance";

// کامپوننت‌های فرعی تفکیک‌شده
import OverviewTab from "../components/dashboard/OverviewTab";
import ProfileTab from "../components/dashboard/ProfileTab";
import SavedTab from "../components/dashboard/SavedTab";
import TicketsTab from "../components/dashboard/TicketsTab";
import OrdersTab from "../components/dashboard/OrdersTab";
import NewTicketModal from "../components/dashboard/NewTicketModal";
import NewOrderModal from "../components/dashboard/NewOrderModal";
import Loading from "../components/Loading";

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
];

export default function DashboardPage() {
  const { user, logout, loading: authLoading } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

  const setTab = (tabName) => setSearchParams({ tab: tabName });

  // Stateها
  const [userData, setUserData] = useState(null);
  const [savedPortfolios, setSavedPortfolios] = useState([]); // فعلا در لوکال استوریج مدیریت میشه
  const [likedArticles, setLikedArticles] = useState([]); // فعلا در لوکال استوریج مدیریت میشه
  const [tickets, setTickets] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activities, setActivities] = useState([]);
  const [allPortfolios, setAllPortfolios] = useState([]);
  const [allArticles, setAllArticles] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  const [savedSubTab, setSavedSubTab] = useState("portfolios");
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    bio: "",
    location: "",
    avatar: AVATAR_PRESETS[0],
  });

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [newTicketData, setNewTicketData] = useState({
    title: "",
    category: "مشاوره پروژه", // مطابق با مقادیر مجاز در دیتابیس
    priority: "عادی",
    description: "",
  });
  const [replyMessageText, setReplyMessageText] = useState("");

  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [newOrderData, setNewOrderData] = useState({
    title: "",
    serviceType: "توسعه وبسایت فول استک", // مطابق با مقادیر مجاز در دیتابیس
    budget: "20 تا 40", // مطابق با مقادیر مجاز در دیتابیس
    description: "",
  });

  // ۱. دریافت اطلاعات کامل از بک‌اند Node.js
  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      setLoadingData(true);
      try {
        // چون کاربر لاگین هست، توکن خودکار ارسال میشه و بک‌اند تیکت‌های خودش رو میده
        const [ticketsRes, ordersRes, portsRes, artsRes] = await Promise.all([
          api.get("/tickets/my-tickets"),
          api.get("/projects/my-requests"),
          api.get("/portfolios"), // گرفتن همه نمونه کارها
          api.get("/articles"), // گرفتن همه مقالات
        ]);

        setTickets(ticketsRes.data || []);
        setOrders(ordersRes.data || []);
        setAllPortfolios(portsRes.data || []);
        setAllArticles(artsRes.data || []);

        // در صورت نیاز میتونی لیست ذخیره شده‌ها رو از لوکال استوریج بخونی
        setSavedPortfolios(
          JSON.parse(localStorage.getItem("savedPortfolios")) || [],
        );
        setLikedArticles(
          JSON.parse(localStorage.getItem("likedArticles")) || [],
        );
      } catch (error) {
        console.error("خطا در دریافت اطلاعات داشبورد:", error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchDashboardData();

    // تنظیم اطلاعات پروفایل کاربر
    setUserData(user);
    setProfileForm({
      name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      email: user.email || "",
      bio: user.bio || "",
      location: user.location || "",
      avatar: user.avatar || AVATAR_PRESETS[0],
    });
  }, [user]);

  // اکشن‌ها و متدها
  const logActivity = async (title, type = "info") => {
    // تو فاز بعدی میتونیم API لاگ رو تو بک‌اند بسازیم
    console.log(`Activity Logged: ${title}`);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) return toast.error("نام را وارد کنید.");

    // نکته: API آپدیت پروفایل هنوز در سرور ساخته نشده است
    toast.info("قابلیت ویرایش پروفایل به زودی فعال می‌شود.");
  };

  // ساخت تیکت پشتیبانی جدید
  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!newTicketData.title.trim() || !newTicketData.description.trim())
      return toast.error("اطلاعات را کامل کنید.");

    try {
      // ارسال به بک‌اند (نیاز به توکن داره که axiosInstance خودش میذاره)
      const response = await api.post("/tickets", {
        title: newTicketData.title,
        category: newTicketData.category, // باید دقیقا یکی از مقادیر مجاز باشه
        message: newTicketData.description,
      });

      // اضافه کردن تیکت جدید به استیت برای نمایش فوری
      setTickets([response.data.ticket, ...tickets]);

      setIsNewTicketModalOpen(false);
      setNewTicketData({
        title: "",
        category: "پشتیبانی فنی",
        priority: "عادی",
        description: "",
      });
      toast.success("تیکت با موفقیت ارسال شد.");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "خطا در ارسال تیکت.");
    }
  };

  const handleSendTicketReply = async (e) => {
    e.preventDefault();
    // این بخش نیازمند ساخت API چت در داخل تیکت است که تو مدل دیتابیس فعلی ما نیست
    toast.info("قابلیت ارسال پیام متنی در داخل تیکت به زودی فعال می‌شود.");
  };

  // ثبت درخواست پروژه جدید
  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!newOrderData.title.trim() || !newOrderData.description.trim())
      return toast.error("اطلاعات را کامل کنید.");

    try {
      const response = await api.post("/projects", {
        title: newOrderData.title,
        serviceType: newOrderData.serviceType,
        budgetRange: newOrderData.budget,
        requirements: newOrderData.description,
      });

      setOrders([response.data.request, ...orders]);
      setIsNewOrderModalOpen(false);
      setNewOrderData({
        title: "",
        serviceType: "توسعه وبسایت فول استک",
        budget: "20 تا 40",
        description: "",
      });
      toast.success("درخواست مشاوره ثبت شد.");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "خطا در ثبت درخواست.");
    }
  };

  // پروژه‌ها و مقالات فیلتر شده (آیدی‌ها در مونگو _id هستند)
  const savedPortfolioItems = (allPortfolios || []).filter((p) =>
    savedPortfolios.includes(p._id || p.id),
  );

  const likedArticleItems = (allArticles || []).filter((a) =>
    likedArticles.includes(a._id || a.id),
  );

  if (authLoading || loadingData) {
    return <Loading />;
  }

  if (!user) return <Navigate to="/" replace />;

  return (
    <div className={styles.dashboardPage}>
      <SEOConfig
        title={`داشبورد کاربری (${userData?.firstName || "کاربر"}) | بهراد`}
        description="پنل کاربری اختصاصی بهراد جهت پیگیری تیکت‌ها، مشاوره و پروژه‌ها."
        noIndex={true}
      />

      <div className={styles.container}>
        {/* Profile Banner */}
        <div className={`${styles.profileBanner} glassBG`}>
          <div className={styles.bannerLeft}>
            <div className={styles.avatarWrapper}>
              <img
                src={userData?.avatar || AVATAR_PRESETS[0]}
                alt={userData?.firstName}
                className={styles.avatarImg}
              />
              <div className={styles.verifiedBadge}>
                <FaCheckCircle />
              </div>
            </div>

            <div className={styles.profileDetails}>
              <div className={styles.nameRow}>
                <h1 className={styles.profileName}>
                  {userData?.firstName} {userData?.lastName}
                </h1>
                <span className={styles.authBadge}>
                  <FaShieldAlt />
                  <span>حساب کاربری تایید شده</span>
                </span>
              </div>
              <p className={styles.profileMeta}>
                <span>پست الکترونیک: {user.email || "ثبت‌نشده"}</span>
                <span className={styles.dotSeparator}>•</span>
                <span>
                  نقش کاربری:{" "}
                  {user.role == "admin" ? "مدیر سایت" : "کاربر عادی"}
                </span>
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
                toast.info("از حساب کاربری خارج شدید.");
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

        {/* Dashboard Layout */}
        <div className={styles.dashboardLayout}>
          {/* Sidebar */}
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

          {/* Main Content Render */}
          <main className={`${styles.contentArea}`}>
            {activeTab === "overview" && (
              <OverviewTab
                user={user}
                userData={userData}
                activities={activities}
                onOpenTicketModal={() => setIsNewTicketModalOpen(true)}
                onOpenOrderModal={() => setIsNewOrderModalOpen(true)}
              />
            )}

            {activeTab === "profile" && (
              <ProfileTab
                user={user}
                profileForm={profileForm}
                setProfileForm={setProfileForm}
                avatarPresets={AVATAR_PRESETS}
                onSaveProfile={handleSaveProfile}
              />
            )}

            {activeTab === "saved" && (
              <SavedTab
                savedSubTab={savedSubTab}
                setSavedSubTab={setSavedSubTab}
                savedPortfolios={savedPortfolios}
                likedArticles={likedArticles}
                savedPortfolioItems={savedPortfolioItems}
                likedArticleItems={likedArticleItems}
                // توابع حذف رو میتونی مستقیما تو SavedTab با مدیریت لوکال استوریج هندل کنی
              />
            )}

            {activeTab === "tickets" && (
              <TicketsTab
                tickets={tickets} // تو بک‌اند سورت شدن نیازی به reverse نیست
                selectedTicket={selectedTicket}
                setSelectedTicket={setSelectedTicket}
                user={user}
                userData={userData}
                replyMessageText={replyMessageText}
                setReplyMessageText={setReplyMessageText}
                onSendReply={handleSendTicketReply}
                onOpenTicketModal={() => setIsNewTicketModalOpen(true)}
              />
            )}

            {activeTab === "orders" && (
              <OrdersTab
                orders={orders}
                onOpenOrderModal={() => setIsNewOrderModalOpen(true)}
              />
            )}
          </main>
        </div>
      </div>

      {/* Modals */}
      <NewTicketModal
        isOpen={isNewTicketModalOpen}
        onClose={() => setIsNewTicketModalOpen(false)}
        newTicketData={newTicketData}
        setNewTicketData={setNewTicketData}
        onCreateTicket={handleCreateTicket}
      />

      <NewOrderModal
        isOpen={isNewOrderModalOpen}
        onClose={() => setIsNewOrderModalOpen(false)}
        newOrderData={newOrderData}
        setNewOrderData={setNewOrderData}
        onCreateOrder={handleCreateOrder}
      />
      <ToastContainer rtl position="top-center" />
    </div>
  );
}
