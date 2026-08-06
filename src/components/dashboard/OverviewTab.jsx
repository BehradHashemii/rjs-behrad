import { FaPlus, FaRocket, FaClock } from "react-icons/fa";
import styles from "../../pages/DashboardPage.module.css";

export default function OverviewTab({
    user,
    userData,
    activities,
    onOpenTicketModal,
    onOpenOrderModal,
}) {
    return (
        <div className={styles.tabSection}>
            <div className={styles.sectionHeader}>
                <h2>پیش‌خوان کاربر</h2>
                <p>خلاصه فعالیت‌ها و دسترسی سریع به بخش‌های مختلف پنل</p>
            </div>

            <div className={styles.welcomeCard}>
                <div className={styles.welcomeText}>
                    <h3>خوش آمدید، {userData?.name || user?.displayName}! 👋</h3>
                    <p>
                        از طریق این پنل می‌توانید پروژه‌های نشان‌شده خود را مدیریت کنید،
                        درخواست مشاوره برای ساخت وب‌سایت جدید ثبت کنید و تیکت‌های پشتیبانی
                        را پیگیری کنید.
                    </p>
                </div>
                <div className={styles.quickLaunchBtns}>
                    <button
                        type="button"
                        className={styles.quickLaunchBtnPrimary}
                        onClick={onOpenTicketModal}
                    >
                        <FaPlus />
                        <span>ثبت تیکت جدید</span>
                    </button>
                    <button
                        type="button"
                        className={styles.quickLaunchBtnSecondary}
                        onClick={onOpenOrderModal}
                    >
                        <FaRocket />
                        <span>درخواست مشاوره پروژه</span>
                    </button>
                </div>
            </div>

            <div className={styles.activityBox}>
                <h3 className={styles.subTitle}>آخرین فعالیت‌های سیستم</h3>
                <div className={styles.activityList}>
                    {activities.length === 0 ? (
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                            هیچ فعالیتی ثبت نشده است.
                        </p>
                    ) : (
                        activities.map((act) => (
                            <div key={act.id} className={styles.activityItem}>
                                <div className={styles.actIcon}>
                                    <FaClock />
                                </div>
                                <div className={styles.actContent}>
                                    <p className={styles.actTitle}>{act.title}</p>
                                    <span className={styles.actTime}>{act.time}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}