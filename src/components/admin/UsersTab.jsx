import React, { useState } from 'react'
import { FaCheck, FaExclamationTriangle, FaEye, FaEyeSlash, FaFilter, FaSearch, FaTimes, FaTrashAlt, FaUserEdit, FaUserMinus, FaUserPlus, FaUserShield } from 'react-icons/fa';
import e2p from '../../utils/persianNumber';

function UsersTab({ styles, searchUser, roleFilter, setRoleFilter, users, filteredUsers, handleToggleRole, setUserToDelete, userToDelete, setIsAddUserModalOpen, isAddUserModalOpen, setNewUserForm, newUserForm, handleAddUserSubmit }) {
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
                    <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                        <option value="all">همه نقش‌ها ({e2p(users.length)})</option>
                        <option value="admin">
                            مدیران ({e2p(users.filter((u) => u.role === "admin").length)})
                        </option>
                        <option value="user">
                            کاربران عادی ({e2p(users.filter((u) => u.role !== "admin").length)})
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
                                                {u.role === "admin" ? <FaUserMinus /> : <FaUserShield />}
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

            {/* مودال افزودن کاربر جدید */}
            {isAddUserModalOpen && (
                <div
                    className={`glassBG ${styles.modalBackdrop}`}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setIsAddUserModalOpen(false);
                    }}
                >
                    <div className={styles.modalWindow}>
                        <div className={styles.modalHeader}>
                            <h3><FaUserPlus /> افزودن کاربر جدید</h3>
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
                                        onChange={(e) =>setNewUserForm({ ...newUserForm, password: e.target.value })}
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
                                        placeholder="09121112233"
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

            {/* مودال تأیید حذف کاربر */}
            {userToDelete && (
                <div
                    className={styles.modalBackdrop}
                    onClick={(e) => {
                        if (e.target === e.currentTarget && !isDeletingUser) setUserToDelete(null);
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
                                    آیا از حذف دائمی این کاربر از سیستم اطمینان دارید؟ این عملیات <strong>غیرقابل بازگشت</strong> است و کلیه اطلاعات مربوطه پاک خواهد شد.
                                </p>
                                <div className={styles.warningUserPreview}>
                                    <div>
                                        <strong>{userToDelete.name || "کاربر سیستم"}</strong>
                                        <div style={{ fontSize: "0.8rem", color: "#64748b" }} dir="ltr">
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
                                    {isDeletingUser ? <FaSpinner className="spinIcon" /> : <FaTrashAlt />}
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
    )
}

export default UsersTab