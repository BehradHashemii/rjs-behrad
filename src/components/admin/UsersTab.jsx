import React, { useState } from "react";
import {
  FaCheck,
  FaExclamationTriangle,
  FaEye,
  FaEyeSlash,
  FaFilter,
  FaSearch,
  FaSpinner,
  FaTimes,
  FaTrashAlt,
  FaUserEdit,
  FaUserMinus,
  FaUserPlus,
  FaUserShield,
} from "react-icons/fa";
import e2p from "../../utils/persianNumber";
import NewModal from "./users/NewModal";

function UsersTab({
  styles,
  searchUser,
  roleFilter,
  setRoleFilter,
  users,
  filteredUsers,
  handleToggleRole,
  setUserToDelete,
  userToDelete,
  setIsAddUserModalOpen,
  isAddUserModalOpen,
  setNewUserForm,
  newUserForm,
  handleAddUserSubmit,
  isDeletingUser,
  confirmDeleteUser
}) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <section className={styles.usersSection}>
      {/* نوار ابزار جستجو و افزودن کاربر */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <FaSearch />
          <input
            type="text"
            placeholder="جستجوی کاربر با نام، ایمیل یا تلفن..."
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
          />
        </div>

        <div className={styles.filterBox}>
          <FaFilter />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">همه نقش‌ها ({e2p(users.length)})</option>
            <option value="admin">
              مدیران ({e2p(users.filter((u) => u.role === "admin").length)})
            </option>
            <option value="user">
              کاربران عادی (
              {e2p(users.filter((u) => u.role !== "admin").length)})
            </option>
          </select>
        </div>

        <button
          className={styles.addUserBtn}
          onClick={() => setIsAddUserModalOpen(true)}
        >
          <FaUserPlus /> <span>افزودن کاربر جدید</span>
        </button>
      </div>

      {/* جدول لیست کاربران */}
      <div className={styles.tableResponsive}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>کاربر</th>
              <th>آدرس ایمیل</th>
              <th>شماره تماس</th>
              <th>سطح دسترسی</th>
              <th>وضعیت</th>
              <th>عملیات مدیریت</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className={styles.emptyTable}>
                  هیچ کاربری با این مشخصات یافت نشد.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className={styles.userCell}>
                      <strong>{u.name || "کاربر سیستم"}</strong>
                    </div>
                  </td>
                  <td dir="ltr">{u.email}</td>
                  <td dir="ltr">{u.phone || "-"}</td>
                  <td>
                    <span
                      className={
                        u.role === "admin"
                          ? styles.adminBadge
                          : styles.userBadge
                      }
                    >
                      {u.role === "admin" ? "مدیر" : "کاربر عادی"}
                    </span>
                  </td>
                  <td>
                    <span
                      className={
                        u.status === "disabled"
                          ? styles.statusDark
                          : styles.statusSuccess
                      }
                    >
                      {u.status === "disabled" ? "مسدود" : "فعال"}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionGroup}>
                      <button
                        className={styles.btnEdit}
                        onClick={() => {
                          setEditingUser(u);
                          setEditUserForm({
                            name: u.name || "",
                            email: u.email || "",
                            role: u.role || "user",
                            phone: u.phone || "",
                            status: u.status || "active",
                          });
                          setIsEditUserModalOpen(true);
                        }}
                        title="ویرایش کاربر"
                      >
                        <FaUserEdit />
                      </button>

                      <button
                        className={styles.btnRole}
                        onClick={() => handleToggleRole(u.id, u.role)}
                        title="تغییر نقش دسترسی"
                      >
                        {u.role === "admin" ? (
                          <FaUserMinus />
                        ) : (
                          <FaUserShield />
                        )}
                      </button>

                      <button
                        className={styles.btnDelete}
                        onClick={() => setUserToDelete(u)}
                        title="حذف کاربر"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <NewModal
        isAddUserModalOpen={isAddUserModalOpen}
        styles={styles}
        setIsAddUserModalOpen={setIsAddUserModalOpen}
        handleAddUserSubmit={handleAddUserSubmit}
        newUserForm={newUserForm}
        setNewUserForm={setNewUserForm}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
      />

      {/* مودال تأیید حذف کاربر */}
      {userToDelete && (
        <div
          className={styles.modalBackdrop}
          onClick={(e) => {
            if (e.target === e.currentTarget && !isDeletingUser)
              setUserToDelete(null);
          }}
        >
          <div className={styles.modalWindow}>
            <div className={styles.modalHeader}>
              <h3 style={{ color: "#dc2626" }}>
                <FaExclamationTriangle /> تأیید حذف دائمی کاربر
              </h3>
              <button
                className={styles.closeBtn}
                onClick={() => setUserToDelete(null)}
                disabled={isDeletingUser}
              >
                <FaTimes />
              </button>
            </div>

            <div className={styles.modalForm}>
              <div className={styles.warningBox}>
                <p>
                  آیا از حذف دائمی این کاربر از سیستم اطمینان دارید؟ این عملیات{" "}
                  <strong>غیرقابل بازگشت</strong> است و کلیه اطلاعات مربوطه پاک
                  خواهد شد.
                </p>
                <div className={styles.warningUserPreview}>
                  <div>
                    <strong>{userToDelete.name || "کاربر سیستم"}</strong>
                    <div
                      style={{ fontSize: "0.8rem", color: "#64748b" }}
                      dir="ltr"
                    >
                      {userToDelete.email}
                    </div>
                  </div>
                  <span
                    className={
                      userToDelete.role === "admin"
                        ? styles.adminBadge
                        : styles.userBadge
                    }
                  >
                    {userToDelete.role === "admin" ? "مدیر" : "کاربر عادی"}
                  </span>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.dangerConfirmBtn}
                  onClick={confirmDeleteUser}
                  disabled={isDeletingUser}
                >
                  {isDeletingUser ? (
                    <FaSpinner className="spinIcon" />
                  ) : (
                    <FaTrashAlt />
                  )}
                  <span>حذف دائمی کاربر</span>
                </button>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setUserToDelete(null)}
                  disabled={isDeletingUser}
                >
                  انصراف
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default UsersTab;
