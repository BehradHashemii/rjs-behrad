import styles from "../../pages/DashboardPage.module.css";

export default function NewOrderModal({
    isOpen,
    onClose,
    newOrderData,
    setNewOrderData,
    onCreateOrder,
}) {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div
                className={`${styles.modalBox} glassBG`}
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className={styles.modalHeading}>
                    درخواست مشاوره و برآورد هزینه پروژه
                </h3>
                <form onSubmit={onCreateOrder} className={styles.modalForm}>
                    <div className={styles.mGroup}>
                        <label>عنوان پروژه:</label>
                        <input
                            type="text"
                            placeholder="مثال: طراحی وب‌سایت شرکتی"
                            value={newOrderData.title}
                            onChange={(e) =>
                                setNewOrderData({ ...newOrderData, title: e.target.value })
                            }
                        />
                    </div>

                    <div className={styles.mGrid2}>
                        <div className={styles.mGroup}>
                            <label>نوع سرویس:</label>
                            <select
                                value={newOrderData.serviceType}
                                onChange={(e) =>
                                    setNewOrderData({
                                        ...newOrderData,
                                        serviceType: e.target.value,
                                    })
                                }
                            >
                                <option value="توسعه وب‌سایت فرانت‌اند و بک‌اند">
                                    توسعه وب‌سایت فرانت‌اند و بک‌اند
                                </option>
                                <option value="طراحی آنلاین‌شاپ و فروشگاه">
                                    طراحی آنلاین‌شاپ و فروشگاه
                                </option>
                                <option value="طراحی رابط و تجربه کاربری (UI/UX)">
                                    طراحی رابط و تجربه کاربری (UI/UX)
                                </option>
                                <option value="سئو و بهینه‌سازی موتورهای جستجو">
                                    سئو و بهینه‌سازی موتورهای جستجو
                                </option>
                            </select>
                        </div>

                        <div className={styles.mGroup}>
                            <label>حدود بودجه:</label>
                            <select
                                value={newOrderData.budget}
                                onChange={(e) =>
                                    setNewOrderData({
                                        ...newOrderData,
                                        budget: e.target.value,
                                    })
                                }
                            >
                                <option value="۱۰ تا ۲۰ میلیون تومان">
                                    ۱۰ تا ۲۰ میلیون تومان
                                </option>
                                <option value="۲۰ تا ۴۰ میلیون تومان">
                                    ۲۰ تا ۴۰ میلیون تومان
                                </option>
                                <option value="۴۰ تا ۸۰ میلیون تومان">
                                    ۴۰ تا ۸۰ میلیون تومان
                                </option>
                                <option value="بالای ۱۰۰ میلیون تومان">
                                    بالای ۱۰۰ میلیون تومان
                                </option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.mGroup}>
                        <label>شرح نیازمندی‌ها:</label>
                        <textarea
                            rows={4}
                            placeholder="توضیحات کامل درباره پروژه..."
                            value={newOrderData.description}
                            onChange={(e) =>
                                setNewOrderData({
                                    ...newOrderData,
                                    description: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div className={styles.modalBtns}>
                        <button type="submit" className={styles.mSubmitBtn}>
                            ثبت درخواست مشاوره
                        </button>
                        <button type="button" className={styles.mCancelBtn} onClick={onClose}>
                            انصراف
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}