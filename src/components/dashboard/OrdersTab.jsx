import { FaRocket } from "react-icons/fa";
import styles from "../../pages/DashboardPage.module.css";

export default function OrdersTab({ orders, onOpenOrderModal }) {
    return (
        <div className={styles.tabSection}>
            <div className={styles.sectionHeaderRow}>
                <div>
                    <h2>درخواست و مشاوره پروژه جدید</h2>
                    <p>ثبت سفارش طراحی وب‌سایت و سیستم‌های اختصاصی</p>
                </div>
                <button
                    type="button"
                    className={styles.newTicketHeaderBtn}
                    onClick={onOpenOrderModal}
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
                    </div>
                ) : (
                    orders.map((ord) => (
                        <div key={ord.id} className={styles.orderCard}>
                            <div className={styles.orderTop}>
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
    );
}