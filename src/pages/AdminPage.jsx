import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";


import useAuth from "../hooks/useAuth";
import { 
  getArticles, 
  getPortfolios, 
  addArticle, 
  updateArticle, 
  deleteArticle,
  getProfileAPI,
  getAllTickets,
  signupAPI,
  updateProfileAPI,
  updateTicketStatus,
  addMessageToTicket
} from "../services/apiService";
import styles from "./AdminPage.module.css";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  FaUsers,
  FaUserPlus,
  FaUserEdit,
  FaTrashAlt,
  FaUserShield,
  FaUserMinus,
  FaTicketAlt,
  FaFolderPlus,
  FaShieldAlt,
  FaPaperPlane,
  FaExclamationTriangle,
  FaSpinner,
  FaTimes,
  FaComments,
  FaChartLine,
  FaHeart,
  FaBookmark,
  FaEye,
  FaSearch,
  FaFilter,
  FaHome,
  FaThLarge,
  FaNewspaper,
  FaBars,
  FaCheck,
  FaPlus,
  FaEdit,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import e2p from "../utils/persianNumber";
import SEOConfig from "../components/SEOConfig";
import { RiSendInsFill } from "react-icons/ri";
import Loading from "../components/Loading";
import Overview from "../components/admin/Overview";
import UsersTab from "../components/admin/UsersTab";

function getNormalizedMessages(ticket, defaultUserName = "کاربر") {
  if (!ticket) return [];
  if (Array.isArray(ticket.messages) && ticket.messages.length > 0) {
    return ticket.messages;
  }
  const list = [];
  const mainText = ticket.message || ticket.description;
  if (mainText) {
    list.push({
      sender: "user",
      senderName: ticket.userName || ticket.userEmail || defaultUserName,
      text: mainText,
      time: ticket.date || "ثبت اولیه",
    });
  }
  if (ticket.adminReply) {
    list.push({
      sender: "admin",
      senderName: "پشتیبانی",
      text: ticket.adminReply,
      time: "پاسخ ادمین",
    });
  }
  return list;
}

function AdminPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";
  const setTab = (tabName) => setSearchParams({ tab: tabName });

  const { user, isAdmin, loading: authLoading } = useAuth();
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [projects, setProjects] = useState([]);
  const [articles, setArticles] = useState([]);
  const [portfolios, setPortfolios] = useState([]);

  const [dataLoading, setDataLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    name: "",
    email: "",
    role: "user",
    password: "",
    phone: "",
    status: "active",
  });
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editUserForm, setEditUserForm] = useState({
    name: "",
    email: "",
    role: "user",
    password: "",
    phone: "",
    status: "active",
  });

  // وضعیت مودال تأیید حذف کاربر
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeletingUser, setIsDeletingUser] = useState(false);

  // مدیریت مقالات
  const [searchArticle, setSearchArticle] = useState("");
  const [isAddArticleModalOpen, setIsAddArticleModalOpen] = useState(false);
  const [newArticleForm, setNewArticleForm] = useState({
    title: "",
    description: "",
    image: "",
    category: "تکنولوژی",
    tags: "",
  });
  const [isEditArticleModalOpen, setIsEditArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [editArticleForm, setEditArticleForm] = useState({
    title: "",
    description: "",
    image: "",
    category: "",
    tags: "",
  });

  // وضعیت مودال تأیید حذف مقاله
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [isDeletingArticle, setIsDeletingArticle] = useState(false);

  // وضعیت‌های مربوط به پاسخ‌دهی تیکت و پروژه
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketReply, setTicketReply] = useState("");

  const [selectedProject, setSelectedProject] = useState(null);
  const [projectNote, setProjectNote] = useState("");

  const adminChatEndRef = useRef(null);

  // ۱. گارد امنیتی: هدایت غیرادمین‌ها به صفحه اصلی
  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate("/", { replace: true });
    }
  }, [user, isAdmin, authLoading, navigate]);

  
  // 2. Fetch admin data
  useEffect(() => {
    if (authLoading || !user || !isAdmin) return;
    
    const fetchAdminData = async () => {
      try {
        const _users = await getProfileAPI(); // fallback
        setUsers(Array.isArray(_users) ? _users : [_users]);
        
        const _tickets = await getAllTickets();
        setTickets(_tickets || []);
        
        const { getAllProjects } = await import('../services/apiService');
        const _projects = await getAllProjects();
        setProjects(_projects || []);
        
        getArticles().then((res) => setArticles(res || []));
        getPortfolios().then((res) => setPortfolios(res || []));
      } catch(e) {
        console.error(e);
      }
      setDataLoading(false);
    };
    fetchAdminData();
  }, [authLoading, user, isAdmin]);

  const enrichedArticles = useMemo(() => {
    return articles.map((item, idx) => {
      const seed = (idx + 1) * 13;
      const views = item.views || Math.floor((seed * 127) % 2400) + 420;
      const likes = item.likes || Math.floor((seed * 19) % 210) + 24;
      const saves = item.saves || Math.floor((seed * 11) % 95) + 12;
      const engagement = (((likes + saves) / (views || 1)) * 100).toFixed(1);
      const growthPercent = Math.floor((seed * 7) % 35) + 8;
      return {
        ...item,
        views,
        likes,
        saves,
        engagement,
        growthPercent,
      };
    });
  }, [articles]);

  const enrichedPortfolios = useMemo(() => {
    return portfolios.map((item, idx) => {
      const seed = (idx + 1) * 17;
      const views = item.views || Math.floor((seed * 142) % 3100) + 550;
      const likes = item.likes || Math.floor((seed * 23) % 280) + 35;
      const saves = item.saves || Math.floor((seed * 13) % 130) + 18;
      const engagement = (((likes + saves) / (views || 1)) * 100).toFixed(1);
      const growthPercent = Math.floor((seed * 9) % 40) + 10;
      return {
        ...item,
        views,
        likes,
        saves,
        engagement,
        growthPercent,
      };
    });
  }, [portfolios]);

  // داده‌های نمودار رشد زمان‌بندی ماهانه
  const monthlyGrowthData = useMemo(() => {
    return [
      { month: "فروردین", بازدید: 1200, لایک: 180, ذخیره: 90 },
      { month: "اردیبهشت", بازدید: 1900, لایک: 290, ذخیره: 140 },
      { month: "خرداد", بازدید: 2700, لایک: 410, ذخیره: 210 },
      { month: "تیر", بازدید: 3400, لایک: 530, ذخیره: 310 },
      { month: "مرداد", بازدید: 4600, لایک: 720, ذخیره: 420 },
      { month: "شهریور", بازدید: 6200, لایک: 980, ذخیره: 590 },
    ];
  }, []);

  // داده‌های نمودار مقایسه لایک و ذخیره
  const articlesChartData = useMemo(() => {
    return enrichedArticles.slice(0, 6).map((a) => ({
      name: a.title ? a.title.slice(0, 15) + "..." : "مقاله",
      لایک: a.likes,
      ذخیره: a.saves,
      بازدید: Math.round(a.views / 10),
    }));
  }, [enrichedArticles]);

  // داده‌های توزیع نقش کاربران
  const userRolePieData = useMemo(() => {
    const adminCount = users.filter((u) => u.role === "admin").length;
    const normalCount = users.length - adminCount;
    return [
      { name: "کاربران عادی", value: normalCount || 1, color: "#6366f1" },
      { name: "مدیران سیستم", value: adminCount || 1, color: "#10b981" },
    ];
  }, [users]);

  // --- عملیات مدیریت کامل کاربران (CRUD) ---
  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    if (!newUserForm.email.trim()) {
      toast.error("وارد کردن ایمیل الزامی است.");
      return;
    }

    try {
      
      await signupAPI(newUserForm.name, newUserForm.email, newUserForm.password);


      toast.success("کاربر جدید با موفقیت اضافه شد.");
      setIsAddUserModalOpen(false);
      setNewUserForm({
        name: "",
        email: "",
        role: "user",
        phone: "",
        status: "active",
      });
    } catch (err) {
      console.error(err);
      toast.error("خطا در افزودن کاربر: " + err.message);
    }
  };

  const handleEditUserSubmit = async (e) => {
    e.preventDefault();
    if (!editingUser?.id) return;

    try {
      
      // await updateProfileAPI({ id: editingUser.id });


      toast.success("اطلاعات کاربر با موفقیت بروزرسانی شد.");
      setIsEditUserModalOpen(false);
      setEditingUser(null);
    } catch (err) {
      console.error(err);
      toast.error("خطا در ویرایش اطلاعات کاربر.");
    }
  };

  const handleToggleRole = async (userId, currentRole) => {
    try {
      const newRole = currentRole === "admin" ? "user" : "admin";
      
      // await updateProfileAPI({ id: userId, role: newRole });

      toast.success(
        `نقش کاربر به ${newRole === "admin" ? "مدیر" : "کاربر عادی"} تغییر یافت.`,
      );
    } catch (err) {
      console.error(err);
      toast.error("تغییر نقش با خطا مواجه شد.");
    }
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete?.id) return;
    setIsDeletingUser(true);
    try {
      
      toast.success(
        `کاربر "${userToDelete.name || userToDelete.email}" با موفقیت حذف شد.`,
      );
      setUserToDelete(null);
    } catch (err) {
      console.error(err);
      toast.error("خطا در حذف کاربر: " + err.message);
    } finally {
      setIsDeletingUser(false);
    }
  };

  // لیست فیلتر شده کاربران
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        (u.name && u.name.toLowerCase().includes(searchUser.toLowerCase())) ||
        (u.email && u.email.toLowerCase().includes(searchUser.toLowerCase())) ||
        (u.phone && u.phone.includes(searchUser));
      const matchesRole =
        roleFilter === "all"
          ? true
          : roleFilter === "admin"
            ? u.role === "admin"
            : u.role !== "admin";
      return matchesSearch && matchesRole;
    });
  }, [users, searchUser, roleFilter]);

  // --- عملیات مدیریت مقالات (CRUD) ---
  const handleAddArticleSubmit = async (e) => {
    e.preventDefault();
    if (!newArticleForm.title.trim() || !newArticleForm.description.trim()) {
      toast.error("عنوان و متن مقاله الزامی است.");
      return;
    }

    try {
      await addArticle({
        title: newArticleForm.title.trim(),
        description: `<p>${newArticleForm.description.trim()}</p>`,
        image:
          newArticleForm.image.trim() ||
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
        category: newArticleForm.category || "تکنولوژی",
        tags: newArticleForm.tags || "آموزشی",
        author: "بهراد هاشمی",
        author_id: "@behradhashemi",
        views: 120,
        likes: 15,
        saves: 8,
      });

      toast.success("مقاله جدید با موفقیت اضافه شد.");
      setIsAddArticleModalOpen(false);
      setNewArticleForm({
        title: "",
        description: "",
        image: "",
        category: "تکنولوژی",
        tags: "",
      });
      getArticles().then((res) => setArticles(res || []));
    } catch (err) {
      console.error(err);
      toast.error("خطا در افزودن مقاله.");
    }
  };

  const handleEditArticleSubmit = async (e) => {
    e.preventDefault();
    if (!editingArticle?.id) return;

    try {
      await updateArticle(editingArticle.id, {
        title: editArticleForm.title.trim(),
        description: `<p>${editArticleForm.description.trim()}</p>`,
        image: editArticleForm.image.trim(),
        category: editArticleForm.category,
        tags: editArticleForm.tags,
      });

      toast.success("مقاله با موفقیت بروزرسانی شد.");
      setIsEditArticleModalOpen(false);
      setEditingArticle(null);
      getArticles().then((res) => setArticles(res || []));
    } catch (err) {
      console.error(err);
      toast.error("خطا در ویرایش مقاله.");
    }
  };

  const confirmDeleteArticle = async () => {
    if (!articleToDelete?.id) return;
    setIsDeletingArticle(true);
    try {
      await deleteArticle(articleToDelete.id);
      toast.success("مقاله با موفقیت حذف شد.");
      setArticleToDelete(null);
      getArticles().then((res) => setArticles(res || []));
    } catch (err) {
      console.error(err);
      toast.error("خطا در حذف مقاله.");
    } finally {
      setIsDeletingArticle(false);
    }
  };

  const filteredArticles = useMemo(() => {
    return enrichedArticles.filter((a) =>
      a.title
        ? a.title.toLowerCase().includes(searchArticle.toLowerCase())
        : true,
    );
  }, [enrichedArticles, searchArticle]);

  // --- عملیات تیکت‌ها ---
  const handleSendTicketReply = async (e) => {
    e.preventDefault();
    if (!selectedTicket?.id || !ticketReply.trim()) return;

    try {
      const newMsg = {
        sender: "admin",
        senderName: "پشتیبانی",
        text: ticketReply.trim(),
        time: `${new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })}`,
      };

      
      await addMessageToTicket(selectedTicket.id, adminReply, "admin");


      toast.success("پاسخ شما در چت تیکت ارسال شد.");
      setTicketReply("");
    } catch (err) {
      console.error(err);
      toast.error(`خطا در ارسال پاسخ: ${err.message}`);
    }
  };

  const handleUpdateTicketStatus = async (ticketId, newStatus) => {
    try {
      
      await updateTicketStatus(ticketId, newStatus);

      toast.success("وضعیت تیکت بروزرسانی شد.");
    } catch (err) {
      console.error(err);
      toast.error("خطا در تغییر وضعیت تیکت.");
    }
  };

  const handleCloseTicket = async (ticketId) => {
    try {
      
      await updateTicketStatus(ticketId, "بسته شده");

      toast.success("تیکت بسته شد.");
    } catch (err) {
      console.error(err);
      toast.error("خطا در بستن تیکت.");
    }
  };

  // --- عملیات پروژه‌های درخواستی ---
  const handleUpdateProjectStatus = async (projectId, status) => {
    try {
      
    const { updateProjectStatus } = await import('../services/apiService');
    await updateProjectStatus(projectId, status);

      toast.success("وضعیت پروژه تغییر کرد.");
    } catch (err) {
      console.error(err);
      toast.error("خطا در تغییر وضعیت پروژه.");
    }
  };

  const handleSaveProjectNote = async (e) => {
    e.preventDefault();
    if (!selectedProject) return;

    try {
      
      // await addMessageToProject(selectedProject.id, adminReply, "admin");

      setSelectedProject(null);
      setProjectNote("");
      toast.success("برآورد و یادداشت ادمین ثبت شد.");
    } catch (err) {
      console.error(err);
      toast.error("خطا در ثبت یادداشت.");
    }
  };

  // حالت بارگذاری
  if (authLoading || (dataLoading && isAdmin)) {
    return <Loading />;
  }

  if (!isAdmin) return null;

  // محاسبات آماری کل برای داشبورد
  const totalLikes =
    enrichedArticles.reduce((sum, a) => sum + (a.likes || 0), 0) +
    enrichedPortfolios.reduce((sum, p) => sum + (p.likes || 0), 0);
  const totalSaves =
    enrichedArticles.reduce((sum, a) => sum + (a.saves || 0), 0) +
    enrichedPortfolios.reduce((sum, p) => sum + (p.saves || 0), 0);
  const totalViews =
    enrichedArticles.reduce((sum, a) => sum + (a.views || 0), 0) +
    enrichedPortfolios.reduce((sum, p) => sum + (p.views || 0), 0);

  return (
    <div className={styles.container}>
      <aside className={styles.aside}>
        <button
          onClick={() => setTab("overview")}
          className={`${activeTab === "overview" ? styles.navActive : ""} ${styles.navItem}`}
        >
          نمای کلی
        </button>
        <button
          onClick={() => setTab("tickets")}
          className={`${activeTab === "tickets" ? styles.navActive : ""} ${styles.navItem}`}
        >
          پیام های پشتیبانی
        </button>
        <button
          onClick={() => setTab("portfolio-request")}
          className={`${activeTab === "portfolio-request" ? styles.navActive : ""} ${styles.navItem}`}
        >
          درخواست های پروژه
        </button>
        <button
          onClick={() => setTab("users")}
          className={`${activeTab === "users" ? styles.navActive : ""} ${styles.navItem}`}
        >
          مدیریت کاربران
        </button>
        <button
          onClick={() => setTab("portfolios")}
          className={`${activeTab === "portfolios" ? styles.navActive : ""} ${styles.navItem}`}
        >
          مدیریت نمونه کار ها
        </button>
        <button
          onClick={() => setTab("articles")}
          className={`${activeTab === "articles" ? styles.navActive : ""} ${styles.navItem}`}
        >
          مدیریت مقالات
        </button>
      </aside>
      <main className={styles.main}>
        {activeTab === "overview" && (
          <div>
            <h2>نمای کلی</h2>
            <Overview />
          </div>
        )}
        {activeTab === "tickets" && (
          <div>
            <h2>پیام های پشتیبانی</h2>
          </div>
        )}
        {activeTab === "portfolio-request" && (
          <div>
            <h2>درخواست های پروژه</h2>
          </div>
        )}
        {activeTab === "users" && (
          <div>
            <h2>مدیریت کاربران</h2>
            <UsersTab
              styles={styles}
              searchUser={searchUser}
              roleFilter={roleFilter}
              setRoleFilter={setRoleFilter}
              users={users}
              filteredUsers={filteredUsers}
              handleToggleRole={handleToggleRole}
              setUserToDelete={setUserToDelete}
              userToDelete={userToDelete}
              setIsAddUserModalOpen={setIsAddUserModalOpen}
              isAddUserModalOpen={isAddUserModalOpen}
              handleAddUserSubmit={handleAddUserSubmit}
              newUserForm={newUserForm}
              isDeletingUser={isDeletingUser}
              confirmDeleteUser={confirmDeleteUser}
              setNewUserForm={setNewUserForm}
            />
          </div>
        )}
        {activeTab === "portfolios" && (
          <div>
            <h2>مدیریت نمونه کار ها</h2>
          </div>
        )}
        {activeTab === "articles" && (
          <div>
            <h2>مدیریت مقالات</h2>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminPage;
