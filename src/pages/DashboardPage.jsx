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
  FaSpinner,
} from "react-icons/fa";
import { Helmet } from "react-helmet-async";
import styles from "./DashboardPage.module.css";
import e2p from "../utils/persianNumber";
import useAuth from "../hooks/useAuth";

// فایربیس
import { db } from "../firebase/config";
import {
  doc,
  updateDoc,
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
} from "firebase/firestore";

import mockData from "../data/mockData.json";
import { toast } from "react-toastify";

// کامپوننت‌های فرعی تفکیک‌شده
import OverviewTab from "../components/dashboard/OverviewTab";
import ProfileTab from "../components/dashboard/ProfileTab";
import SavedTab from "../components/dashboard/SavedTab";
import TicketsTab from "../components/dashboard/TicketsTab";
import OrdersTab from "../components/dashboard/OrdersTab";
import NewTicketModal from "../components/dashboard/NewTicketModal";
import NewOrderModal from "../components/dashboard/NewOrderModal";

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
  const [savedPortfolios, setSavedPortfolios] = useState([]);
  const [likedArticles, setLikedArticles] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activities, setActivities] = useState([]);

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
    category: "مشاوره پروژه",
    priority: "عادی",
    description: "",
  });
  const [replyMessageText, setReplyMessageText] = useState("");

  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [newOrderData, setNewOrderData] = useState({
    title: "",
    serviceType: "توسعه وب‌سایت فرانت‌اند و بک‌اند",
    budget: "۲۰ تا ۴۰ میلیون تومان",
    description: "",
  });

  // ۱. دریافت Realtime اطلاعات از فایربیس
  useEffect(() => {
    if (!user?.uid) return;

    // سند کاربر
    const unsubUser = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData(data);
        setSavedPortfolios(data.savedPortfolios || []);
        setLikedArticles(data.likedArticles || []);

        setProfileForm({
          name: data.name || user.displayName || "",
          email: data.email || user.email || "",
          bio: data.bio || "",
          location: data.location || "",
          avatar: data.avatar || user.photoURL || AVATAR_PRESETS[0],
        });
      }
    });

    // تیکت‌ها
    const unsubTickets = onSnapshot(
      query(collection(db, "tickets"), where("userId", "==", user.uid)),
      (snapshot) => {
        setTickets(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      }
    );

    // سفارش‌ها
    const unsubOrders = onSnapshot(
      query(collection(db, "orders"), where("userId", "==", user.uid)),
      (snapshot) => {
        setOrders(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      }
    );

    // فعالیت‌ها (بدون orderBy جهت عدم نیاز به ساخته شدن ایندکس جدید)
    const unsubActivities = onSnapshot(
      query(collection(db, "activities"), where("userId", "==", user.uid)),
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        setActivities(list);
      }
    );

    return () => {
      unsubUser();
      unsubTickets();
      unsubOrders();
      unsubActivities();
    };
  }, [user]);

  // اکشن‌ها و متدها
  const logActivity = async (title, type = "info") => {
    if (!user?.uid) return;
    try {
      await addDoc(collection(db, "activities"), {
        userId: user.uid,
        title,
        type,
        time: new Date().toLocaleTimeString("fa-IR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) return toast.error("نام را وارد کنید.");

    try {
      await updateDoc(doc(db, "users", user.uid), {
        name: profileForm.name,
        bio: profileForm.bio,
        location: profileForm.location,
        avatar: profileForm.avatar,
      });
      await logActivity("ویرایش و به‌روزرسانی اطلاعات حساب کاربری", "info");
      toast.success("اطلاعات حساب کاربر به‌روز شد.");
    } catch (error) {
      toast.error("خطا در ثبت اطلاعات.");
    }
  };

  const handleRemoveSavedPortfolio = async (id) => {
    try {
      await updateDoc(doc(db, "users", user.uid), {
        savedPortfolios: arrayRemove(id),
      });
      toast.info("پروژه حذف شد.");
    } catch (error) {
      toast.error("خطا در عملیات.");
    }
  };

  const handleRemoveLikedArticle = async (id) => {
    try {
      await updateDoc(doc(db, "users", user.uid), {
        likedArticles: arrayRemove(id),
      });
      toast.info("مقاله حذف شد.");
    } catch (error) {
      toast.error("خطا در عملیات.");
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!newTicketData.title.trim() || !newTicketData.description.trim())
      return toast.error("اطلاعات را کامل کنید.");

    try {
      await addDoc(collection(db, "tickets"), {
        userId: user.uid,
        title: newTicketData.title,
        category: newTicketData.category,
        priority: newTicketData.priority,
        status: "در حال بررسی",
        date: new Date().toLocaleDateString("fa-IR"),
        createdAt: serverTimestamp(),
        messages: [
          {
            sender: "user",
            text: newTicketData.description,
            time: new Date().toLocaleTimeString("fa-IR", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ],
      });
      await logActivity(`ثبت تیکت جدید: ${newTicketData.title}`, "ticket");
      setIsNewTicketModalOpen(false);
      setNewTicketData({
        title: "",
        category: "مشاوره پروژه",
        priority: "عادی",
        description: "",
      });
      toast.success("تیکت با موفقیت ارسال شد.");
    } catch (error) {
      toast.error("خطا در ارسال تیکت.");
    }
  };

  const handleSendTicketReply = async (e) => {
  e.preventDefault();
  if (!selectedTicket || !selectedTicket.id) return;

  try {
    let ticketRef;

    // اگر تیکت در subcollection کاربر قرار دارد:
    if (selectedTicket.userId) {
      ticketRef = doc(db, "users", selectedTicket.userId, "tickets", selectedTicket.id);
    } else {
      // اگر تیکت در کلکسیون اصلی tickets قرار دارد:
      ticketRef = doc(db, "tickets", selectedTicket.id);
    }

    await updateDoc(ticketRef, {
      adminReply: ticketReply.trim(),
      status: "answered",
      updatedAt: serverTimestamp(),
    });

    alert("پاسخ با موفقیت در مسیر درست ثبت شد.");
    setSelectedTicket(null);
    setTicketReply("");
  } catch (err) {
    console.error("خطای کامل ثبت:", err);
    alert(`خطا: ${err.message}`);
  }
};

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!newOrderData.title.trim() || !newOrderData.description.trim())
      return toast.error("اطلاعات را کامل کنید.");

    try {
      await addDoc(collection(db, "orders"), {
        userId: user.uid,
        title: newOrderData.title,
        serviceType: newOrderData.serviceType,
        budget: newOrderData.budget,
        description: newOrderData.description,
        status: "در انتظار بررسی",
        date: new Date().toLocaleDateString("fa-IR"),
        createdAt: serverTimestamp(),
      });
      await logActivity(`درخواست مشاوره جدید: ${newOrderData.title}`, "order");
      setIsNewOrderModalOpen(false);
      setNewOrderData({
        title: "",
        serviceType: "توسعه وب‌سایت فرانت‌اند و بک‌اند",
        budget: "۲۰ تا ۴۰ میلیون تومان",
        description: "",
      });
      toast.success("درخواست مشاوره ثبت شد.");
    } catch (error) {
      toast.error("خطا در ثبت درخواست.");
    }
  };

  // پروژه‌ها و مقالات فیلتر شده
  const savedPortfolioItems = mockData.portfolios.filter((p) =>
    savedPortfolios.includes(p.id)
  );

  const likedArticleItems = mockData.articles.filter((a) =>
    likedArticles.includes(a.id)
  );

  if (authLoading) {
    return (
      <div style={{ textAlign: "center", padding: "100px 0", color: "#fff" }}>
        <FaSpinner className="spinIcon" style={{ fontSize: "2rem" }} />
        <p style={{ marginTop: "10px" }}>در حال دریافت اطلاعات...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/" replace />;

  return (
    <div className={styles.dashboardPage}>
      <Helmet>
        <title>{`داشبورد کاربری (${userData?.name || user.displayName || "کاربر"}) | بهراد`}</title>
      </Helmet>

      <div className={styles.container}>
        {/* Profile Banner */}
        <div className={`${styles.profileBanner} glassBG`}>
          <div className={styles.bannerLeft}>
            <div className={styles.avatarWrapper}>
              <img
                src={userData?.avatar || user.photoURL || AVATAR_PRESETS[0]}
                alt={userData?.name || user.displayName}
                className={styles.avatarImg}
              />
              <div className={styles.verifiedBadge}>
                <FaCheckCircle />
              </div>
            </div>

            <div className={styles.profileDetails}>
              <div className={styles.nameRow}>
                <h1 className={styles.profileName}>
                  {userData?.name || user.displayName || "کاربر گرامی"}
                </h1>
                <span className={styles.authBadge}>
                  <FaShieldAlt />
                  <span>حساب کاربری تایید شده</span>
                </span>
              </div>
              <p className={styles.profileMeta}>
                <span>پست الکترونیک: {user.email || "ثبت‌نشده"}</span>
                <span className={styles.dotSeparator}>•</span>
                <span>تاریخ عضویت: {userData?.joinedDate || "۱۴۰۴/۰۵/۰۱"}</span>
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
              <span className={styles.navCountBadge}>{e2p(tickets.length)}</span>
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
          <main className={`${styles.contentArea} glassBG`}>
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
                onRemovePortfolio={handleRemoveSavedPortfolio}
                onRemoveArticle={handleRemoveLikedArticle}
              />
            )}

            {activeTab === "tickets" && (
              <TicketsTab
                tickets={tickets.reverse()}
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
    </div>
  );
}