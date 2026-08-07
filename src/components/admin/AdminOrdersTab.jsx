import styles from "../../pages/AdminPage.module.css";

export default function AdminOrdersTab({ orders, onChangeOrderStatus }) {
  return (
    <div>
      <h2>مدیریت درخواست‌ها و سفارشات پروژه</h2>
      <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
        بررسی درخواست‌های مشاوره و به روزرسانی وضعیت پروژه
      </p>

      <div className={styles.tableWrapper}>
        <table className={styles.adminTable}>
          <thead>
            <tr>
              <th>عنوان پروژه</th>
              <th>نوع سرویس</th>
              <th>بودجه</th>
              <th>تاریخ</th>
              <th>وضعیت</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>هیچ سفارشی یافت نشد.</td>
              </tr>
            ) : (
              orders.map((ord) => (
                <tr key={ord.id}>
                  <td>
                    <strong>{ord.title}</strong>
                    <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", margin: "4px 0 0 0" }}>
                      {ord.description}
                    </p>
                  </td>
                  <td>{ord.serviceType}</td>
                  <td>{ord.budget}</td>
                  <td>{ord.date}</td>
                  <td>
                    <select
                      value={ord.status}
                      onChange={(e) => onChangeOrderStatus(ord.id, e.target.value)}
                      className={styles.statusSelect}
                    >
                      <option value="در انتظار بررسی">در انتظار بررسی</option>
                      <option value="تایید شده / در حال مذاکره">تایید شده / در حال مذاکره</option>
                      <option value="در حال انجام">در حال انجام</option>
                      <option value="تکمیل شده">تکمیل شده</option>
                      <option value="لغو شده">لغو شده</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}