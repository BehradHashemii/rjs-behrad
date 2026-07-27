import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTimes,
  FaPhoneAlt,
  FaShieldAlt,
  FaCheckCircle,
  FaUserCheck,
  FaSignOutAlt,
  FaCommentDots,
  FaCopy,
  FaArrowRight,
  FaRedo,
  FaPaste,
} from "react-icons/fa";
import styles from "./LoginModal.module.css";
import e2p, { p2e, isValidIranianMobile } from "../utils/persianNumber";
import useAuth from "../hooks/useAuth";
import { toast, ToastContainer } from "react-toastify";
function LoginModal({ isOpen, onClose }) {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [smsBubble, setSmsBubble] = useState(null);
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const digitRefs = useRef([]);
  const phoneInputRef = useRef(null);
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    if (isOpen) {
      if (step === 1) {
        setTimeout(() => phoneInputRef.current?.focus(), 100);
      } else if (step === 2) {
        setTimeout(() => digitRefs.current[0]?.focus(), 100);
      }
    }
  }, [isOpen, step]);

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
  const cleanPhone = p2e(phone).replace(/[^\d]/g, "");
  const handleRequestOtp = (e) => {
    if (e) e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    if (!isValidIranianMobile(phone)) {
      const msg =
        "شماره همراه معتبر نیست! شماره باید با ۰۹ شروع شده و ۱۱ رقم باشد (مثال: ۰۹۱۲۳۴۵۶۷۸۹).";
      setErrorMsg(msg);
      toast.info(msg, "error");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(code);
      setOtpDigits(["", "", "", ""]);
      setStep(2);
      setCountdown(30);
      toast.success(`کد تایید ۴ رقمی به شماره ${e2p(cleanPhone)} پیامک شد.`);

      setSmsBubble({
        visible: true,
        code: code,
        time: "هم‌اکنون",
      });
    }, 600);
  };

  const handleAutoFillCode = () => {
    if (!generatedOtp) return;
    const digits = generatedOtp.split("");
    setOtpDigits(digits);
    setCopied(true);
    toast.info("کد ۴ رقمی پیامک به‌طور خودکار جایگذاری شد.");
    setTimeout(() => setCopied(false), 2000);

    if (digitRefs.current[3]) {
      digitRefs.current[3].focus();
    }
  };
  const handleDigitChange = (index, value) => {
    const cleanVal = p2e(value).replace(/[^\d]/g, "");
    if (cleanVal.length > 1) {
      const pastedDigits = cleanVal.slice(0, 4).split("");
      const newDigits = ["", "", "", ""];
      pastedDigits.forEach((d, i) => {
        newDigits[i] = d;
      });
      setOtpDigits(newDigits);
      if (pastedDigits.length === 4 && digitRefs.current[3]) {
        digitRefs.current[3].focus();
      }
      return;
    }

    const newDigits = [...otpDigits];
    newDigits[index] = cleanVal;
    setOtpDigits(newDigits);

    if (cleanVal && index < 3) {
      digitRefs.current[index + 1]?.focus();
    }
  };
  const handleDigitKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      digitRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = (e) => {
    if (e) e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const enteredCode = otpDigits.join("");

    if (enteredCode.length < 4) {
      const msg = "لطفاً کد ۴ رقمی تایید را به طور کامل وارد کنید.";
      setErrorMsg(msg);
      toast.error(msg);
      return;
    }

    if (enteredCode !== generatedOtp) {
      const msg = "کد وارد شده نادرست است. لطفاً کد پیامک شده را بررسی کنید.";
      setErrorMsg(msg);
      toast.error(msg);
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      const formattedPhone = cleanPhone;
      const userData = {
        name: `کاربر ${e2p(formattedPhone.slice(-4))}`,
        phone: formattedPhone,
        email: `user_${formattedPhone}@behradhashemii.ir`,
        avatar:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
        joinedDate: new Date().toLocaleDateString("fa-IR"),
      };
      login(userData);

      const successText = "کد تایید پذیرفته شد! ورود موفقیت‌آمیز بود.";
      setSuccessMsg(successText);
      toast.success("خوش آمدید! ورود موفقیت‌آمیز بود.");
      setSmsBubble(null);

      setTimeout(() => {
        setSuccessMsg("");
        onClose();
      }, 800);
    }, 600);
  };
  const handleLogout = () => {
    logout();
    setPhone("");
    setOtpDigits(["", "", "", ""]);
    setStep(1);
    setSmsBubble(null);
    toast.info("با موفقیت از حساب کاربری خارج شدید.");
  };

  return (
    <>
      {smsBubble && smsBubble.visible && (
        <div className={styles.smsToastOverlay}>
          <div className={styles.smsToastCard}>
            <div className={styles.smsHeader}>
              <div className={styles.smsHeaderLeft}>
                <div className={styles.smsIconBadge}>
                  <FaCommentDots />
                </div>
                <div className={styles.smsSenderInfo}>
                  <span className={styles.smsSenderName}>
                    پیامک سیستم (SMS)
                  </span>
                  <span className={styles.smsTime}>{smsBubble.time}</span>
                </div>
              </div>
              <button
                type="button"
                className={styles.smsCloseBtn}
                onClick={() => setSmsBubble(null)}
                title="بستن اعلان"
              >
                <FaTimes />
              </button>
            </div>

            <div className={styles.smsBody}>
              <p className={styles.smsText}>
                کد یک‌بار مصرف ورود شما به سایت:{" "}
                <strong className={styles.smsCodeHighlight}>
                  {e2p(smsBubble.code)}
                </strong>
              </p>
            </div>

            <div className={styles.smsActions}>
              <button
                type="button"
                className={styles.autoFillBtn}
                onClick={handleAutoFillCode}
              >
                {copied ? <FaCheckCircle /> : <FaPaste />}
                <span>{copied ? "جایگذاری شد!" : "جایگذاری خودکار کد"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Login Modal Backdrop */}
      <div className={styles.backdrop} onClick={onClose}>
        <div
          className={`${styles.modalCard} glassBG`}
          onClick={(e) => e.stopPropagation()}
        >
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
            /* Logged in profile view */
            <div className={styles.profileContainer}>
              <div className={styles.avatarWrapper}>
                <img
                  src={user.avatar}
                  alt={user.name}
                  className={styles.profileAvatar}
                />
                <div className={styles.statusBadge}>
                  <FaUserCheck />
                </div>
              </div>

              <h2 className={styles.userName}>{user.name}</h2>
              <p className={styles.userEmail}>
                {e2p(user.phone || "۰۹۱۲۳۴۵۶۷۸۹")}
              </p>

              <div className={styles.userMetaCard}>
                <div className={styles.metaRow}>
                  <span>وضعیت ورود:</span>
                  <span className={styles.activeTag}>
                    احراز هویت پیامکی ۲ مرحله‌ای
                  </span>
                </div>
                <div className={styles.metaRow}>
                  <span>تاریخ عضویت:</span>
                  <span>{user.joinedDate || ""}</span>
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
                  <span>ورود به پنل کاربری و داشبورد</span>
                </button>

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
            /* SMS OTP Form */
            <div className={styles.authContainer}>
              <div className={styles.headerInfo}>
                <div className={styles.shieldIconBadge}>
                  <FaShieldAlt />
                </div>
                <h2 className={styles.modalTitle}>ورود با رمز یک‌بار مصرف</h2>
                <p className={styles.modalSub}>
                  {step === 1
                    ? "شماره موبایل خود را وارد کنید تا کد تایید ۴ رقمی پیامک شود."
                    : `کد تایید ۴ رقمی پیامک‌شده به ${e2p(phone)} را وارد کنید.`}
                </p>
              </div>

              {errorMsg && <div className={styles.errorAlert}>{errorMsg}</div>}
              {successMsg && (
                <div className={styles.successAlert}>
                  <FaCheckCircle />
                  <span>{successMsg}</span>
                </div>
              )}

              {step === 1 ? (
                /* Step 1: Phone Entry */
                <form onSubmit={handleRequestOtp} className={styles.formStack}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="phone-input">شماره همراه (ایران)</label>
                    <div className={styles.inputWrapper}>
                      <FaPhoneAlt className={styles.inputIcon} />
                      <input
                        id="phone-input"
                        ref={phoneInputRef}
                        type="tel"
                        dir="ltr"
                        placeholder="0912 345 6789"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={isLoading}
                  >
                    {isLoading ? "در حال ارسال پیامک..." : "دریافت کد تایید"}
                  </button>
                </form>
              ) : (
                /* Step 2: 4-Digit OTP Entry */
                <form onSubmit={handleVerifyOtp} className={styles.formStack}>
                  <div className={styles.otpGroup}>
                    <label className={styles.otpLabel}>
                      کد تایید ۴ رقمی را وارد کنید:
                    </label>
                    <div className={styles.otpBoxes} dir="ltr">
                      {otpDigits.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => (digitRefs.current[idx] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          className={styles.otpInput}
                          value={digit}
                          onChange={(e) =>
                            handleDigitChange(idx, e.target.value)
                          }
                          onKeyDown={(e) => handleDigitKeyDown(idx, e)}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={isLoading}
                  >
                    {isLoading ? "در حال بررسی..." : "تایید و ورود"}
                  </button>

                  <div className={styles.otpSecondaryActions}>
                    <button
                      type="button"
                      className={styles.editPhoneBtn}
                      onClick={() => {
                        setStep(1);
                        setErrorMsg("");
                        setSuccessMsg("");
                      }}
                    >
                      <FaArrowRight />
                      <span>تغییر شماره همراه ({e2p(phone)})</span>
                    </button>

                    {countdown > 0 ? (
                      <div className={styles.timerBadge}>
                        <span>{e2p(countdown)} ثانیه تا ارسال مجدد کد</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className={styles.resendBtn}
                        onClick={handleRequestOtp}
                      >
                        <FaRedo />
                        <span>ارسال مجدد کد</span>
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
      <ToastContainer rtl position="bottom-center" />
    </>
  );
}

export default LoginModal;
