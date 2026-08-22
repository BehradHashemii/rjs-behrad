import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import styles from "./LoginModal.module.css";
import {
  FaTimes,
  FaEnvelope,
  FaUser,
  FaShieldAlt,
  FaCheckCircle,
  FaSignOutAlt,
  FaUserAlt,
  FaEye,
  FaEyeSlash,
  FaKey,
} from "react-icons/fa";

export default function LoginModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { user: currentUser, logout, isAdmin, login, signup, resetPassword } = useAuth();

  const [mode, setMode] = useState("login"); // 'login' | 'register' | 'forgot'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // بستن مودال با دکمه ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleResetForm = () => {
    setError("");
    setSuccess("");
    setPassword("");
  };

  // 🔹 تابع ورود به حساب
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("لطفاً ایمیل و رمز عبور را وارد کنید.");
      return;
    }

    setLoading(true);

    try {
      await login(email.trim(), password);
      setSuccess("ورود با موفقیت انجام شد!");

      setTimeout(() => {
        onClose();
      }, 800);
    } catch (err) {
      console.error("خطا در ورود:", err);
      // خواندن پیام خطای ارسال شده از بک‌اند Node.js
      const errorMessage = err.response?.data?.message || "ارتباط با سرور برقرار نشد.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 تابع ثبت نام
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password || !name) {
      setError("لطفاً تمامی فیلدها را پر کنید.");
      return;
    }

    if (password.length < 6) {
      setError("رمز عبور باید حداقل ۶ کاراکتر باشد.");
      return;
    }

    setLoading(true);

    try {
      await signup(name.trim(), email.trim(), password);
      setSuccess("حساب کاربری شما با موفقیت ایجاد شد!");

      setTimeout(() => {
        onClose();
      }, 800);
    } catch (err) {
      console.error("خطا در ثبت نام:", err);
      // نمایش پیام خطای دیتابیس (مثلاً: این ایمیل قبلاً ثبت شده است)
      const errorMessage = err.response?.data?.message || "خطا در ساخت حساب. لطفاً دوباره تلاش کنید.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 تابع فراموشی رمز عبور (فعلاً غیرفعال در بک‌اند)
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("لطفاً ایمیل خود را وارد کنید.");
      return;
    }

    setLoading(true);

    try {
      await resetPassword(email.trim());
      setSuccess("لینک بازیابی رمز عبور به ایمیل شما ارسال شد.");
    } catch (err) {
      setError(err.message || "خطا در ارسال ایمیل.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 تابع خروج
  const handleLogout = async () => {
    await logout();
    setEmail("");
    setPassword("");
    setName("");
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="بستن"
          title="بستن"
        >
          <FaTimes />
        </button>

        {/* Profile View if User is Logged In */}
        {currentUser ? (
          <div className={styles.profileContainer}>
            <div className={styles.avatarWrapper}>
              <img
                src={"/logo2.png"} // از لوگوی پیشفرض استفاده میکنیم
                alt={currentUser.firstName || "کاربر"}
                className={styles.profileAvatar}
              />
              <span className={styles.statusBadge} title="آنلاین و تایید شده">
                <FaCheckCircle />
              </span>
            </div>
            
            {/* نمایش نام و نام خانوادگی دریافت شده از دیتابیس */}
            <h3 className={styles.userName}>
              {currentUser.firstName} {currentUser.lastName}
            </h3>
            <p className={styles.userEmail}>{currentUser.email}</p>

            <div className={styles.userMetaCard}>
              <div className={styles.metaRow}>
                <span>وضعیت حساب:</span>
                <span className={styles.activeTag}>فعال و تایید شده</span>
              </div>
              <div className={styles.metaRow}>
                <span>نقش کاربری:</span>
                <span style={{ fontWeight: "700", color: "#1e293b" }}>
                  {isAdmin ? "مدیر سایت" : "کاربر عمومی"}
                </span>
              </div>
            </div>

            <div className={styles.profileActions}>
              <button
                type="button"
                className={styles.dashboardBtn}
                onClick={() => {
                  onClose();
                  navigate("/dashboard");
                }}
              >
                <FaUserAlt />
                <span>ورود به پنل کاربری</span>
              </button>

              {isAdmin && (
                <button
                  type="button"
                  className={styles.dashboardBtn}
                  style={{ background: "var(--primary-color, #4f46e5)" }}
                  onClick={() => {
                    onClose();
                    navigate("/admin");
                  }}
                >
                  <FaShieldAlt />
                  <span>ورود به داشبورد ادمین</span>
                </button>
              )}

              <button
                type="button"
                className={styles.logoutBtn}
                onClick={handleLogout}
              >
                <FaSignOutAlt />
                <span>خروج از حساب کاربری</span>
              </button>
            </div>
          </div>
        ) : (
          /* Email Auth Form View */
          <>
            <div className={styles.headerInfo}>
              <div className={styles.shieldIconBadge}>
                <FaShieldAlt />
              </div>
              <h2 className={styles.modalTitle}>
                {mode === "login" && "ورود به حساب کاربری"}
                {mode === "register" && "ثبت‌نام در سایت"}
                {mode === "forgot" && "بازیابی رمز عبور"}
              </h2>
              <p className={styles.modalSub}>
                {mode === "login" && "آدرس ایمیل و رمز عبور خود را وارد نمایید."}
                {mode === "register" && "مشخصات خود را جهت ساخت حساب جدید وارد کنید."}
                {mode === "forgot" && "این قابلیت به زودی در سیستم راه‌اندازی می‌شود."}
              </p>
            </div>

            {/* Mode Selector Tabs */}
            {mode !== "forgot" && (
              <div className={styles.modeTabs}>
                <button
                  type="button"
                  className={`${styles.tabBtn} ${
                    mode === "login" ? styles.activeTab : ""
                  }`}
                  onClick={() => {
                    setMode("login");
                    handleResetForm();
                  }}
                >
                  ورود
                </button>
                <button
                  type="button"
                  className={`${styles.tabBtn} ${
                    mode === "register" ? styles.activeTab : ""
                  }`}
                  onClick={() => {
                    setMode("register");
                    handleResetForm();
                  }}
                >
                  ثبت‌نام
                </button>
              </div>
            )}

            {error && <div className={styles.errorAlert}>{error}</div>}
            {success && (
              <div className={styles.successAlert}>
                <FaCheckCircle />
                <span>{success}</span>
              </div>
            )}

            {/* Login Form */}
            {mode === "login" && (
              <form onSubmit={handleLogin} className={styles.formStack}>
                <div className={styles.inputGroup}>
                  <label>آدرس ایمیل:</label>
                  <div className={styles.inputWrapper}>
                    <FaEnvelope className={styles.inputIcon} />
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      dir="ltr"
                      autoFocus
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label>رمز عبور:</label>
                  <div className={styles.inputWrapper}>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      dir="ltr"
                    />
                    <button
                      type="button"
                      className={styles.togglePasswordBtn}
                      onClick={() => setShowPassword(!showPassword)}
                      title={showPassword ? "مخفی کردن" : "نمایش"}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className={styles.forgotRow}>
                  <button
                    type="button"
                    className={styles.forgotLink}
                    onClick={() => {
                      setMode("forgot");
                      handleResetForm();
                    }}
                  >
                    رمز عبور خود را فراموش کرده‌اید؟
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={styles.submitBtn}
                >
                  {loading ? "در حال ورود..." : "ورود به حساب"}
                </button>
              </form>
            )}

            {/* Register Form */}
            {mode === "register" && (
              <form onSubmit={handleRegister} className={styles.formStack}>
                <div className={styles.inputGroup}>
                  <label>نام و نام خانوادگی:</label>
                  <div className={styles.inputWrapper}>
                    <FaUser className={styles.inputIcon} />
                    <input
                      type="text"
                      placeholder="نام کامل شما"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label>آدرس ایمیل:</label>
                  <div className={styles.inputWrapper}>
                    <FaEnvelope className={styles.inputIcon} />
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label>رمز عبور (حداقل ۶ کاراکتر):</label>
                  <div className={styles.inputWrapper}>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      dir="ltr"
                    />
                    <button
                      type="button"
                      className={styles.togglePasswordBtn}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={styles.submitBtn}
                >
                  {loading ? "در حال پردازش..." : "ثبت‌نام و ایجاد حساب"}
                </button>
              </form>
            )}

            {/* Forgot Password Form */}
            {mode === "forgot" && (
              <form onSubmit={handleForgotPassword} className={styles.formStack}>
                <div className={styles.inputGroup}>
                  <label>آدرس ایمیل ثبت شده:</label>
                  <div className={styles.inputWrapper}>
                    <FaEnvelope className={styles.inputIcon} />
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      dir="ltr"
                      autoFocus
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={styles.submitBtn}
                >
                  <FaKey />
                  <span>
                    {loading ? "در حال ارتباط..." : "ارسال لینک بازیابی"}
                  </span>
                </button>

                <div style={{ textAlign: "center", marginTop: "12px" }}>
                  <button
                    type="button"
                    className={styles.forgotLink}
                    onClick={() => {
                      setMode("login");
                      handleResetForm();
                    }}
                  >
                    بازگشت به صفحه ورود
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}