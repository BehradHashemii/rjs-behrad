import { useState } from "react";
import { FaPaperPlane, FaArrowLeft } from "react-icons/fa";
import styles from "../../pages/AdminPage.module.css";

export default function AdminTicketsTab({
  tickets,
  selectedTicket,
  setSelectedTicket,
  replyText,
  setReplyText,
  onSendReply,
  onChangeStatus,
}) {
  return (
    <div>
      <h2>مدیریت تیکت‌های پشتیبانی</h2>
      <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
        مشاهده، پاسخ‌دهی و تغییر وضعیت تیکت‌های ارسال شده توسط کاربران
      </p>

      {selectedTicket ? (
        <div style={{ marginTop: "20px" }}>
          <button
            type="button"
            className={styles.actionBtn}
            onClick={() => setSelectedTicket(null)}
            style={{ marginBottom: "16px", display: "inline-flex", gap: "8px", alignItems: "center" }}
          >
            <FaArrowLeft />
            <span>بازگشت به لیست</span>
          </button>

          <div style={{ padding: "16px", background: "rgba(255,255,255,0.03)", borderRadius: "8px", marginBottom: "16px" }}>
            <h3>{selectedTicket.title}</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              کاربر: {selectedTicket.userName || "نامشخص"} ({selectedTicket.userEmail})
            </p>
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <label style={{ fontSize: "0.85rem" }}>تغییر وضعیت:</label>
              <select
                value={selectedTicket.status}
                onChange={(e) => onChangeStatus(selectedTicket.id, e.target.value)}
                className={styles.statusSelect}
              >
                <option value="در حال بررسی">در حال بررسی</option>
                <option value="پاسخ داده شده">پاسخ داده شده</option>
                <option value="بسته شده">بسته شده</option>
              </select>
            </div>
          </div>

          {/* لیست گفتگوها */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
            {selectedTicket.messages?.map((msg, index) => (
              <div
                key={index}
                style={{
                  padding: "12px 16px",
                  borderRadius: "8px",
                  maxWidth: "80%",
                  alignSelf: msg.sender === "admin" ? "flex-start" : "flex-end",
                  background: msg.sender === "admin" ? "var(--primary-soft)" : "rgba(255,255,255,0.06)",
                  border: "1px solid var(--glass-border)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: "6px" }}>
                  <strong>{msg.sender === "admin" ? "پشتیبانی (شما)" : selectedTicket.userName}</strong>
                  <span>{msg.time}</span>
                </div>
                <p style={{ margin: 0, fontSize: "0.88rem" }}>{msg.text}</p>
              </div>
            ))}
          </div>

          {/* فرم ارسال پاسخ ادمین */}
          <form onSubmit={onSendReply} style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              placeholder="پاسخ خود را بنویسید..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: "6px",
                border: "1px solid var(--glass-border)",
                background: "var(--glass-bg)",
                color: "#fff",
              }}
            />
            <button type="submit" className={styles.actionBtn}>
              <FaPaperPlane />
              <span>ارسال</span>
            </button>
          </form>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.adminTable}>
            <thead>
              <tr>
                <th>عنوان</th>
                <th>کاربر</th>
                <th>دسته</th>
                <th>اولویت</th>
                <th>وضعیت</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>تیکتی یافت نشد.</td>
                </tr>
              ) : (
                tickets.map((tck) => (
                  <tr key={tck.id}>
                    <td>{tck.title}</td>
                    <td>{tck.userName || tck.userId?.slice(0, 6)}</td>
                    <td>{tck.category}</td>
                    <td>{tck.priority}</td>
                    <td>{tck.status}</td>
                    <td>
                      <button
                        type="button"
                        className={styles.actionBtn}
                        onClick={() => setSelectedTicket(tck)}
                      >
                        بررسی و پاسخ
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}