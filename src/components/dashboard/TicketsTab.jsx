import { FaPlus, FaArrowLeft, FaPaperPlane, FaTicketAlt } from "react-icons/fa";
import styles from "../../pages/DashboardPage.module.css";

export default function TicketsTab({
    tickets,
    selectedTicket,
    setSelectedTicket,
    user,
    userData,
    replyMessageText,
    setReplyMessageText,
    onSendReply,
    onOpenTicketModal,
}) {
    return (
        <div className={styles.tabSection}>
            <div className={styles.sectionHeaderRow}>
                <div>
                    <h2>تیکت‌های پشتیبانی و مشاوره</h2>
                    <p>پیگیری پاسخ سوالات فنی و سفارشات</p>
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
                            <span className={styles.tckStatusBadge}>
                                {selectedTicket.status}
                            </span>
                            <span className={styles.tckCategory}>
                                {selectedTicket.category}
                            </span>
                        </div>
                        <h3 className={styles.thTitle}>{selectedTicket.title}</h3>
                        <p className={styles.thDate}>تاریخ ثبت: {selectedTicket.date}</p>
                    </div>

                    <div className={styles.threadMessages}>
                        {selectedTicket.messages?.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`${styles.msgBubble} ${msg.sender === "user" ? styles.msgUser : styles.msgSupport
                                    }`}
                            >
                                <div className={styles.msgHeader}>
                                    <strong>
                                        {msg.sender === "user"
                                            ? userData?.name || user?.displayName
                                            : "پشتیبانی"}
                                    </strong>
                                    <span>{msg.time}</span>
                                </div>
                                <p className={styles.msgText}>{msg.text}</p>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={onSendReply} className={styles.replyBox}>
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
                <div className={styles.ticketsList}>
                    {tickets.length === 0 ? (
                        <div className={styles.emptyState}>
                            <FaTicketAlt className={styles.emptyIcon} />
                            <h3>هیچ تیکتی تاکنون ثبت نشده است!</h3>
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
                                        <span className={styles.tckStatus}>{tck.status}</span>
                                        <span className={styles.tckPri}>{tck.priority}</span>
                                    </div>
                                    <h4 className={styles.tckTitleText}>{tck.title}</h4>
                                    <p className={styles.tckLastMsg}>
                                        آخرین پیام:{" "}
                                        {tck.messages[tck.messages.length - 1]?.text.slice(0, 80)}
                                        ...
                                    </p>
                                </div>
                                <div className={styles.tckSideInfo}>
                                    <span className={styles.tckDateText}>{tck.date}</span>
                                    <span className={styles.openThreadBtn}>مشاهده گفتگو</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}