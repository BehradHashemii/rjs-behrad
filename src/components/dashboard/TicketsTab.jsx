import { useEffect, useRef } from "react";
import {
  FaPlus,
  FaArrowLeft,
  FaPaperPlane,
  FaTicketAlt,
} from "react-icons/fa";
import styles from "../../pages/DashboardPage.module.css";

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
      senderName: ticket.userName || defaultUserName,
      text: mainText,
      time: ticket.date || "ثبت اولیه",
    });
  }
  if (ticket.adminReply) {
    list.push({
      sender: "admin",
      senderName: "پشتیبانی بهراد",
      text: ticket.adminReply,
      time: "پاسخ ادمین",
    });
  }
  return list;
}

export default function TicketsTab({
  tickets = [],
  selectedTicket,
  setSelectedTicket,
  user,
  userData,
  replyMessageText,
  setReplyMessageText,
  onSendReply,
  onOpenTicketModal,
}) {
  const userName = userData?.name || user?.displayName || user?.name || "کاربر";
  const chatEndRef = useRef(null);

  const messages = getNormalizedMessages(selectedTicket, userName);

  useEffect(() => {
    if (selectedTicket && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedTicket, messages.length]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendReply(e);
    }
  };

  return (
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
          onClick={onOpenTicketModal}
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
                کد تیکت: {selectedTicket.id?.slice(0, 8)}
              </span>
              <span className={`${styles.tckStatusBadge} ${
                selectedTicket.status === "پاسخ داده شده"
                  ? styles.statusAnswered
                  : selectedTicket.status === "بسته شده"
                  ? styles.statusClosed
                  : styles.statusPending
              }`}>
                {selectedTicket.status || "در حال بررسی"}
              </span>
              {selectedTicket.category && (
                <span className={styles.tckCategory}>
                  {selectedTicket.category}
                </span>
              )}
            </div>
            <h3 className={styles.thTitle}>{selectedTicket.title}</h3>
            <p className={styles.thDate}>
              تاریخ ثبت: {selectedTicket.date || "ثبت شده"}
            </p>
          </div>

          <div className={styles.threadMessages}>
            {messages.length === 0 ? (
              <p className={styles.emptyMsg}>هیچ پیامی در این تیکت وجود ندارد.</p>
            ) : (
              messages.map((msg, idx) => {
                const isUser = msg.sender === "user";
                return (
                  <div
                    key={idx}
                    className={`${styles.msgBubble} ${
                      isUser ? styles.msgUser : styles.msgSupport
                    }`}
                  >
                    <div className={styles.msgHeader}>
                      <strong>
                        {isUser
                          ? msg.senderName || userName
                          : msg.senderName || "پشتیبانی بهراد"}
                      </strong>
                      <span className={styles.msgTime}>{msg.time}</span>
                    </div>
                    <p className={styles.msgText}>{msg.text}</p>
                  </div>
                );
              })
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={onSendReply} className={styles.replyBox}>
            <textarea
              rows={2}
              placeholder="پاسخ خود را بنویسید... (Enter برای ارسال)"
              value={replyMessageText}
              onChange={(e) => setReplyMessageText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              type="submit"
              className={styles.sendReplyBtn}
              disabled={!replyMessageText.trim()}
            >
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
                در صورت داشتن سوال فنی یا نیاز به مشاوره پروژه، یک تیکت جدید
                ارسال کنید.
              </p>
            </div>
          ) : (
            tickets.map((tck) => {
              const tckMsgs = getNormalizedMessages(tck, userName);
              const lastMsg = tckMsgs.length > 0 ? tckMsgs[tckMsgs.length - 1]?.text : "توضیحی ثبت نشده";

              return (
                <div
                  key={tck.id}
                  className={styles.ticketRowCard}
                  onClick={() => setSelectedTicket(tck)}
                >
                  <div className={styles.tckMainInfo}>
                    <div className={styles.tckBadges}>
                      <span className={styles.tckCode}>{tck.id?.slice(0, 8)}</span>
                      <span className={`${styles.tckStatus} ${
                        tck.status === "پاسخ داده شده"
                          ? styles.statusAnswered
                          : tck.status === "بسته شده"
                          ? styles.statusClosed
                          : styles.statusPending
                      }`}>
                        {tck.status || "در حال بررسی"}
                      </span>
                      {tck.priority && <span className={styles.tckPri}>{tck.priority}</span>}
                    </div>
                    <h4 className={styles.tckTitleText}>{tck.title}</h4>
                    <p className={styles.tckLastMsg}>
                      آخرین پیام: {lastMsg?.slice(0, 80)}{lastMsg?.length > 80 ? "..." : ""}
                    </p>
                  </div>
                  <div className={styles.tckSideInfo}>
                    <span className={styles.tckDateText}>{tck.date}</span>
                    <span className={styles.openThreadBtn}>مشاهده گفتگو</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
