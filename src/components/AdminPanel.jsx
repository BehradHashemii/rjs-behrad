import { useState, useEffect } from "react";
import {
  getArticlesFromFirestore,
  addArticleToFirestore,
  deleteArticleFromFirestore,
  getPortfoliosFromFirestore,
  addPortfolioToFirestore,
  deletePortfolioFromFirestore,
  getContactMessagesFromFirestore,
  deleteContactMessageFromFirestore,
  getAllTicketsFromFirestore,
  updateTicketStatusInFirestore,
  addMessageToTicketInFirestore,
  getAllOrdersFromFirestore,
  updateOrderStatusInFirestore,
} from "../services/firestoreService";
import e2p from "../utils/persianNumber";
import mockData from "../data/mockData.json";
import {
  FaNewspaper,
  FaBriefcase,
  FaEnvelope,
  FaTicketAlt,
  FaRocket,
  FaPlus,
  FaTrash,
  FaCheck,
  FaSync,
  FaShieldAlt,
  FaPaperPlane,
} from "react-icons/fa";

export default function AdminPanel() {
  const [adminTab, setAdminTab] = useState("articles"); // 'articles' | 'portfolios' | 'messages' | 'tickets' | 'orders'
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // Firestore Data State
  const [articles, setArticles] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [allTickets, setAllTickets] = useState([]);
  const [allOrders, setAllOrders] = useState([]);

  // Forms State
  const [newArticle, setNewArticle] = useState({
    title: "",
    category: "طراحی وب",
    excerpt: "",
    content: "",
    slug: "",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80",
    author: "بهراد هاشمی",
    readTime: "۵ دقیقه",
  });

  const [newPortfolio, setNewPortfolio] = useState({
    title: "",
    category: "توسعه فرانت‌اند",
    client: "مشتری جدید",
    year: "۱۴۰۴",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    description: "",
  });

  // Reply state for tickets
  const [replyTicketId, setReplyTicketId] = useState(null);
  const [replyText, setReplyText] = useState("");

  const showNotification = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const arts = await getArticlesFromFirestore();
      setArticles(arts.length > 0 ? arts : mockData.articles || []);

      const ports = await getPortfoliosFromFirestore();
      setPortfolios(ports.length > 0 ? ports : mockData.portfolios || []);

      const msgs = await getContactMessagesFromFirestore();
      setContactMessages(msgs);

      const tcks = await getAllTicketsFromFirestore();
      setAllTickets(tcks);

      const ords = await getAllOrdersFromFirestore();
      setAllOrders(ords);
    } catch (err) {
      console.error("Error loading admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    async function initAdminData() {
      try {
        const arts = await getArticlesFromFirestore();
        const ports = await getPortfoliosFromFirestore();
        const msgs = await getContactMessagesFromFirestore();
        const tcks = await getAllTicketsFromFirestore();
        const ords = await getAllOrdersFromFirestore();
        if (isMounted) {
          setArticles(arts.length > 0 ? arts : mockData.articles || []);
          setPortfolios(ports.length > 0 ? ports : mockData.portfolios || []);
          setContactMessages(msgs);
          setAllTickets(tcks);
          setAllOrders(ords);
        }
      } catch (err) {
        console.error("Error loading admin data:", err);
      }
    }
    initAdminData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Article Actions
  const handleAddArticle = async (e) => {
    e.preventDefault();
    if (!newArticle.title.trim() || !newArticle.content.trim()) {
      showNotification("لطفاً عنوان و متن مقاله را وارد کنید.");
      return;
    }
    const slug = newArticle.slug.trim() || newArticle.title.toLowerCase().replace(/\s+/g, "-");
    try {
      setLoading(true);
      await addArticleToFirestore({ ...newArticle, slug, date: new Date().toLocaleDateString("fa-IR") });
      showNotification("مقاله جدید با موفقیت در فایراستور افزوده شد.");
      setNewArticle({
        title: "",
        category: "طراحی وب",
        excerpt: "",
        content: "",
        slug: "",
        image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80",
        author: "بهراد هاشمی",
        readTime: "۵ دقیقه",
      });
      await loadData();
    } catch (err) {
      console.error(err);
      showNotification("خطا در افزودن مقاله.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArticle = async (id) => {
    try {
      setLoading(true);
      await deleteArticleFromFirestore(id);
      showNotification("مقاله با موفقیت حذف شد.");
      await loadData();
    } catch (err) {
      console.error(err);
      showNotification("خطا در حذف مقاله.");
    } finally {
      setLoading(false);
    }
  };

  // Portfolio Actions
  const handleAddPortfolio = async (e) => {
    e.preventDefault();
    if (!newPortfolio.title.trim() || !newPortfolio.description.trim()) {
      showNotification("لطفاً عنوان و توضیحات نمونه‌کار را وارد کنید.");
      return;
    }
    try {
      setLoading(true);
      await addPortfolioToFirestore({ ...newPortfolio });
      showNotification("نمونه‌کار جدید با موفقیت در فایراستور ذخیره شد.");
      setNewPortfolio({
        title: "",
        category: "توسعه فرانت‌اند",
        client: "مشتری جدید",
        year: "۱۴۰۴",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
        description: "",
      });
      await loadData();
    } catch (err) {
      console.error(err);
      showNotification("خطا در ثبت نمونه‌کار.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePortfolio = async (id) => {
    try {
      setLoading(true);
      await deletePortfolioFromFirestore(id);
      showNotification("نمونه‌کار حذف شد.");
      await loadData();
    } catch (err) {
      console.error(err);
      showNotification("خطا در حذف نمونه‌کار.");
    } finally {
      setLoading(false);
    }
  };

  // Contact Message Actions
  const handleDeleteMessage = async (id) => {
    try {
      await deleteContactMessageFromFirestore(id);
      showNotification("پیام تماس با موفقیت حذف شد.");
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  // Ticket Actions
  const handleUpdateTicketStatus = async (ticketId, status) => {
    try {
      await updateTicketStatusInFirestore(ticketId, status);
      showNotification(`وضعیت تیکت به "${status}" تغییر یافت.`);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdminTicketReply = async (ticketId) => {
    if (!replyText.trim()) return;
    try {
      await addMessageToTicketInFirestore(ticketId, replyText, "admin");
      await updateTicketStatusInFirestore(ticketId, "پاسخ داده شده (ادمین)");
      setReplyText("");
      setReplyTicketId(null);
      showNotification("پاسخ ادمین با موفقیت ارسال شد.");
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  // Order Actions
  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await updateOrderStatusInFirestore(orderId, status);
      showNotification(`وضعیت سفارش به "${status}" تغییر کرد.`);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "10px 0" }}>
      {toastMsg && (
        <div style={{
          backgroundColor: "#10b981",
          color: "#fff",
          padding: "12px 20px",
          borderRadius: "8px",
          marginBottom: "20px",
          fontWeight: "600",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          <FaCheck />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "24px",
        flexWrap: "wrap",
        gap: "12px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "42px",
            height: "42px",
            borderRadius: "10px",
            backgroundColor: "rgba(37, 99, 235, 0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#2563eb",
            fontSize: "20px"
          }}>
            <FaShieldAlt />
          </div>
          <div>
            <h2 style={{ fontSize: "1.3rem", fontWeight: "800", color: "#f8fafc", margin: 0 }}>
              پنل مدیریت پیشرفته ادمین (فایربیس فایراستور)
            </h2>
            <p style={{ fontSize: "0.85rem", color: "#94a3b8", margin: 0 }}>
              مدیریت زنده مقالات، نمونه‌کارها، پیام‌های تماس، تیکت‌ها و سفارش‌ها
            </p>
          </div>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            color: "#f8fafc",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          <FaSync className={loading ? "spin" : ""} />
          <span>{loading ? "در حال به‌روزرسانی..." : "به‌روزرسانی داده‌ها"}</span>
        </button>
      </div>

      {/* Sub Tabs */}
      <div style={{
        display: "flex",
        gap: "8px",
        overflowX: "auto",
        paddingBottom: "12px",
        marginBottom: "24px",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
      }}>
        {[
          { id: "articles", label: "مقالات", icon: FaNewspaper, count: articles.length },
          { id: "portfolios", label: "نمونه‌کارها", icon: FaBriefcase, count: portfolios.length },
          { id: "messages", label: "پیام‌های تماس", icon: FaEnvelope, count: contactMessages.length },
          { id: "tickets", label: "تیکت‌ها", icon: FaTicketAlt, count: allTickets.length },
          { id: "orders", label: "سفارش‌ها", icon: FaRocket, count: allOrders.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = adminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                borderRadius: "8px",
                border: isActive ? "1px solid #2563eb" : "1px solid transparent",
                backgroundColor: isActive ? "rgba(37, 99, 235, 0.2)" : "rgba(255, 255, 255, 0.04)",
                color: isActive ? "#60a5fa" : "#94a3b8",
                fontWeight: "700",
                fontSize: "14px",
                cursor: "pointer",
                whiteSpace: "nowrap"
              }}
            >
              <Icon />
              <span>{tab.label}</span>
              <span style={{
                backgroundColor: isActive ? "#2563eb" : "rgba(255, 255, 255, 0.1)",
                color: "#fff",
                borderRadius: "12px",
                padding: "2px 8px",
                fontSize: "11px"
              }}>
                {e2p(tab.count)}
              </span>
            </button>
          );
        })}
      </div>

      {/* 1. ARTICLES TAB */}
      {adminTab === "articles" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }}>
          {/* Add Article Form */}
          <div style={{
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "12px",
            padding: "20px"
          }}>
            <h3 style={{ fontSize: "1.1rem", color: "#60a5fa", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <FaPlus /> <span>افزودن مقاله جدید به فایراستور</span>
            </h3>
            <form onSubmit={handleAddArticle} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div style={{ gridColumn: "span 2" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "6px" }}>عنوان مقاله</label>
                <input
                  type="text"
                  placeholder="مثال: راهنمای جامع ری‌اکت 19"
                  value={newArticle.title}
                  onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    color: "#fff",
                    fontSize: "14px"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "6px" }}>دسته‌بندی</label>
                <input
                  type="text"
                  value={newArticle.category}
                  onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    color: "#fff",
                    fontSize: "14px"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "6px" }}>شناسه URL (Slug)</label>
                <input
                  type="text"
                  placeholder="react-19-guide"
                  value={newArticle.slug}
                  onChange={(e) => setNewArticle({ ...newArticle, slug: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    color: "#fff",
                    fontSize: "14px"
                  }}
                />
              </div>

              <div style={{ gridColumn: "span 2" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "6px" }}>چکیده کوتاه</label>
                <input
                  type="text"
                  placeholder="خلاصه‌ای کوتاهی از مقاله برای کارت‌ها..."
                  value={newArticle.excerpt}
                  onChange={(e) => setNewArticle({ ...newArticle, excerpt: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    color: "#fff",
                    fontSize: "14px"
                  }}
                />
              </div>

              <div style={{ gridColumn: "span 2" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "6px" }}>متن اصلی مقاله</label>
                <textarea
                  rows="4"
                  placeholder="متن اصلی مقاله..."
                  value={newArticle.content}
                  onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    color: "#fff",
                    fontSize: "14px",
                    resize: "vertical"
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  gridColumn: "span 2",
                  padding: "12px",
                  borderRadius: "8px",
                  backgroundColor: "#2563eb",
                  color: "#fff",
                  fontWeight: "700",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                ثبت و انتشار مقاله در فایراستور
              </button>
            </form>
          </div>

          {/* List Articles */}
          <div>
            <h3 style={{ fontSize: "1.1rem", color: "#f8fafc", marginBottom: "16px" }}>لیست مقالات موجود</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {articles.map((art) => (
                <div
                  key={art.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 18px",
                    backgroundColor: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "10px"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <img
                      src={art.image}
                      alt={art.title}
                      style={{ width: "48px", height: "48px", borderRadius: "8px", objectFit: "cover" }}
                    />
                    <div>
                      <h4 style={{ margin: 0, fontSize: "15px", color: "#f8fafc" }}>{art.title}</h4>
                      <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#94a3b8" }}>
                        دسته‌بندی: {art.category} • شناسه: {art.id}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteArticle(art.id)}
                    style={{
                      padding: "8px 12px",
                      backgroundColor: "rgba(239, 68, 68, 0.15)",
                      color: "#ef4444",
                      border: "1px solid rgba(239, 68, 68, 0.3)",
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}
                  >
                    <FaTrash />
                    <span>حذف</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. PORTFOLIOS TAB */}
      {adminTab === "portfolios" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }}>
          {/* Add Portfolio Form */}
          <div style={{
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "12px",
            padding: "20px"
          }}>
            <h3 style={{ fontSize: "1.1rem", color: "#60a5fa", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <FaPlus /> <span>افزودن نمونه‌کار جدید به فایراستور</span>
            </h3>
            <form onSubmit={handleAddPortfolio} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "6px" }}>عنوان پروژه</label>
                <input
                  type="text"
                  placeholder="مثال: وب‌سایت پلتفرم شرکتی"
                  value={newPortfolio.title}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, title: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    color: "#fff",
                    fontSize: "14px"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "6px" }}>دسته‌بندی</label>
                <input
                  type="text"
                  value={newPortfolio.category}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, category: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    color: "#fff",
                    fontSize: "14px"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "6px" }}>نام کارفرما</label>
                <input
                  type="text"
                  value={newPortfolio.client}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, client: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    color: "#fff",
                    fontSize: "14px"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "6px" }}>سال ساخت</label>
                <input
                  type="text"
                  value={newPortfolio.year}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, year: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    color: "#fff",
                    fontSize: "14px"
                  }}
                />
              </div>

              <div style={{ gridColumn: "span 2" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "6px" }}>توضیحات پروژه</label>
                <textarea
                  rows="3"
                  value={newPortfolio.description}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, description: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    color: "#fff",
                    fontSize: "14px",
                    resize: "vertical"
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  gridColumn: "span 2",
                  padding: "12px",
                  borderRadius: "8px",
                  backgroundColor: "#2563eb",
                  color: "#fff",
                  fontWeight: "700",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                ثبت پروژه نمونه‌کار در فایراستور
              </button>
            </form>
          </div>

          {/* List Portfolios */}
          <div>
            <h3 style={{ fontSize: "1.1rem", color: "#f8fafc", marginBottom: "16px" }}>لیست نمونه‌کارهای ثبت‌شده</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {portfolios.map((port) => (
                <div
                  key={port.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 18px",
                    backgroundColor: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "10px"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <img
                      src={port.image}
                      alt={port.title}
                      style={{ width: "48px", height: "48px", borderRadius: "8px", objectFit: "cover" }}
                    />
                    <div>
                      <h4 style={{ margin: 0, fontSize: "15px", color: "#f8fafc" }}>{port.title}</h4>
                      <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#94a3b8" }}>
                        دسته‌بندی: {port.category} • کارفرما: {port.client || "نامشخص"}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeletePortfolio(port.id)}
                    style={{
                      padding: "8px 12px",
                      backgroundColor: "rgba(239, 68, 68, 0.15)",
                      color: "#ef4444",
                      border: "1px solid rgba(239, 68, 68, 0.3)",
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}
                  >
                    <FaTrash />
                    <span>حذف</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. CONTACT MESSAGES TAB */}
      {adminTab === "messages" && (
        <div>
          <h3 style={{ fontSize: "1.1rem", color: "#f8fafc", marginBottom: "16px" }}>پیام‌های دریافتی از فرم تماس با ما</h3>
          {contactMessages.length === 0 ? (
            <div style={{ padding: "30px", textAlign: "center", color: "#94a3b8" }}>
              هیچ پیامی در دیتابیس ثبت نشده است.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {contactMessages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "10px",
                    padding: "16px"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", flexWrap: "wrap", gap: "8px" }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: "15px", color: "#60a5fa" }}>{msg.name || "فرستنده ناشناس"}</h4>
                      <p style={{ margin: "2px 0 0 0", fontSize: "13px", color: "#94a3b8" }}>
                        ایمیل: {msg.email} | تلفن: {msg.phone || "---"}
                      </p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ fontSize: "12px", color: "#64748b" }}>{msg.date || msg.createdAt}</span>
                      <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        style={{
                          backgroundColor: "rgba(239, 68, 68, 0.15)",
                          color: "#ef4444",
                          border: "none",
                          padding: "6px 10px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "12px"
                        }}
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                  <div style={{ fontSize: "14px", color: "#e2e8f0", backgroundColor: "rgba(0, 0, 0, 0.2)", padding: "12px", borderRadius: "8px" }}>
                    <strong>موضوع: {msg.subject || "عمومی"}</strong>
                    <p style={{ margin: "6px 0 0 0", lineHeight: "1.6" }}>{msg.message || msg.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. TICKETS TAB */}
      {adminTab === "tickets" && (
        <div>
          <h3 style={{ fontSize: "1.1rem", color: "#f8fafc", marginBottom: "16px" }}>مدیریت تیکت‌های پشتیبانی کاربران</h3>
          {allTickets.length === 0 ? (
            <div style={{ padding: "30px", textAlign: "center", color: "#94a3b8" }}>
              هیچ تیکت پشتیبانی در فایراستور پیدا نشد.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {allTickets.map((tck) => (
                <div
                  key={tck.id}
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "10px",
                    padding: "16px"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                    <div>
                      <span style={{ fontSize: "12px", color: "#60a5fa", fontWeight: "700" }}>{tck.ticketCode || tck.id}</span>
                      <h4 style={{ margin: "4px 0 0 0", fontSize: "15px", color: "#f8fafc" }}>{tck.title}</h4>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <select
                        value={tck.status || "در حال بررسی"}
                        onChange={(e) => handleUpdateTicketStatus(tck.id, e.target.value)}
                        style={{
                          backgroundColor: "rgba(0, 0, 0, 0.4)",
                          color: "#60a5fa",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          borderRadius: "6px",
                          padding: "6px 10px",
                          fontSize: "12px",
                          fontWeight: "700"
                        }}
                      >
                        <option value="در حال بررسی">در حال بررسی</option>
                        <option value="پاسخ داده شده (ادمین)">پاسخ داده شده</option>
                        <option value="بسته شده">بسته شده</option>
                      </select>

                      <button
                        onClick={() => setReplyTicketId(replyTicketId === tck.id ? null : tck.id)}
                        style={{
                          backgroundColor: "#2563eb",
                          color: "#fff",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "12px",
                          fontWeight: "600"
                        }}
                      >
                        پاسخ ادمین
                      </button>
                    </div>
                  </div>

                  {/* Messages history */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }}>
                    {(tck.messages || []).map((m, idx) => (
                      <div
                        key={idx}
                        style={{
                          alignSelf: m.sender === "admin" ? "flex-start" : "flex-end",
                          backgroundColor: m.sender === "admin" ? "rgba(37, 99, 235, 0.2)" : "rgba(255, 255, 255, 0.05)",
                          border: m.sender === "admin" ? "1px solid rgba(37, 99, 235, 0.4)" : "1px solid rgba(255, 255, 255, 0.1)",
                          borderRadius: "8px",
                          padding: "10px 14px",
                          maxWidth: "85%"
                        }}
                      >
                        <div style={{ fontSize: "11px", color: m.sender === "admin" ? "#60a5fa" : "#94a3b8", marginBottom: "4px" }}>
                          {m.sender === "admin" ? "👑 پاسخ مدیریت بهراد" : "👤 کاربر"} • {m.time}
                        </div>
                        <p style={{ margin: 0, fontSize: "13px", color: "#f8fafc", lineHeight: "1.5" }}>{m.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Admin Reply Box */}
                  {replyTicketId === tck.id && (
                    <div style={{ marginTop: "14px", display: "flex", gap: "8px" }}>
                      <input
                        type="text"
                        placeholder="متن پاسخ ادمین..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        style={{
                          flex: 1,
                          padding: "8px 12px",
                          borderRadius: "6px",
                          backgroundColor: "rgba(0, 0, 0, 0.3)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          color: "#fff",
                          fontSize: "13px"
                        }}
                      />
                      <button
                        onClick={() => handleAdminTicketReply(tck.id)}
                        style={{
                          padding: "8px 16px",
                          backgroundColor: "#10b981",
                          color: "#fff",
                          border: "none",
                          borderRadius: "6px",
                          fontWeight: "700",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px"
                        }}
                      >
                        <FaPaperPlane />
                        <span>ارسال</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. ORDERS TAB */}
      {adminTab === "orders" && (
        <div>
          <h3 style={{ fontSize: "1.1rem", color: "#f8fafc", marginBottom: "16px" }}>مدیریت درخواست‌ها و سفارشات پروژه</h3>
          {allOrders.length === 0 ? (
            <div style={{ padding: "30px", textAlign: "center", color: "#94a3b8" }}>
              هیچ سفارش پروژه‌ای در فایراستور پیدا نشد.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {allOrders.map((ord) => (
                <div
                  key={ord.id}
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "10px",
                    padding: "16px"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", flexWrap: "wrap", gap: "8px" }}>
                    <div>
                      <span style={{ fontSize: "12px", color: "#a855f7", fontWeight: "700" }}>{ord.orderCode || ord.id}</span>
                      <h4 style={{ margin: "2px 0 0 0", fontSize: "15px", color: "#f8fafc" }}>{ord.title}</h4>
                      <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#94a3b8" }}>
                        نوع سرویس: {ord.serviceType} | بودجه: {ord.budget}
                      </p>
                    </div>

                    <select
                      value={ord.status || "در حال بررسی کارشناس"}
                      onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                      style={{
                        backgroundColor: "rgba(0, 0, 0, 0.4)",
                        color: "#a855f7",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "6px",
                        padding: "6px 10px",
                        fontSize: "12px",
                        fontWeight: "700"
                      }}
                    >
                      <option value="در حال بررسی کارشناس">در حال بررسی</option>
                      <option value="تایید اولیه و تماس">تایید اولیه و تماس</option>
                      <option value="در حال اجرا">در حال اجرا</option>
                      <option value="تکمیل و تحویل شد">تکمیل و تحویل شد</option>
                    </select>
                  </div>

                  <p style={{ margin: 0, fontSize: "13px", color: "#cbd5e1", backgroundColor: "rgba(0, 0, 0, 0.2)", padding: "10px", borderRadius: "6px" }}>
                    {ord.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
