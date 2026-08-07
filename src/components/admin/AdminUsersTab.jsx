import styles from "../../pages/AdminPage.module.css";

export default function AdminUsersTab({ users }) {
    return (
        <div>
            <h2>لیست کاربران سیستم</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                مشاهده تمام حساب‌های ثبت‌نام‌شده در دیتابیس فایربیس
            </p>

            <div className={styles.tableWrapper}>
                <table className={styles.adminTable}>
                    <thead>
                        <tr>
                            <th>نام کاربر</th>
                            <th>ایمیل</th>
                            <th>شهر</th>
                            <th>تاریخ عضویت</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={{ textAlign: "center" }}>کاربری یافت نشد.</td>
                            </tr>
                        ) : (
                            users.map((u) => (
                                <tr key={u.id}>
                                    <td>{u.name || "بدون نام"}</td>
                                    <td>{u.email}</td>
                                    <td>{u.location || "ثبت‌نشده"}</td>
                                    <td>{u.joinedDate || "—"}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}