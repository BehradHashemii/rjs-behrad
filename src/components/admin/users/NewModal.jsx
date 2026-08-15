import React from "react";
import { FaCheck, FaEye, FaEyeSlash, FaTimes, FaUserPlus } from "react-icons/fa";

function NewModal({
  styles,
  isAddUserModalOpen,
  setIsAddUserModalOpen,
  handleAddUserSubmit,
  newUserForm,
  setNewUserForm,
  showPassword,
  setShowPassword
}) {
  return (
    <>
      {isAddUserModalOpen && (
        <div
          className={`glassBG ${styles.modalBackdrop}`}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAddUserModalOpen(false);
          }}
        >
          <div className={styles.modalWindow}>
            <div className={styles.modalHeader}>
              <h3>
                <FaUserPlus /> افزودن کاربر جدید
              </h3>
              <button
                className={styles.closeBtn}
                onClick={() => setIsAddUserModalOpen(false)}
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleAddUserSubmit} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label>نام و نام خانوادگی:</label>
                <input
                  type="text"
                  placeholder="مثال: علی رضایی"
                  value={newUserForm.name}
                  onChange={(e) =>
                    setNewUserForm({ ...newUserForm, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>آدرس ایمیل:</label>
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  value={newUserForm.email}
                  onChange={(e) =>
                    setNewUserForm({ ...newUserForm, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>رمز عبور:</label>
                <div className={styles.inputWrapper}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={newUserForm.password}
                    onChange={(e) =>
                      setNewUserForm({
                        ...newUserForm,
                        password: e.target.value,
                      })
                    }
                    required
                    dir="ltr"
                  />
                  <button
                    type="button"
                    className={`${styles.togglePasswordBtn}`}
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? "مخفی کردن" : "نمایش"}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>نقش دسترسی:</label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) =>
                      setNewUserForm({ ...newUserForm, role: e.target.value })
                    }
                  >
                    <option value="user">کاربر عادی</option>
                    <option value="admin">مدیر (Admin)</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>شماره تماس:</label>
                  <input
                    type="text"
                    placeholder=""
                    value={newUserForm.phone}
                    onChange={(e) =>
                      setNewUserForm({ ...newUserForm, phone: e.target.value })
                    }
                    dir="ltr"
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button type="submit" className={styles.saveBtn}>
                  <FaCheck /> ثبت کاربر جدید
                </button>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setIsAddUserModalOpen(false)}
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default NewModal;
