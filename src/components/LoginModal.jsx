import { useState, useEffect } from "react";
import {
  FaTimes,
  FaEnvelope,
  FaLock,
  FaUser,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaGithub,
  FaSignOutAlt,
  FaCheckCircle,
  FaUserCheck,
} from "react-icons/fa";
import styles from "./LoginModal.module.css";
import { getLoggedUser, saveLoggedUser, removeLoggedUser } from "../utils/storage";

function LoginModal({ isOpen, onClose }) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [user, setUser] = useState(() => getLoggedUser());

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleAuthChange = () => {
      setUser(getLoggedUser());
    };

    window.addEventListener("user-auth-change", handleAuthChange);
    return () => {
      window.removeEventListener("user-auth-change", handleAuthChange);
    };
  }, []);

  // Handle ESC key press to close modal
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

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email.trim() || !password.trim()) {
      setErrorMsg("لطفاً تمامی فیلدها را وارد کنید.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const userData = {
        name: email.split("@")[0] || "کاربر بهراد",
        email: email,
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
        joinedDate: "۱۴۰۴/۰۵/۰۱",
      };

      saveLoggedUser(userData);
      setSuccessMsg("با موفقیت وارد شدید! خوش آمدید.");
      
      setTimeout(() => {
        setSuccessMsg("");
        onClose();
      }, 1200);
    }, 800);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setErrorMsg("لطفاً تمامی فیلدها را پر کنید.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("رمز عبور باید حداقل ۶ کاراکتر باشد.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const userData = {
        name: fullName.trim(),
        email: email.trim(),
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
        joinedDate: "۱۴۰۴/۰۵/۰۱",
      };

      saveLoggedUser(userData);
      setSuccessMsg("حساب شما با موفقیت ساخته شد!");

      setTimeout(() => {
        setSuccessMsg("");
        onClose();
      }, 1200);
    }, 800);
  };

  const handleSocialLogin = (providerName) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const userData = {
        name: `کاربر ${providerName}`,
        email: `user@${providerName.toLowerCase()}.com`,
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
        joinedDate: "۱۴۰۴/۰۵/۰۱",
      };
      saveLoggedUser(userData);
      setSuccessMsg(`ورود با ${providerName} با موفقیت انجام شد!`);

      setTimeout(() => {
        setSuccessMsg("");
        onClose();
      }, 1200);
    }, 700);
  };

  const handleLogout = () => {
    removeLoggedUser();
    setEmail("");
    setPassword("");
    setFullName("");
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={`${styles.modalCard} glassBG`} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="بستن پنجره"
          title="بستن"
        >
          <FaTimes />
        </button>

        {user ? (
          /* User Profile View when Logged In */
          <div className={styles.profileContainer}>
            <div className={styles.avatarWrapper}>
              <img src={user.avatar} alt={user.name} className={styles.profileAvatar} />
              <div className={styles.statusBadge}>
                <FaUserCheck />
              </div>
            </div>

            <h2 className={styles.userName}>{user.name}</h2>
            <p className={styles.userEmail}>{user.email}</p>

            <div className={styles.userMetaCard}>
              <div className={styles.metaRow}>
                <span>وضعیت حساب:</span>
                <span className={styles.activeTag}>فعال و تایید شده</span>
              </div>
              <div className={styles.metaRow}>
                <span>تاریخ عضویت:</span>
                <span>{user.joinedDate || "۱۴۰۴/۰۵/۰۱"}</span>
              </div>
            </div>

            <div className={styles.profileActions}>
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
          /* Login / Register Forms */
          <div className={styles.authContainer}>
            <div className={styles.headerInfo}>
              <h2 className={styles.modalTitle}>
                {mode === "login" ? "ورود به حساب کاربری" : "ایجاد حساب کاربری جدید"}
              </h2>
              <p className={styles.modalSub}>
                {mode === "login"
                  ? "برای دسترسی به تمام امکانات و ذخیره‌ها وارد شوید."
                  : "به خانواده کاربران بهراد بپیوندید!"}
              </p>
            </div>

            <div className={styles.tabBar}>
              <button
                type="button"
                className={`${styles.tabBtn} ${mode === "login" ? styles.activeTab : ""}`}
                onClick={() => {
                  setMode("login");
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
              >
                ورود
              </button>
              <button
                type="button"
                className={`${styles.tabBtn} ${mode === "register" ? styles.activeTab : ""}`}
                onClick={() => {
                  setMode("register");
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
              >
                عضویت
              </button>
            </div>

            {errorMsg && <div className={styles.errorAlert}>{errorMsg}</div>}
            {successMsg && (
              <div className={styles.successAlert}>
                <FaCheckCircle />
                <span>{successMsg}</span>
              </div>
            )}

            {mode === "login" ? (
              <form onSubmit={handleLoginSubmit} className={styles.formStack}>
                <div className={styles.inputGroup}>
                  <label htmlFor="login-email">ایمیل یا شماره موبایل</label>
                  <div className={styles.inputWrapper}>
                    <FaEnvelope className={styles.inputIcon} />
                    <input
                      id="login-email"
                      type="text"
                      placeholder="example@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <div className={styles.labelWithLink}>
                    <label htmlFor="login-password">رمز عبور</label>
                    <a
                      href="#forgot"
                      className={styles.forgotLink}
                      onClick={(e) => {
                        e.preventDefault();
                        alert("لینک بازنشانی رمز عبور به ایمیل شما ارسال می‌شود.");
                      }}
                    >
                      فراموشی رمز؟
                    </a>
                  </div>
                  <div className={styles.inputWrapper}>
                    <FaLock className={styles.inputIcon} />
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className={styles.eyeBtn}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={isLoading}
                >
                  {isLoading ? "در حال ورود..." : "ورود به حساب"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className={styles.formStack}>
                <div className={styles.inputGroup}>
                  <label htmlFor="reg-name">نام و نام خانوادگی</label>
                  <div className={styles.inputWrapper}>
                    <FaUser className={styles.inputIcon} />
                    <input
                      id="reg-name"
                      type="text"
                      placeholder="مثلا: علی رضایی"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="reg-email">آدرس ایمیل</label>
                  <div className={styles.inputWrapper}>
                    <FaEnvelope className={styles.inputIcon} />
                    <input
                      id="reg-email"
                      type="email"
                      placeholder="example@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="reg-password">رمز عبور جدید</label>
                  <div className={styles.inputWrapper}>
                    <FaLock className={styles.inputIcon} />
                    <input
                      id="reg-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="حداقل ۶ کاراکتر"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className={styles.eyeBtn}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={isLoading}
                >
                  {isLoading ? "در حال ثبت‌نام..." : "ایجاد حساب کاربری"}
                </button>
              </form>
            )}

            <div className={styles.divider}>
              <span>یا ورود با</span>
            </div>

            <div className={styles.socialButtons}>
              <button
                type="button"
                className={styles.socialBtn}
                onClick={() => handleSocialLogin("گوگل")}
              >
                <FaGoogle style={{ color: "#ea4335" }} />
                <span>گوگل</span>
              </button>

              <button
                type="button"
                className={styles.socialBtn}
                onClick={() => handleSocialLogin("گیت‌هاب")}
              >
                <FaGithub style={{ color: "#333" }} />
                <span>گیت‌هاب</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginModal;
