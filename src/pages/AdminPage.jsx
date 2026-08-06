import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    collection,
    onSnapshot,
    doc,
    updateDoc,
    deleteDoc,
    addDoc,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config"; // مسیر فایل تنظیمات فایربیس خود را بررسی کنید
import useAuth from "../hooks/useAuth";
import styles from "./AdminPage.module.css";

import {
    FaUsers,
    FaTicketAlt,
    FaFolderPlus,
    FaShieldAlt,
    FaUserShield,
    FaUserMinus,
    FaTrashAlt,
    FaPaperPlane,
    FaCheckCircle,
    FaClock,
    FaExclamationTriangle,
    FaSpinner,
    FaReply,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";

export default function AdminPage() {
    const navigate = useNavigate();
    const { user, isAdmin, loading: authLoading } = useAuth();

    // وضعیت تب فعال: 'users' | 'tickets' | 'projects'
    const [activeTab, setActiveTab] = useState("users");

    // داده‌های اصلی Firestore
    const [users, setUsers] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [projects, setProjects] = useState([]);

    // وضعیت‌های مربوط به پاسخ‌دهی در Modal/Form
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [ticketReply, setTicketReply] = useState("");

    const [selectedProject, setSelectedProject] = useState(null);
    const [projectNote, setProjectNote] = useState("");

    const [dataLoading, setDataLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    // ۱. گارد امنیتی: اگر کاربر ادمین نباشد، به صفحه اصلی منتقل می‌شود
    useEffect(() => {
        if (!authLoading && (!user || !isAdmin)) {
            navigate("/", { replace: true });
        }
    }, [user, isAdmin, authLoading, navigate]);

    // ۲. دریافت اطلاعات زنده از Firestore پس از احراز هویت ادمین
    useEffect(() => {
        if (authLoading || !user || !isAdmin) return;

        setDataLoading(true);

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
                setTickets(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
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

        return () => {
            unsubUsers();
            unsubTickets();
            unsubProjects();
        };
    }, [user, isAdmin, authLoading]);

    // --- عملیات مدیریت کاربران ---
    const handleToggleRole = async (userId, currentRole) => {
        try {
            const newRole = currentRole === "admin" ? "user" : "admin";
            await updateDoc(doc(db, "users", userId), { role: newRole });
        } catch (err) {
            toast.info("تغییر نقش با خطا مواجه شد.", {});
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("آیا از حذف این کاربر مطمئن هستید؟")) return;
        try {
            await deleteDoc(doc(db, "users", userId));
        } catch (err) {
            toast.info("خطا در حذف کاربر.", {});
        }
    };

    // --- عملیات پاسخ‌گویی به تیکت‌ها ---
    const handleSendTicketReply = async (e) => {
        e.preventDefault();

        if (!selectedTicket?.id || !ticketReply.trim()) return;

        try {
            const ticketRef = doc(db, "tickets", selectedTicket.id);

            await updateDoc(ticketRef, {
                adminReply: ticketReply.trim(),
                status: "answered",
                updatedAt: serverTimestamp(),
            });

            alert("پاسخ با موفقیت ثبت شد!");
            setSelectedTicket(null);
            setTicketReply("");
        } catch (err) {
            console.error("خطای ویرایش تیکت:", err);
            alert(`خطا: ${err.message}`);
        }
    };

    const handleCloseTicket = async (ticketId) => {
        try {
            await updateDoc(doc(db, "tickets", ticketId), { status: "closed" });
        } catch (err) {
            toast.info("خطا در بستن تیکت.", {});
        }
    };

    // --- عملیات مدیریت پروژه‌های درخواستی ---
    const handleUpdateProjectStatus = async (projectId, status) => {
        try {
            await updateDoc(doc(db, "projects", projectId), {
                status: status, // 'in_review' | 'approved' | 'rejected' | 'completed'
                updatedAt: serverTimestamp(),
            });
        } catch (err) {
            toast.info("خطا در تغییر وضعیت پروژه.", {});
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
            toast.info("یادداشت و برآورد پروژه ثبت شد.", {});
        } catch (err) {
            toast.info("خطا در ثبت یادداشت.", {});
        }
    };

    // حالت بارگذاری
    if (authLoading || (dataLoading && isAdmin)) {
        return (
            <div className={styles.loadingContainer}>
                <FaSpinner className={styles.spinnerIcon} />
                <h2>در حال احراز هویت و دریافت داده‌های پنل مدیریت...</h2>
            </div>
        );
    }

    if (!isAdmin) return null;

    return (
        <div className={styles.adminContainer}>
            {/* هدر پنل ادمین */}
            <header className={styles.adminHeader}>
                <div className={styles.headerTitle}>
                    <FaShieldAlt className={styles.headerIcon} />
                    <h1>پنل مدیریت جامع (Admin Dashboard)</h1>
                </div>
                <p>مدیریت کامل کاربران، پاسخ به تیکت‌ها و بررسی پروژه‌های درخواستی</p>
            </header>

            {errorMessage && (
                <div className={styles.errorBanner}>
                    <FaExclamationTriangle />
                    <span>{errorMessage}</span>
                </div>
            )}

            {/* منوی تب‌ها */}
            <nav className={styles.tabsNav}>
                <button
                    className={`${styles.tabBtn} ${activeTab === "users" ? styles.activeTab : ""}`}
                    onClick={() => setActiveTab("users")}
                >
                    <FaUsers />
                    <span>کاربران ({users.length})</span>
                </button>

                <button
                    className={`${styles.tabBtn} ${activeTab === "tickets" ? styles.activeTab : ""}`}
                    onClick={() => setActiveTab("tickets")}
                >
                    <FaTicketAlt />
                    <span>تیکت‌ها ({tickets.length})</span>
                </button>

                <button
                    className={`${styles.tabBtn} ${activeTab === "projects" ? styles.activeTab : ""}`}
                    onClick={() => setActiveTab("projects")}
                >
                    <FaFolderPlus />
                    <span>پروژه‌های درخواستی ({projects.length})</span>
                </button>
            </nav>

            {/* ========================================================= */}
            {/* 1. مدیریت کاربران */}
            {/* ========================================================= */}
            {activeTab === "users" && (
                <section className={styles.tabContent}>
                    <table className={styles.dataTable}>
                        <thead>
                            <tr>
                                <th>نام کاربر</th>
                                <th>ایمیل</th>
                                <th>نقش دسترسی</th>
                                <th>عملیات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id}>
                                    <td>{u.name || "کاربر سیستم"}</td>
                                    <td dir="ltr">{u.email}</td>
                                    <td>
                                        <span className={u.role === "admin" ? styles.adminBadge : styles.userBadge}>
                                            {u.role === "admin" ? "مدیر (Admin)" : "کاربر عادي"}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.actionButtons}>
                                            <button
                                                className={styles.roleBtn}
                                                onClick={() => handleToggleRole(u.id, u.role)}
                                                title="تغییر سطح دسترسی"
                                            >
                                                {u.role === "admin" ? <FaUserMinus /> : <FaUserShield />}
                                                <span>{u.role === "admin" ? "تنزل نقش" : "ارتقا به ادمین"}</span>
                                            </button>
                                            <button
                                                className={styles.deleteBtn}
                                                onClick={() => handleDeleteUser(u.id)}
                                                title="حذف کاربر"
                                            >
                                                <FaTrashAlt />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            )}

            {/* ========================================================= */}
            {/* 2. مدیریت تیکت‌ها و پاسخ‌گویی */}
            {/* ========================================================= */}
            {activeTab === "tickets" && (
                <section className={styles.tabContent}>
                    {tickets.length === 0 ? (
                        <p className={styles.emptyMsg}>هیچ تیکتی برای بررسی وجود ندارد.</p>
                    ) : (
                        <div className={styles.cardsGrid}>
                            {tickets.map((t) => (
                                <div key={t.id} className={styles.card}>
                                    <div className={styles.cardHeader}>
                                        <h4>{t.title || "تیکت بدون عنوان"}</h4>
                                        <span
                                            className={`${styles.statusBadge} ${t.status === "answered"
                                                ? styles.statusSuccess
                                                : t.status === "closed"
                                                    ? styles.statusDark
                                                    : styles.statusWarning
                                                }`}
                                        >
                                            {t.status === "answered" && "پاسخ داده شده"}
                                            {t.status === "closed" && "بسته شده"}
                                            {(!t.status || t.status === "pending") && "در انتظار پاسخ"}
                                        </span>
                                    </div>

                                    <p className={styles.cardText}>{t.message || t.description}</p>
                                    <div className={styles.cardMeta}>
                                        <small>فرستنده: {t.userEmail || t.userId}</small>
                                    </div>

                                    {t.adminReply && (
                                        <div className={styles.adminReplyBox}>
                                            <strong>پاسخ فعلی ادمین:</strong>
                                            <p>{t.adminReply}</p>
                                        </div>
                                    )}

                                    <div className={styles.cardActions}>
                                        <button
                                            className={styles.primaryBtn}
                                            onClick={() => {
                                                setSelectedTicket(t);
                                                setTicketReply(t.adminReply || "");
                                            }}
                                        >
                                            <FaReply /> {t.adminReply ? "ویرایش پاسخ" : "پاسخ به تیکت"}
                                        </button>
                                        {t.status !== "closed" && (
                                            <button
                                                className={styles.secondaryBtn}
                                                onClick={() => handleCloseTicket(t.id)}
                                            >
                                                بستن تیکت
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* فرم مودال/باکس ارسال پاسخ تیکت */}
                    {selectedTicket && (
                        <div className={styles.modalBackdrop}>
                            <div className={styles.modalForm}>
                                <h3>پاسخ به تیکت: {selectedTicket.title}</h3>
                                <p><strong>متن پیام کاربر:</strong> {selectedTicket.message}</p>
                                <form onSubmit={handleSendTicketReply}>
                                    <textarea
                                        rows="5"
                                        placeholder="پاسخ خود را بنویسید..."
                                        value={ticketReply}
                                        onChange={(e) => setTicketReply(e.target.value)}
                                        required
                                    ></textarea>
                                    <div className={styles.modalActions}>
                                        <button type="submit" className={styles.submitBtn}>
                                            <FaPaperPlane /> ارسال پاسخ
                                        </button>
                                        <button
                                            type="button"
                                            className={styles.cancelBtn}
                                            onClick={() => setSelectedTicket(null)}
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
            {/* 3. مدیریت پروژه‌های درخواستی کاربران */}
            {/* ========================================================= */}
            {activeTab === "projects" && (
                <section className={styles.tabContent}>
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
                                        <span>بودجه پیشنهادی کاربر: {p.budget || "تعیین نشده"}</span>
                                        <small>کاربر: {p.userEmail || p.userId}</small>
                                    </div>

                                    {p.adminNote && (
                                        <div className={styles.adminReplyBox}>
                                            <strong>توضیحات/برآورد ادمین:</strong>
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
                                            افزودن برآورد / یادداشت ادمین
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* فرم مودال ثبت توضیحات پروژه */}
                    {selectedProject && (
                        <div className={styles.modalBackdrop}>
                            <div className={styles.modalForm}>
                                <h3>برآورد و ثبت یادداشت برای پروژه: {selectedProject.title}</h3>
                                <form onSubmit={handleSaveProjectNote}>
                                    <textarea
                                        rows="4"
                                        placeholder="هزینه پیشنهادی، زمان‌بندی یا توضیحات پروژه را بنویسید..."
                                        value={projectNote}
                                        onChange={(e) => setProjectNote(e.target.value)}
                                        required
                                    ></textarea>
                                    <div className={styles.modalActions}>
                                        <button type="submit" className={styles.submitBtn}>
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
            <ToastContainer position="top-center" rtl />
        </div>
    );
}