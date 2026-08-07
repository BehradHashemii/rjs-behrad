import styles from "../../pages/DashboardPage.module.css";

export default function NewTicketModal({
  isOpen,
  onClose,
  newTicketData,
  setNewTicketData,
  onCreateTicket,
}) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={`${styles.modalBox} glassBG`}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className={styles.modalHeading}>ثبت تیکت جدید پشتیبانی</h3>
        <form onSubmit={onCreateTicket} className={styles.modalForm}>
          <div className={styles.mGroup}>
            <label>عنوان تیکت:</label>
            <input
              type="text"
              placeholder="مثال: استعلام هزینه طراحی وب‌سایت فروشگاهی"
              value={newTicketData.title}
              onChange={(e) =>
                setNewTicketData({
                  ...newTicketData,
                  title: e.target.value,
                })
              }
              required
            />
          </div>

          <div className={styles.mGrid2}>
            <div className={styles.mGroup}>
              <label>دسته‌بندی:</label>
              <select
                value={newTicketData.category}
                onChange={(e) =>
                  setNewTicketData({
                    ...newTicketData,
                    category: e.target.value,
                  })
                }
              >
                <option value="مشاوره پروژه">مشاوره پروژه</option>
                <option value="استعلام قیمت">استعلام قیمت</option>
                <option value="پشتیبانی فنی">پشتیبانی فنی</option>
                <option value="سایر">سایر</option>
              </select>
            </div>

            <div className={styles.mGroup}>
              <label>اولویت:</label>
              <select
                value={newTicketData.priority}
                onChange={(e) =>
                  setNewTicketData({
                    ...newTicketData,
                    priority: e.target.value,
                  })
                }
              >
                <option value="عادی">عادی</option>
                <option value="مهم">مهم</option>
                <option value="فوری">فوری</option>
              </select>
            </div>
          </div>

          <div className={styles.mGroup}>
            <label>توضیحات کامل درخواست:</label>
            <textarea
              rows={4}
              placeholder="نیازمندی‌ها، امکانات مد نظر یا سوال خود را بنویسید..."
              value={newTicketData.description}
              onChange={(e) =>
                setNewTicketData({
                  ...newTicketData,
                  description: e.target.value,
                })
              }
              required
            />
          </div>

          <div className={styles.modalBtns}>
            <button type="submit" className={styles.mSubmitBtn}>
              ارسال تیکت
            </button>
            <button
              type="button"
              className={styles.mCancelBtn}
              onClick={onClose}
            >
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
