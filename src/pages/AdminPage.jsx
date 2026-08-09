import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    collection,
    onSnapshot,
    doc,
    setDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    arrayUnion,
} from "firebase/firestore";
import { db } from "../firebase";
import useAuth from "../hooks/useAuth";
import {
    getArticlesFromFirestore,
    getPortfoliosFromFirestore,
    addArticleToFirestore,
    updateArticleInFirestore,
    deleteArticleFromFirestore,
} from "../services/firestoreService";
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

export default function AdminPage() {
    const navigate = useNavigate();
    const { user, isAdmin, loading: authLoading } = useAuth();
    const [activeTab, setActiveTab] = useState("dashboard");
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
        phone: "",
        status: "active",
    });
    const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [editUserForm, setEditUserForm] = useState({
        name: "",
        email: "",
        role: "user",
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

    // ۲. دریافت زنده اطلاعات از Firestore و سرویس‌ها
    useEffect(() => {
        if (authLoading || !user || !isAdmin) return;

        // دریافت لیست کاربران
        const unsubUsers = onSnapshot(
            collection(db, "users"),
            (snapshot) => {
                setUsers(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
                setDataLoading(false);
            },
            (err) => {
                console.error("خطا در دریافت کاربران:", err);
                setErrorMessage("خطا در بارگذاری لیست کاربران.");
                setDataLoading(false);
            }
        );

        // دریافت تیکت‌های پشتیبانی
        const unsubTickets = onSnapshot(
            collection(db, "tickets"),
            (snapshot) => {
                const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
                setTickets(list);
                setSelectedTicket((prev) => {
                    if (!prev?.id) return null;
                    const updated = list.find((t) => t.id === prev.id);
                    return updated || prev;
                });
            },
            (err) => console.warn("خطا در دریافت تیکت‌ها:", err)
        );

        // دریافت پروژه‌های درخواستی کاربران
        const unsubProjects = onSnapshot(
            collection(db, "projects"),
            (snapshot) => {
                setProjects(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
            },
            (err) => console.warn("خطا در دریافت پروژه‌ها:", err)
        );

        // دریافت مقالات و نمونه کارها
        getArticlesFromFirestore().then((res) => setArticles(res || []));
        getPortfoliosFromFirestore().then((res) => setPortfolios(res || []));

        return () => {
            unsubUsers();
            unsubTickets();
            unsubProjects();
        };
    }, [user, isAdmin, authLoading]);

    // --- محاسبه آمار رشد مقالات و پروژه‌ها ---
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
            const userDocRef = doc(collection(db, "users"));
            await setDoc(userDocRef, {
                name: newUserForm.name.trim() || "کاربر جدید",
                email: newUserForm.email.trim().toLowerCase(),
                role: newUserForm.role || "user",
                phone: newUserForm.phone.trim() || "-",
                status: newUserForm.status || "active",
                createdAt: new Date().toLocaleDateString("fa-IR"),
                updatedAt: serverTimestamp(),
            });

            toast.success("کاربر جدید با موفقیت اضافه شد.");
            setIsAddUserModalOpen(false);
            setNewUserForm({ name: "", email: "", role: "user", phone: "", status: "active" });
        } catch (err) {
            console.error(err);
            toast.error("خطا در افزودن کاربر: " + err.message);
        }
    };

    const handleEditUserSubmit = async (e) => {
        e.preventDefault();
        if (!editingUser?.id) return;

        try {
            await updateDoc(doc(db, "users", editingUser.id), {
                name: editUserForm.name.trim(),
                email: editUserForm.email.trim().toLowerCase(),
                role: editUserForm.role,
                phone: editUserForm.phone.trim(),
                status: editUserForm.status,
                updatedAt: serverTimestamp(),
            });

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
            await updateDoc(doc(db, "users", userId), { role: newRole });
            toast.success(`نقش کاربر به ${newRole === "admin" ? "مدیر سیستم" : "کاربر عادی"} تغییر یافت.`);
        } catch (err) {
            console.error(err);
            toast.error("تغییر نقش با خطا مواجه شد.");
        }
    };

    const confirmDeleteUser = async () => {
        if (!userToDelete?.id) return;
        setIsDeletingUser(true);
        try {
            await deleteDoc(doc(db, "users", userToDelete.id));
            toast.success(`کاربر "${userToDelete.name || userToDelete.email}" با موفقیت حذف شد.`);
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
                roleFilter === "all" ? true : roleFilter === "admin" ? u.role === "admin" : u.role !== "admin";
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
            await addArticleToFirestore({
                title: newArticleForm.title.trim(),
                description: `<p>${newArticleForm.description.trim()}</p>`,
                image: newArticleForm.image.trim() || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
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
            setNewArticleForm({ title: "", description: "", image: "", category: "تکنولوژی", tags: "" });
            getArticlesFromFirestore().then((res) => setArticles(res || []));
        } catch (err) {
            console.error(err);
            toast.error("خطا در افزودن مقاله.");
        }
    };

    const handleEditArticleSubmit = async (e) => {
        e.preventDefault();
        if (!editingArticle?.id) return;

        try {
            await updateArticleInFirestore(editingArticle.id, {
                title: editArticleForm.title.trim(),
                description: `<p>${editArticleForm.description.trim()}</p>`,
                image: editArticleForm.image.trim(),
                category: editArticleForm.category,
                tags: editArticleForm.tags,
            });

            toast.success("مقاله با موفقیت بروزرسانی شد.");
            setIsEditArticleModalOpen(false);
            setEditingArticle(null);
            getArticlesFromFirestore().then((res) => setArticles(res || []));
        } catch (err) {
            console.error(err);
            toast.error("خطا در ویرایش مقاله.");
        }
    };

    const confirmDeleteArticle = async () => {
        if (!articleToDelete?.id) return;
        setIsDeletingArticle(true);
        try {
            await deleteArticleFromFirestore(articleToDelete.id);
            toast.success("مقاله با موفقیت حذف شد.");
            setArticleToDelete(null);
            getArticlesFromFirestore().then((res) => setArticles(res || []));
        } catch (err) {
            console.error(err);
            toast.error("خطا در حذف مقاله.");
        } finally {
            setIsDeletingArticle(false);
        }
    };

    const filteredArticles = useMemo(() => {
        return enrichedArticles.filter((a) =>
            a.title ? a.title.toLowerCase().includes(searchArticle.toLowerCase()) : true
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

            await updateDoc(doc(db, "tickets", selectedTicket.id), {
                messages: arrayUnion(newMsg),
                adminReply: ticketReply.trim(),
                status: "پاسخ داده شده",
                updatedAt: serverTimestamp(),
            });

            toast.success("پاسخ شما در چت تیکت ارسال شد.");
            setTicketReply("");
        } catch (err) {
            console.error(err);
            toast.error(`خطا در ارسال پاسخ: ${err.message}`);
        }
    };

    const handleUpdateTicketStatus = async (ticketId, newStatus) => {
        try {
            await updateDoc(doc(db, "tickets", ticketId), {
                status: newStatus,
                updatedAt: serverTimestamp(),
            });
            toast.success("وضعیت تیکت بروزرسانی شد.");
        } catch (err) {
            console.error(err);
            toast.error("خطا در تغییر وضعیت تیکت.");
        }
    };

    const handleCloseTicket = async (ticketId) => {
        try {
            await updateDoc(doc(db, "tickets", ticketId), {
                status: "بسته شده",
                updatedAt: serverTimestamp(),
            });
            toast.success("تیکت بسته شد.");
        } catch (err) {
            console.error(err);
            toast.error("خطا در بستن تیکت.");
        }
    };

    // --- عملیات پروژه‌های درخواستی ---
    const handleUpdateProjectStatus = async (projectId, status) => {
        try {
            await updateDoc(doc(db, "projects", projectId), {
                status,
                updatedAt: serverTimestamp(),
            });
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
            await updateDoc(doc(db, "projects", selectedProject.id), {
                adminNote: projectNote.trim(),
                updatedAt: serverTimestamp(),
            });
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
        return (
            <div className={styles.loadingContainer}>
                <FaSpinner className={styles.spinnerIcon} />
                <h2>در حال بارگذاری اطلاعات پنل مدیریت جامع...</h2>
            </div>
        );
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
        <div className={styles.adminPageWrapper}>
            <SEOConfig
                title="پنل مدیریت و ادمین | بهراد هاشمی (behradhashemii.ir)"
                description="پنل مدیریت اختصاصی سیستم بهراد هاشمی"
                noIndex={true}
            />
            <div className={`${styles.adminLayoutContainer} ${sidebarCollapsed ? styles.collapsedLayout : ""}`}>
                {/* ========================================================= */}
                {/* سایدبار مدیریت (Admin Sidebar) */}
                {/* ========================================================= */}
                <aside className={styles.sidebar}>
                    <div className={styles.sidebarHeader}>
                        <div className={styles.adminBrand}>
                            {!sidebarCollapsed && <>
                                <FaShieldAlt className={styles.brandIcon} />
                                <span>پنل ادمین</span>
                            </>
                            }
                        </div>
                        <button
                            className={styles.sidebarToggleBtn}
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            title="تغییر وضعیت سایدبار"
                        >
                            <FaBars />
                        </button>
                    </div>

                    <nav className={styles.sidebarMenu}>
                        <button
                            className={`${styles.navItem} ${activeTab === "dashboard" ? styles.navActive : ""}`}
                            onClick={() => setActiveTab("dashboard")}
                        >
                            <FaThLarge className={styles.navIcon} />
                            {!sidebarCollapsed && <span>خلاصه آمار و داشبورد</span>}
                        </button>

                        <button
                            className={`${styles.navItem} ${activeTab === "analytics" ? styles.navActive : ""}`}
                            onClick={() => setActiveTab("analytics")}
                        >
                            <FaChartLine className={styles.navIcon} />
                            {!sidebarCollapsed && <span>تحلیل رشد مقالات و پروژه‌ها</span>}
                        </button>

                        <button
                            className={`${styles.navItem} ${activeTab === "users" ? styles.navActive : ""}`}
                            onClick={() => setActiveTab("users")}
                        >
                            <FaUsers className={styles.navIcon} />
                            {!sidebarCollapsed && (
                                <div className={styles.navTextWithBadge}>
                                    <span>مدیریت کاربران</span>
                                    <span className={styles.badge}>{e2p(users.length)}</span>
                                </div>
                            )}
                        </button>

                        <button
                            className={`${styles.navItem} ${activeTab === "tickets" ? styles.navActive : ""}`}
                            onClick={() => setActiveTab("tickets")}
                        >
                            <FaTicketAlt className={styles.navIcon} />
                            {!sidebarCollapsed && (
                                <div className={styles.navTextWithBadge}>
                                    <span>پشتیبانی و تیکت‌ها</span>
                                    <span className={styles.badgeWarning}>{e2p(tickets.length)}</span>
                                </div>
                            )}
                        </button>

                        <button
                            className={`${styles.navItem} ${activeTab === "projects" ? styles.navActive : ""}`}
                            onClick={() => setActiveTab("projects")}
                        >
                            <FaFolderPlus className={styles.navIcon} />
                            {!sidebarCollapsed && (
                                <div className={styles.navTextWithBadge}>
                                    <span>پروژه‌های درخواستی</span>
                                    <span className={styles.badgeInfo}>{e2p(projects.length)}</span>
                                </div>
                            )}
                        </button>

                        <button
                            className={`${styles.navItem} ${activeTab === "articles" ? styles.navActive : ""}`}
                            onClick={() => setActiveTab("articles")}
                        >
                            <FaNewspaper className={styles.navIcon} />
                            {!sidebarCollapsed && (
                                <div className={styles.navTextWithBadge}>
                                    <span>مدیریت مقالات</span>
                                    <span className={styles.badge}>{e2p(articles.length)}</span>
                                </div>
                            )}
                        </button>
                    </nav>

                    <div className={styles.sidebarFooter}>
                        <button className={styles.backHomeBtn} onClick={() => navigate("/")}>
                            <FaHome />
                            {!sidebarCollapsed && <span>بازگشت به وب‌سایت</span>}
                        </button>
                    </div>
                </aside>

                {/* ========================================================= */}
                {/* محتوای اصلی بخش مدیریت (Main Content Area) */}
                {/* ========================================================= */}
                <main className={styles.mainContent}>
                    {/* هدر بالای محتوا */}
                    <header className={styles.topHeader}>
                        <div className={styles.topHeaderTitle}>
                            <h1>
                                {activeTab === "dashboard" && "داشبورد و آمار کلی سیستم"}
                                {activeTab === "analytics" && "تحلیل رشد مقالات، لایک‌ها و ذخیره‌ها"}
                                {activeTab === "users" && "مدیریت جامع کاربران (افزودن، ویرایش، حذف)"}
                                {activeTab === "tickets" && "مركز پشتیبانی و چت زنده تیکت‌ها"}
                                {activeTab === "projects" && "مدیریت پروژه‌های درخواستی کاربران"}
                                {activeTab === "articles" && "مدیریت و انتشار مقالات وبلاگ"}
                            </h1>
                            <p>سامانه مدیریت هوشمند پلتفرم و آنالیز محتوا</p>
                        </div>
                    </header>

                    {errorMessage && (
                        <div className={styles.errorBanner}>
                            <FaExclamationTriangle />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    {/* ========================================================= */}
                    {/* تب ۱: خلاصه آمار و داشبورد کلی */}
                    {/* ========================================================= */}
                    {activeTab === "dashboard" && (
                        <section className={styles.dashboardSection}>
                            {/* کارت‌های شاخص کلیدی (KPIs) */}
                            <div className={styles.statsGrid}>
                                <div className={styles.statCard}>
                                    <div className={`${styles.statIcon} ${styles.iconPurple}`}>
                                        <FaUsers />
                                    </div>
                                    <div className={styles.statInfo}>
                                        <span>کل کاربران</span>
                                        <h3>{e2p(users.length)} نفر</h3>
                                        <small className={styles.textSuccess}>
                                            {e2p(users.filter((u) => u.role === "admin").length)} مدیر - {" "}
                                            {e2p(users.filter((u) => u.role !== "admin").length)} کاربر عادی
                                        </small>
                                    </div>
                                </div>

                                <div className={styles.statCard}>
                                    <div className={`${styles.statIcon} ${styles.iconAmber}`}>
                                        <FaTicketAlt />
                                    </div>
                                    <div className={styles.statInfo}>
                                        <span>تیکت‌های پشتیبانی</span>
                                        <h3>{e2p(tickets.length)} تیکت</h3>
                                        <small className={styles.textWarning}>
                                            {e2p(tickets.filter((t) => t.status === "پاسخ داده شده").length)} پاسخ‌داده |{" "}
                                            {e2p(tickets.filter((t) => t.status !== "بسته شده").length)} فعال
                                        </small>
                                    </div>
                                </div>

                                <div className={styles.statCard}>
                                    <div className={`${styles.statIcon} ${styles.iconBlue}`}>
                                        <FaFolderPlus />
                                    </div>
                                    <div className={styles.statInfo}>
                                        <span>پروژه‌های درخواستی</span>
                                        <h3>{e2p(projects.length)} پروژه</h3>
                                        <small className={styles.textInfo}>آماده بررسی و برآورد قیمت</small>
                                    </div>
                                </div>

                                <div className={styles.statCard}>
                                    <div className={`${styles.statIcon} ${styles.iconRed}`}>
                                        <FaHeart />
                                    </div>
                                    <div className={styles.statInfo}>
                                        <span>کل لایک‌ها و ذخیره‌ها</span>
                                        <h3>
                                            {e2p(totalLikes)} <FaHeart style={{ color: "#ef4444", fontSize: "0.9em", verticalAlign: "middle" }} /> / {e2p(totalSaves)} <FaBookmark style={{ color: "#2563eb", fontSize: "0.9em", verticalAlign: "middle" }} />
                                        </h3>
                                        <small className={styles.textSuccess}>
                                            از مجمع {totalViews.toLocaleString("fa-IR")} بازدید مقالات و پروژه‌ها
                                        </small>
                                    </div>
                                </div>
                            </div>

                            {/* نمودارهای داشبورد */}
                            <div className={styles.chartsGrid}>
                                <div className={styles.chartBox}>
                                    <div className={styles.chartHeader}>
                                        <h3><FaChartLine /> روند تعاملات و بازدیدهای سیستم (۶ ماه اخیر)</h3>
                                    </div>
                                    <div className={styles.chartContainer}>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <AreaChart data={monthlyGrowthData}>
                                                <defs>
                                                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                                    </linearGradient>
                                                    <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
                                                        <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                                <XAxis dataKey="month" stroke="#64748b" />
                                                <YAxis stroke="#64748b" />
                                                <Tooltip contentStyle={{ borderRadius: "8px", direction: "rtl" }} />
                                                <Legend />
                                                <Area
                                                    type="monotone"
                                                    dataKey="بازدید"
                                                    stroke="#6366f1"
                                                    fillOpacity={1}
                                                    fill="url(#colorViews)"
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="لایک"
                                                    stroke="#ec4899"
                                                    fillOpacity={1}
                                                    fill="url(#colorLikes)"
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                <div className={styles.chartBox}>
                                    <div className={styles.chartHeader}>
                                        <h3><FaUsers /> توزیع نقش‌های کاربران</h3>
                                    </div>
                                    <div className={styles.chartContainer}>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={userRolePieData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={90}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                    label
                                                >
                                                    {userRolePieData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* ========================================================= */}
                    {/* تب ۲: تحلیل رشد مقالات و پروژه‌ها */}
                    {/* ========================================================= */}
                    {activeTab === "analytics" && (
                        <section className={styles.analyticsSection}>
                            {/* نمودار میله‌ای لایک‌ها و ذخیره‌های مقالات برتر */}
                            <div className={styles.chartBoxFull}>
                                <div className={styles.chartHeader}>
                                    <h3>
                                        <FaChartLine /> نمودار مقایسه‌ای مقدار لایک و ذخیره در مقالات برتر
                                    </h3>
                                </div>
                                <div className={styles.chartContainer}>
                                    <ResponsiveContainer width="100%" height={320}>
                                        <BarChart data={articlesChartData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                            <XAxis dataKey="name" stroke="#64748b" />
                                            <YAxis stroke="#64748b" />
                                            <Tooltip contentStyle={{ borderRadius: "8px", direction: "rtl" }} />
                                            <Legend />
                                            <Bar dataKey="لایک" fill="#ec4899" radius={[6, 6, 0, 0]} />
                                            <Bar dataKey="ذخیره" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* جدول تحلیلی رشد تک تک مقالات */}
                            <div className={styles.sectionHeader}>
                                <h2>جدول رشد و آمار تفکیکی مقالات (تعداد لایک، ذخیره و بازدید)</h2>
                            </div>

                            <div className={styles.analyticsCardsGrid}>
                                {enrichedArticles.map((art) => (
                                    <div key={art.id} className={styles.analyticsCard}>
                                        <div className={styles.analyticsCardTop}>
                                            <img
                                                src={art.image}
                                                alt={art.title}
                                                className={styles.analyticsThumb}
                                            />
                                            <div className={styles.analyticsCardTitle}>
                                                <h4>{art.title}</h4>
                                                <span className={styles.categoryBadge}>{art.category || "مقاله"}</span>
                                            </div>
                                        </div>

                                        <div className={styles.metricsRow}>
                                            <div className={styles.metricBox}>
                                                <FaEye className={styles.iconEye} />
                                                <strong>{art.views?.toLocaleString("fa-IR")}</strong>
                                                <span>بازدید</span>
                                            </div>
                                            <div className={styles.metricBox}>
                                                <FaHeart className={styles.iconHeart} />
                                                <strong>{art.likes}</strong>
                                                <span>لایک</span>
                                            </div>
                                            <div className={styles.metricBox}>
                                                <FaBookmark className={styles.iconSave} />
                                                <strong>{art.saves}</strong>
                                                <span>ذخیره</span>
                                            </div>
                                            <div className={styles.metricBox}>
                                                <span className={styles.textGrowth}>+{art.growthPercent}%</span>
                                                <strong>{art.engagement}%</strong>
                                                <span>نرخ تعامل</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* جدول تحلیلی پروژه‌ها */}
                            <div className={styles.sectionHeader} style={{ marginTop: "32px" }}>
                                <h2>جدول رشد و آمار تعاملی پروژه‌ها و نمونه‌کارها</h2>
                            </div>

                            <div className={styles.analyticsCardsGrid}>
                                {enrichedPortfolios.map((port) => (
                                    <div key={port.id} className={styles.analyticsCard}>
                                        <div className={styles.analyticsCardTop}>
                                            <img
                                                src={port.image}
                                                alt={port.title}
                                                className={styles.analyticsThumb}
                                            />
                                            <div className={styles.analyticsCardTitle}>
                                                <h4>{port.title}</h4>
                                                <span className={styles.categoryBadge}>{port.category || "پروژه"}</span>
                                            </div>
                                        </div>

                                        <div className={styles.metricsRow}>
                                            <div className={styles.metricBox}>
                                                <FaEye className={styles.iconEye} />
                                                <strong>{port.views?.toLocaleString("fa-IR")}</strong>
                                                <span>بازدید</span>
                                            </div>
                                            <div className={styles.metricBox}>
                                                <FaHeart className={styles.iconHeart} />
                                                <strong>{port.likes}</strong>
                                                <span>لایک</span>
                                            </div>
                                            <div className={styles.metricBox}>
                                                <FaBookmark className={styles.iconSave} />
                                                <strong>{port.saves}</strong>
                                                <span>ذخیره</span>
                                            </div>
                                            <div className={styles.metricBox}>
                                                <span className={styles.textGrowth}>+{port.growthPercent}%</span>
                                                <strong>{port.engagement}%</strong>
                                                <span>نرخ تعامل</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* ========================================================= */}
                    {/* تب ۳: مدیریت کاربران (CRUD کامل) */}
                    {/* ========================================================= */}
                    {activeTab === "users" && (
                        <section className={styles.usersSection}>
                            {/* نوار ابزار جستجو و افزودن کاربر */}
                            <div className={styles.toolbar}>
                                <div className={styles.searchBox}>
                                    <FaSearch />
                                    <input
                                        type="text"
                                        placeholder="جستجوی کاربر با نام، ایمیل یا تلفن..."
                                        value={searchUser}
                                        onChange={(e) => setSearchUser(e.target.value)}
                                    />
                                </div>

                                <div className={styles.filterBox}>
                                    <FaFilter />
                                    <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                                        <option value="all">همه نقش‌ها ({e2p(users.length)})</option>
                                        <option value="admin">
                                            مدیران ({e2p(users.filter((u) => u.role === "admin").length)})
                                        </option>
                                        <option value="user">
                                            کاربران عادی ({e2p(users.filter((u) => u.role !== "admin").length)})
                                        </option>
                                    </select>
                                </div>

                                <button
                                    className={styles.addUserBtn}
                                    onClick={() => setIsAddUserModalOpen(true)}
                                >
                                    <FaUserPlus /> <span>افزودن کاربر جدید</span>
                                </button>
                            </div>

                            {/* جدول لیست کاربران */}
                            <div className={styles.tableResponsive}>
                                <table className={styles.dataTable}>
                                    <thead>
                                        <tr>
                                            <th>کاربر</th>
                                            <th>آدرس ایمیل</th>
                                            <th>شماره تماس</th>
                                            <th>سطح دسترسی</th>
                                            <th>وضعیت</th>
                                            <th>عملیات مدیریت</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className={styles.emptyTable}>
                                                    هیچ کاربری با این مشخصات یافت نشد.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredUsers.map((u) => (
                                                <tr key={u.id}>
                                                    <td>
                                                        <div className={styles.userCell}>
                                                            <div className={styles.userAvatar}>
                                                                {u.name ? u.name.slice(0, 2) : "U"}
                                                            </div>
                                                            <strong>{u.name || "کاربر سیستم"}</strong>
                                                        </div>
                                                    </td>
                                                    <td dir="ltr">{u.email}</td>
                                                    <td dir="ltr">{u.phone || "-"}</td>
                                                    <td>
                                                        <span
                                                            className={
                                                                u.role === "admin"
                                                                    ? styles.adminBadge
                                                                    : styles.userBadge
                                                            }
                                                        >
                                                            {u.role === "admin" ? "مدیر سیستم" : "کاربر عادی"}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span
                                                            className={
                                                                u.status === "disabled"
                                                                    ? styles.statusDark
                                                                    : styles.statusSuccess
                                                            }
                                                        >
                                                            {u.status === "disabled" ? "مسدود" : "فعال"}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className={styles.actionGroup}>
                                                            <button
                                                                className={styles.btnEdit}
                                                                onClick={() => {
                                                                    setEditingUser(u);
                                                                    setEditUserForm({
                                                                        name: u.name || "",
                                                                        email: u.email || "",
                                                                        role: u.role || "user",
                                                                        phone: u.phone || "",
                                                                        status: u.status || "active",
                                                                    });
                                                                    setIsEditUserModalOpen(true);
                                                                }}
                                                                title="ویرایش کاربر"
                                                            >
                                                                <FaUserEdit />
                                                            </button>

                                                            <button
                                                                className={styles.btnRole}
                                                                onClick={() => handleToggleRole(u.id, u.role)}
                                                                title="تغییر نقش دسترسی"
                                                            >
                                                                {u.role === "admin" ? <FaUserMinus /> : <FaUserShield />}
                                                            </button>

                                                            <button
                                                                className={styles.btnDelete}
                                                                onClick={() => setUserToDelete(u)}
                                                                title="حذف کاربر"
                                                            >
                                                                <FaTrashAlt />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* مودال افزودن کاربر جدید */}
                            {isAddUserModalOpen && (
                                <div
                                    className={styles.modalBackdrop}
                                    onClick={(e) => {
                                        if (e.target === e.currentTarget) setIsAddUserModalOpen(false);
                                    }}
                                >
                                    <div className={styles.modalWindow}>
                                        <div className={styles.modalHeader}>
                                            <h3><FaUserPlus /> افزودن کاربر جدید</h3>
                                            <button
                                                className={styles.closeBtn}
                                                onClick={() => setIsAddUserModalOpen(false)}
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>
                                        <form onSubmit={handleAddUserSubmit} className={styles.modalForm}>
                                            <div className={styles.formGroup}>
                                                <label>نام و نام خانوادگی:</label>
                                                <input
                                                    type="text"
                                                    placeholder="مثال: علی رضایی"
                                                    value={newUserForm.name}
                                                    onChange={(e) =>
                                                        setNewUserForm({ ...newUserForm, name: e.target.value })
                                                    }
                                                    required
                                                />
                                            </div>

                                            <div className={styles.formGroup}>
                                                <label>آدرس ایمیل:</label>
                                                <input
                                                    type="email"
                                                    placeholder="example@gmail.com"
                                                    value={newUserForm.email}
                                                    onChange={(e) =>
                                                        setNewUserForm({ ...newUserForm, email: e.target.value })
                                                    }
                                                    required
                                                    dir="ltr"
                                                />
                                            </div>

                                            <div className={styles.formRow}>
                                                <div className={styles.formGroup}>
                                                    <label>نقش دسترسی:</label>
                                                    <select
                                                        value={newUserForm.role}
                                                        onChange={(e) =>
                                                            setNewUserForm({ ...newUserForm, role: e.target.value })
                                                        }
                                                    >
                                                        <option value="user">کاربر عادی</option>
                                                        <option value="admin">مدیر سیستم (Admin)</option>
                                                    </select>
                                                </div>

                                                <div className={styles.formGroup}>
                                                    <label>شماره تماس:</label>
                                                    <input
                                                        type="text"
                                                        placeholder="09121112233"
                                                        value={newUserForm.phone}
                                                        onChange={(e) =>
                                                            setNewUserForm({ ...newUserForm, phone: e.target.value })
                                                        }
                                                        dir="ltr"
                                                    />
                                                </div>
                                            </div>

                                            <div className={styles.modalFooter}>
                                                <button type="submit" className={styles.saveBtn}>
                                                    <FaCheck /> ثبت کاربر جدید
                                                </button>
                                                <button
                                                    type="button"
                                                    className={styles.cancelBtn}
                                                    onClick={() => setIsAddUserModalOpen(false)}
                                                >
                                                    انصراف
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}

                            {/* مودال ویرایش کاربر */}
                            {isEditUserModalOpen && editingUser && (
                                <div
                                    className={styles.modalBackdrop}
                                    onClick={(e) => {
                                        if (e.target === e.currentTarget) setIsEditUserModalOpen(false);
                                    }}
                                >
                                    <div className={styles.modalWindow}>
                                        <div className={styles.modalHeader}>
                                            <h3><FaUserEdit /> ویرایش اطلاعات کاربر</h3>
                                            <button
                                                className={styles.closeBtn}
                                                onClick={() => setIsEditUserModalOpen(false)}
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>
                                        <form onSubmit={handleEditUserSubmit} className={styles.modalForm}>
                                            <div className={styles.formGroup}>
                                                <label>نام و نام خانوادگی:</label>
                                                <input
                                                    type="text"
                                                    value={editUserForm.name}
                                                    onChange={(e) =>
                                                        setEditUserForm({ ...editUserForm, name: e.target.value })
                                                    }
                                                    required
                                                />
                                            </div>

                                            <div className={styles.formGroup}>
                                                <label>آدرس ایمیل:</label>
                                                <input
                                                    type="email"
                                                    value={editUserForm.email}
                                                    onChange={(e) =>
                                                        setEditUserForm({ ...editUserForm, email: e.target.value })
                                                    }
                                                    required
                                                    dir="ltr"
                                                />
                                            </div>

                                            <div className={styles.formRow}>
                                                <div className={styles.formGroup}>
                                                    <label>نقش دسترسی:</label>
                                                    <select
                                                        value={editUserForm.role}
                                                        onChange={(e) =>
                                                            setEditUserForm({ ...editUserForm, role: e.target.value })
                                                        }
                                                    >
                                                        <option value="user">کاربر عادی</option>
                                                        <option value="admin">مدیر سیستم (Admin)</option>
                                                    </select>
                                                </div>

                                                <div className={styles.formGroup}>
                                                    <label>وضعیت حساب:</label>
                                                    <select
                                                        value={editUserForm.status}
                                                        onChange={(e) =>
                                                            setEditUserForm({ ...editUserForm, status: e.target.value })
                                                        }
                                                    >
                                                        <option value="active">فعال</option>
                                                        <option value="disabled">مسدود شده</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className={styles.formGroup}>
                                                <label>شماره تماس:</label>
                                                <input
                                                    type="text"
                                                    value={editUserForm.phone}
                                                    onChange={(e) =>
                                                        setEditUserForm({ ...editUserForm, phone: e.target.value })
                                                    }
                                                    dir="ltr"
                                                />
                                            </div>

                                            <div className={styles.modalFooter}>
                                                <button type="submit" className={styles.saveBtn}>
                                                    ذخیره تغییرات
                                                </button>
                                                <button
                                                    type="button"
                                                    className={styles.cancelBtn}
                                                    onClick={() => setIsEditUserModalOpen(false)}
                                                >
                                                    انصراف
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}

                            {/* مودال تأیید حذف کاربر */}
                            {userToDelete && (
                                <div
                                    className={styles.modalBackdrop}
                                    onClick={(e) => {
                                        if (e.target === e.currentTarget && !isDeletingUser) setUserToDelete(null);
                                    }}
                                >
                                    <div className={styles.modalWindow}>
                                        <div className={styles.modalHeader}>
                                            <h3 style={{ color: "#dc2626" }}>
                                                <FaExclamationTriangle /> تأیید حذف دائمی کاربر
                                            </h3>
                                            <button
                                                className={styles.closeBtn}
                                                onClick={() => setUserToDelete(null)}
                                                disabled={isDeletingUser}
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>

                                        <div className={styles.modalForm}>
                                            <div className={styles.warningBox}>
                                                <p>
                                                    آیا از حذف دائمی این کاربر از سیستم اطمینان دارید؟ این عملیات <strong>غیرقابل بازگشت</strong> است و کلیه اطلاعات مربوطه پاک خواهد شد.
                                                </p>
                                                <div className={styles.warningUserPreview}>
                                                    <div>
                                                        <strong>{userToDelete.name || "کاربر سیستم"}</strong>
                                                        <div style={{ fontSize: "0.8rem", color: "#64748b" }} dir="ltr">
                                                            {userToDelete.email}
                                                        </div>
                                                    </div>
                                                    <span
                                                        className={
                                                            userToDelete.role === "admin"
                                                                ? styles.adminBadge
                                                                : styles.userBadge
                                                        }
                                                    >
                                                        {userToDelete.role === "admin" ? "مدیر سیستم" : "کاربر عادی"}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className={styles.modalFooter}>
                                                <button
                                                    type="button"
                                                    className={styles.dangerConfirmBtn}
                                                    onClick={confirmDeleteUser}
                                                    disabled={isDeletingUser}
                                                >
                                                    {isDeletingUser ? <FaSpinner className="spinIcon" /> : <FaTrashAlt />}
                                                    <span>حذف دائمی کاربر</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    className={styles.cancelBtn}
                                                    onClick={() => setUserToDelete(null)}
                                                    disabled={isDeletingUser}
                                                >
                                                    انصراف
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </section>
                    )}

                    {/* ========================================================= */}
                    {/* تب ۴: تیکت‌ها و گفتگوی چت */}
                    {/* ========================================================= */}
                    {activeTab === "tickets" && (
                        <section className={styles.ticketsSection}>
                            {tickets.length === 0 ? (
                                <p className={styles.emptyMsg}>هیچ تیکتی برای بررسی وجود ندارد.</p>
                            ) : (
                                <div className={styles.cardsGrid}>
                                    {tickets.map((t) => {
                                        const tMessages = getNormalizedMessages(t);
                                        const lastMsg =
                                            tMessages.length > 0 ? tMessages[tMessages.length - 1]?.text : "بدون متن";
                                        const isClosed = t.status === "بسته شده" || t.status === "closed";
                                        const isAnswered = t.status === "پاسخ داده شده" || t.status === "answered";

                                        return (
                                            <div key={t.id} className={styles.card}>
                                                <div className={styles.cardHeader}>
                                                    <h4>{t.title || "تیکت بدون عنوان"}</h4>
                                                    <span
                                                        className={`${styles.statusBadge} ${isAnswered
                                                            ? styles.statusSuccess
                                                            : isClosed
                                                                ? styles.statusDark
                                                                : styles.statusWarning
                                                            }`}
                                                    >
                                                        {isAnswered && "پاسخ داده شده"}
                                                        {isClosed && "بسته شده"}
                                                        {!isAnswered && !isClosed && "در حال بررسی"}
                                                    </span>
                                                </div>

                                                <p className={styles.cardText}>آخرین پیام: {lastMsg}</p>
                                                <div className={styles.cardMeta}>
                                                    <small>فرستنده: {t.userName || t.userEmail || t.userId}</small>
                                                    <small>{t.date || "ثبت شده"}</small>
                                                </div>

                                                <div className={styles.cardActions}>
                                                    <button
                                                        className={styles.primaryBtn}
                                                        onClick={() => {
                                                            setSelectedTicket(t);
                                                            setTicketReply("");
                                                        }}
                                                    >
                                                        <FaComments /> مشاهده گفتگو و پاسخ
                                                    </button>
                                                    {!isClosed && (
                                                        <button
                                                            className={styles.secondaryBtn}
                                                            onClick={() => handleCloseTicket(t.id)}
                                                        >
                                                            بستن تیکت
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* پنجره چت تیکت */}
                            {selectedTicket && (
                                <div
                                    className={styles.modalBackdrop}
                                    onClick={(e) => {
                                        if (e.target === e.currentTarget) setSelectedTicket(null);
                                    }}
                                >
                                    <div className={styles.chatModalWindow}>
                                        <div className={styles.chatModalHeader}>
                                            <div className={styles.chatHeaderTitle}>
                                                <h3>تیکت: {selectedTicket.title}</h3>
                                                <span>
                                                    کاربر: {selectedTicket.userName || selectedTicket.userEmail || "کاربر"}{" "}
                                                    | کد: {selectedTicket.id?.slice(0, 8)}
                                                </span>
                                            </div>
                                            <div className={styles.chatHeaderControls}>
                                                <select
                                                    className={styles.statusSelect}
                                                    value={
                                                        selectedTicket.status === "answered"
                                                            ? "پاسخ داده شده"
                                                            : selectedTicket.status === "closed"
                                                                ? "بسته شده"
                                                                : selectedTicket.status || "در حال بررسی"
                                                    }
                                                    onChange={(e) =>
                                                        handleUpdateTicketStatus(selectedTicket.id, e.target.value)
                                                    }
                                                >
                                                    <option value="در حال بررسی">در حال بررسی</option>
                                                    <option value="پاسخ داده شده">پاسخ داده شده</option>
                                                    <option value="بسته شده">بسته شده</option>
                                                </select>
                                                <button
                                                    type="button"
                                                    className={styles.closeChatBtn}
                                                    onClick={() => setSelectedTicket(null)}
                                                    title="بستن گفتگو"
                                                >
                                                    <FaTimes />
                                                </button>
                                            </div>
                                        </div>

                                        <div className={styles.chatMessagesContainer}>
                                            {getNormalizedMessages(selectedTicket).map((msg, idx) => {
                                                const isAdminMsg = msg.sender === "admin" || msg.sender === "support";
                                                return (
                                                    <div
                                                        key={idx}
                                                        className={`${styles.chatBubble} ${isAdminMsg ? styles.chatBubbleAdmin : styles.chatBubbleUser
                                                            }`}
                                                    >
                                                        <div className={styles.chatBubbleHeader}>
                                                            <strong>
                                                                {isAdminMsg
                                                                    ? msg.senderName || "پشتیبانی "
                                                                    : msg.senderName ||
                                                                    selectedTicket.userName ||
                                                                    selectedTicket.userEmail ||
                                                                    "کاربر"}
                                                            </strong>
                                                            <span>{msg.time}</span>
                                                        </div>
                                                        <p className={styles.chatBubbleText}>{msg.text}</p>
                                                    </div>
                                                );
                                            })}
                                            <div ref={adminChatEndRef} />
                                        </div>

                                        <form onSubmit={handleSendTicketReply} className={styles.chatReplyForm}>
                                            <textarea
                                                rows="2"
                                                className={styles.chatReplyInput}
                                                placeholder="جواب بدهید ..."
                                                value={ticketReply}
                                                onChange={(e) => setTicketReply(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter" && !e.shiftKey) {
                                                        e.preventDefault();
                                                        handleSendTicketReply(e);
                                                    }
                                                }}
                                            ></textarea>
                                            <button
                                                type="submit"
                                                className={styles.chatSendBtn}
                                                disabled={!ticketReply.trim()}
                                            >
                                                <span>ارسال</span>
                                                <RiSendInsFill />
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </section>
                    )}

                    {/* ========================================================= */}
                    {/* تب ۵: مدیریت پروژه‌های درخواستی */}
                    {/* ========================================================= */}
                    {activeTab === "projects" && (
                        <section className={styles.projectsSection}>
                            {projects.length === 0 ? (
                                <p className={styles.emptyMsg}>هیچ پروژه درخواستی ثبت نشده است.</p>
                            ) : (
                                <div className={styles.cardsGrid}>
                                    {projects.map((p) => (
                                        <div key={p.id} className={styles.card}>
                                            <div className={styles.cardHeader}>
                                                <h4>{p.title || "عنوان پروژه"}</h4>
                                                <select
                                                    value={p.status || "in_review"}
                                                    onChange={(e) => handleUpdateProjectStatus(p.id, e.target.value)}
                                                    className={styles.statusSelect}
                                                >
                                                    <option value="in_review">در حال بررسی</option>
                                                    <option value="approved">تایید شده / در حال انجام</option>
                                                    <option value="rejected">رد شده</option>
                                                    <option value="completed">تکمیل شده</option>
                                                </select>
                                            </div>

                                            <p className={styles.cardText}>{p.description}</p>

                                            <div className={styles.cardMeta}>
                                                <span>بودجه کاربر: {p.budget || "تعیین نشده"}</span>
                                                <small>کاربر: {p.userEmail || p.userId}</small>
                                            </div>

                                            {p.adminNote && (
                                                <div className={styles.adminReplyBox}>
                                                    <strong>برآورد ادمین:</strong>
                                                    <p>{p.adminNote}</p>
                                                </div>
                                            )}

                                            <div className={styles.cardActions}>
                                                <button
                                                    className={styles.primaryBtn}
                                                    onClick={() => {
                                                        setSelectedProject(p);
                                                        setProjectNote(p.adminNote || "");
                                                    }}
                                                >
                                                    برآورد و یادداشت ادمین
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {selectedProject && (
                                <div className={styles.modalBackdrop}>
                                    <div className={styles.modalWindow}>
                                        <div className={styles.modalHeader}>
                                            <h3>برآورد و ثبت یادداشت برای پروژه: {selectedProject.title}</h3>
                                            <button
                                                className={styles.closeBtn}
                                                onClick={() => setSelectedProject(null)}
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>
                                        <form onSubmit={handleSaveProjectNote} className={styles.modalForm}>
                                            <textarea
                                                rows="4"
                                                placeholder="هزینه پیشنهادی، زمان‌بندی یا توضیحات پروژه..."
                                                value={projectNote}
                                                onChange={(e) => setProjectNote(e.target.value)}
                                                required
                                                className={styles.textAreaInput}
                                            ></textarea>
                                            <div className={styles.modalFooter}>
                                                <button type="submit" className={styles.saveBtn}>
                                                    ثبت توضیحات
                                                </button>
                                                <button
                                                    type="button"
                                                    className={styles.cancelBtn}
                                                    onClick={() => setSelectedProject(null)}
                                                >
                                                    انصراف
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </section>
                    )}

                    {/* ========================================================= */}
                    {/* تب ۶: مدیریت مقالات وبلاگ */}
                    {/* ========================================================= */}
                    {activeTab === "articles" && (
                        <section className={styles.articlesSection}>
                            <div className={styles.toolbar}>
                                <div className={styles.searchBox}>
                                    <FaSearch />
                                    <input
                                        type="text"
                                        placeholder="جستجو در عنوان مقالات..."
                                        value={searchArticle}
                                        onChange={(e) => setSearchArticle(e.target.value)}
                                    />
                                </div>

                                <button
                                    className={styles.addUserBtn}
                                    onClick={() => setIsAddArticleModalOpen(true)}
                                >
                                    <FaPlus /> <span>افزودن مقاله جدید</span>
                                </button>
                            </div>

                            <div className={styles.cardsGrid}>
                                {filteredArticles.map((art) => (
                                    <div key={art.id} className={styles.card}>
                                        <div className={styles.articleCardTop}>
                                            <img
                                                src={art.image}
                                                alt={art.title}
                                                className={styles.articleCardImage}
                                            />
                                            <div className={styles.articleCardInfo}>
                                                <h4>{art.title}</h4>
                                                <span className={styles.categoryBadge}>{art.category || "مقاله"}</span>
                                            </div>
                                        </div>

                                        <p className={styles.cardText}>
                                            {art.description ? art.description.replace(/<[^>]+>/g, "") : ""}
                                        </p>

                                        <div className={styles.cardMeta}>
                                            <span><FaHeart style={{ color: "#ef4444", marginLeft: "4px" }} /> {e2p(art.likes || 0)} لایک | <FaBookmark style={{ color: "#2563eb", marginLeft: "4px" }} /> {e2p(art.saves || 0)} ذخیره</span>
                                            <small>{art.author || "بهراد هاشمی"}</small>
                                        </div>

                                        <div className={styles.cardActions}>
                                            <button
                                                className={styles.secondaryBtn}
                                                onClick={() => {
                                                    setEditingArticle(art);
                                                    setEditArticleForm({
                                                        title: art.title || "",
                                                        description: art.description ? art.description.replace(/<[^>]+>/g, "") : "",
                                                        image: art.image || "",
                                                        category: art.category || "",
                                                        tags: art.tags || "",
                                                    });
                                                    setIsEditArticleModalOpen(true);
                                                }}
                                            >
                                                <FaEdit /> ویرایش
                                            </button>
                                            <button
                                                className={styles.deleteBtn}
                                                onClick={() => setArticleToDelete(art)}
                                            >
                                                <FaTrashAlt />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* مودال افزودن مقاله جدید */}
                            {isAddArticleModalOpen && (
                                <div
                                    className={styles.modalBackdrop}
                                    onClick={(e) => {
                                        if (e.target === e.currentTarget) setIsAddArticleModalOpen(false);
                                    }}
                                >
                                    <div className={styles.modalWindow}>
                                        <div className={styles.modalHeader}>
                                            <h3><FaPlus /> افزودن مقاله جدید</h3>
                                            <button
                                                className={styles.closeBtn}
                                                onClick={() => setIsAddArticleModalOpen(false)}
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>
                                        <form onSubmit={handleAddArticleSubmit} className={styles.modalForm}>
                                            <div className={styles.formGroup}>
                                                <label>عنوان مقاله:</label>
                                                <input
                                                    type="text"
                                                    placeholder="مثال: آموزش کاربردی React 19"
                                                    value={newArticleForm.title}
                                                    onChange={(e) =>
                                                        setNewArticleForm({ ...newArticleForm, title: e.target.value })
                                                    }
                                                    required
                                                />
                                            </div>

                                            <div className={styles.formRow}>
                                                <div className={styles.formGroup}>
                                                    <label>دسته‌بندی:</label>
                                                    <input
                                                        type="text"
                                                        placeholder="فرانت‌اند، هوش مصنوعی، و..."
                                                        value={newArticleForm.category}
                                                        onChange={(e) =>
                                                            setNewArticleForm({ ...newArticleForm, category: e.target.value })
                                                        }
                                                    />
                                                </div>
                                                <div className={styles.formGroup}>
                                                    <label>تصویر مقاله (URL):</label>
                                                    <input
                                                        type="text"
                                                        placeholder="https://..."
                                                        value={newArticleForm.image}
                                                        onChange={(e) =>
                                                            setNewArticleForm({ ...newArticleForm, image: e.target.value })
                                                        }
                                                        dir="ltr"
                                                    />
                                                </div>
                                            </div>

                                            <div className={styles.formGroup}>
                                                <label>متن مقاله:</label>
                                                <textarea
                                                    rows="5"
                                                    placeholder="توضیحات و متن مقاله..."
                                                    value={newArticleForm.description}
                                                    onChange={(e) =>
                                                        setNewArticleForm({ ...newArticleForm, description: e.target.value })
                                                    }
                                                    required
                                                    className={styles.textAreaInput}
                                                ></textarea>
                                            </div>

                                            <div className={styles.modalFooter}>
                                                <button type="submit" className={styles.saveBtn}>
                                                    انتشار مقاله
                                                </button>
                                                <button
                                                    type="button"
                                                    className={styles.cancelBtn}
                                                    onClick={() => setIsAddArticleModalOpen(false)}
                                                >
                                                    انصراف
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}

                            {/* مودال ویرایش مقاله */}
                            {isEditArticleModalOpen && editingArticle && (
                                <div
                                    className={styles.modalBackdrop}
                                    onClick={(e) => {
                                        if (e.target === e.currentTarget) setIsEditArticleModalOpen(false);
                                    }}
                                >
                                    <div className={styles.modalWindow}>
                                        <div className={styles.modalHeader}>
                                            <h3><FaEdit /> ویرایش مقاله</h3>
                                            <button
                                                className={styles.closeBtn}
                                                onClick={() => setIsEditArticleModalOpen(false)}
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>
                                        <form onSubmit={handleEditArticleSubmit} className={styles.modalForm}>
                                            <div className={styles.formGroup}>
                                                <label>عنوان مقاله:</label>
                                                <input
                                                    type="text"
                                                    value={editArticleForm.title}
                                                    onChange={(e) =>
                                                        setEditArticleForm({ ...editArticleForm, title: e.target.value })
                                                    }
                                                    required
                                                />
                                            </div>

                                            <div className={styles.formRow}>
                                                <div className={styles.formGroup}>
                                                    <label>دسته‌بندی:</label>
                                                    <input
                                                        type="text"
                                                        value={editArticleForm.category}
                                                        onChange={(e) =>
                                                            setEditArticleForm({ ...editArticleForm, category: e.target.value })
                                                        }
                                                    />
                                                </div>
                                                <div className={styles.formGroup}>
                                                    <label>آدرس تصویر (URL):</label>
                                                    <input
                                                        type="text"
                                                        value={editArticleForm.image}
                                                        onChange={(e) =>
                                                            setEditArticleForm({ ...editArticleForm, image: e.target.value })
                                                        }
                                                        dir="ltr"
                                                    />
                                                </div>
                                            </div>

                                            <div className={styles.formGroup}>
                                                <label>متن مقاله:</label>
                                                <textarea
                                                    rows="5"
                                                    value={editArticleForm.description}
                                                    onChange={(e) =>
                                                        setEditArticleForm({ ...editArticleForm, description: e.target.value })
                                                    }
                                                    required
                                                    className={styles.textAreaInput}
                                                ></textarea>
                                            </div>

                                            <div className={styles.modalFooter}>
                                                <button type="submit" className={styles.saveBtn}>
                                                    ذخیره تغییرات
                                                </button>
                                                <button
                                                    type="button"
                                                    className={styles.cancelBtn}
                                                    onClick={() => setIsEditArticleModalOpen(false)}
                                                >
                                                    انصراف
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}

                            {/* مودال تأیید حذف مقاله */}
                            {articleToDelete && (
                                <div
                                    className={styles.modalBackdrop}
                                    onClick={(e) => {
                                        if (e.target === e.currentTarget && !isDeletingArticle) setArticleToDelete(null);
                                    }}
                                >
                                    <div className={styles.modalWindow}>
                                        <div className={styles.modalHeader}>
                                            <h3 style={{ color: "#dc2626" }}>
                                                <FaExclamationTriangle /> تأیید حذف مقاله
                                            </h3>
                                            <button
                                                className={styles.closeBtn}
                                                onClick={() => setArticleToDelete(null)}
                                                disabled={isDeletingArticle}
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>

                                        <div className={styles.modalForm}>
                                            <div className={styles.warningBox}>
                                                <p>آیا از حذف دائمی این مقاله اطمینان دارید؟</p>
                                                <div className={styles.warningUserPreview}>
                                                    <strong>{articleToDelete.title}</strong>
                                                </div>
                                            </div>

                                            <div className={styles.modalFooter}>
                                                <button
                                                    type="button"
                                                    className={styles.dangerConfirmBtn}
                                                    onClick={confirmDeleteArticle}
                                                    disabled={isDeletingArticle}
                                                >
                                                    {isDeletingArticle ? <FaSpinner className="spinIcon" /> : <FaTrashAlt />}
                                                    <span>حذف مقاله</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    className={styles.cancelBtn}
                                                    onClick={() => setArticleToDelete(null)}
                                                    disabled={isDeletingArticle}
                                                >
                                                    انصراف
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </section>
                    )}
                </main>
            </div>
            <ToastContainer position="top-center" rtl />
        </div>
    );
}
