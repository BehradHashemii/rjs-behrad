import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
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
  const { user: currentUser, logout, isAdmin } = useAuth();

  const [mode, setMode] = useState("login"); // 'login' | 'register' | 'forgot'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // ESC Key handler
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
      await signInWithEmailAndPassword(auth, email.trim(), password);
      setSuccess("ورود با موفقیت انجام شد!");

      setTimeout(() => {
        onClose();
      }, 800);
    } catch (firebaseErr) {
      console.warn("Firebase Auth signin notice:", firebaseErr);
      if (
        firebaseErr?.code === "auth/wrong-password" ||
        firebaseErr?.code === "auth/invalid-credential"
      ) {
        setError("ایمیل یا رمز عبور اشتباه است.");
      } else if (firebaseErr?.code === "auth/user-not-found") {
        setError("کاربری با این ایمیل یافت نشد.");
      } else if (firebaseErr?.code === "auth/invalid-email") {
        setError("فرمت آدرس ایمیل معتبر نیست.");
      } else {
        setError("خطا در برقراری ارتباط. لطفاً دوباره تلاش کنید.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("لطفاً ایمیل و رمز عبور را وارد کنید.");
      return;
    }

    if (password.length < 6) {
      setError("رمز عبور باید حداقل ۶ کاراکتر باشد.");
      return;
    }

    setLoading(true);

    try {
      // ۱. ساخت کاربر در Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );
      const user = userCredential.user;

      // ۲. ثبت نام نمایش داده شده در پروفایل Auth
      if (name.trim()) {
        await updateProfile(user, { displayName: name.trim() });
      }

      // ۳. ساخت خودکار سند کاربر در کلکسیون users در Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: name.trim() || email.split("@")[0],
        email: user.email,
        pass: user.password,
        role: "user", // نقش پیش‌فرض برای تمام کاربران جدید
        createdAt: serverTimestamp(),
        avatar:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      });

      setSuccess("حساب کاربری شما با موفقیت ایجاد شد!");

      setTimeout(() => {
        onClose();
      }, 800);
    } catch (firebaseErr) {
      console.warn("Firebase Auth signup notice:", firebaseErr);
      if (firebaseErr?.code === "auth/email-already-in-use") {
        setError("این ایمیل قبلاً ثبت شده است. لطفاً وارد شوید.");
      } else if (firebaseErr?.code === "auth/weak-password") {
        setError("رمز عبور بسیار ضعیف است.");
      } else if (firebaseErr?.code === "auth/invalid-email") {
        setError("فرمت آدرس ایمیل معتبر نیست.");
      } else {
        setError("خطا در ثبت‌نام. لطفاً دوباره تلاش کنید.");
      }
    } finally {
      setLoading(false);
    }
  };

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
      await sendPasswordResetEmail(auth, email.trim());
      setSuccess("لینک بازیابی رمز عبور به ایمیل شما ارسال شد.");
    } catch (firebaseErr) {
      console.warn("Password reset notice:", firebaseErr);
      if (firebaseErr?.code === "auth/user-not-found") {
        setError("کاربری با این ایمیل یافت نشد.");
      } else if (firebaseErr?.code === "auth/invalid-email") {
        setError("فرمت آدرس ایمیل معتبر نیست.");
      } else {
        setSuccess("لینک بازنشانی رمز عبور به ایمیل شما ارسال گردید.");
      }
    } finally {
      setLoading(false);
    }
  };

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
                src={currentUser.avatar || "/logo2.png"}
                alt={currentUser.displayName || "User Avatar"}
                className={styles.profileAvatar}
              />
              <span className={styles.statusBadge} title="آنلاین و تایید شده">
                <FaCheckCircle />
              </span>
            </div>
            <h3 className={styles.userName}>
              {currentUser.displayName || currentUser.email.split("@")[0]}
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
                  {isAdmin ? "مدیر" : "کاربر عمومی"}
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
                <span>ورود به داشبورد کاربری</span>
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
                  <span>ورود به پنل مدیریت</span>
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
                {mode === "register" && "ثبت‌نام در سامانه"}
                {mode === "forgot" && "بازیابی رمز عبور"}
              </h2>
              <p className={styles.modalSub}>
                {mode === "login" &&
                  "آدرس ایمیل و رمز عبور خود را وارد نمایید."}
                {mode === "register" &&
                  "مشخصات خود را جهت ساخت حساب جدید وارد کنید."}
                {mode === "forgot" &&
                  "ایمیل ثبت شده خود را جهت دریافت لینک بازیابی وارد نمایید."}
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
                      className={`${styles.togglePasswordBtn}`}
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
                  {loading ? "در حال ساخت حساب..." : "ثبت‌نام و ایجاد حساب"}
                </button>
              </form>
            )}

            {/* Forgot Password Form */}
            {mode === "forgot" && (
              <form
                onSubmit={handleForgotPassword}
                className={styles.formStack}
              >
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
                    {loading ? "در حال ارسال..." : "ارسال لینک بازیابی"}
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
