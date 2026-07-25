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
import useToast from "../hooks/useToast";

function LoginModal({ isOpen, onClose }) {
  const { user, login, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Step 1: Phone, Step 2: OTP
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);
  const [generatedOtp, setGeneratedOtp] = useState("");

  // SMS notification bubble
  const [smsBubble, setSmsBubble] = useState(null); // { visible: boolean, code: string }
  const [copied, setCopied] = useState(false);

  // 60-Second Countdown Timer for resend
  const [countdown, setCountdown] = useState(0);

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Refs for 4-digit input fields
  const digitRefs = useRef([]);
  const phoneInputRef = useRef(null);

  // Countdown timer effect (60s)
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  // Focus management on open/step change
  useEffect(() => {
    if (isOpen) {
      if (step === 1) {
        setTimeout(() => phoneInputRef.current?.focus(), 100);
      } else if (step === 2) {
        setTimeout(() => digitRefs.current[0]?.focus(), 100);
      }
    }
  }, [isOpen, step]);

  // Handle ESC key
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

  // Format and clean phone number (Persian/Arabic to English digits)
  const cleanPhone = p2e(phone).replace(/[^\d]/g, "");

  // Request OTP (Send SMS) with Iranian Phone Validation
  const handleRequestOtp = (e) => {
    if (e) e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    // Validate Iranian mobile format (Must start with 09 and be 11 digits)
    if (!isValidIranianMobile(phone)) {
      const msg =
        "شماره همراه معتبر نیست! شماره باید با ۰۹ شروع شده و ۱۱ رقم باشد (مثال: ۰۹۱۲۳۴۵۶۷۸۹).";
      setErrorMsg(msg);
      showToast(msg, "error");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Generate random 4-digit OTP code
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(code);
      setOtpDigits(["", "", "", ""]);
      setStep(2);
      setCountdown(60); // 60 seconds timer

      // Show Toast Notification
      showToast(
        `کد تایید ۴ رقمی به شماره ${e2p(cleanPhone)} پیامک شد.`,
        "success",
      );

      // Trigger SMS Notification Bubble
      setSmsBubble({
        visible: true,
        code: code,
        time: "هم‌اکنون",
      });
    }, 600);
  };

  // Auto-fill code from SMS Bubble
  const handleAutoFillCode = () => {
    if (!generatedOtp) return;
    const digits = generatedOtp.split("");
    setOtpDigits(digits);
    setCopied(true);
    showToast("کد ۴ رقمی پیامک به‌طور خودکار جایگذاری شد.", "info");
    setTimeout(() => setCopied(false), 2000);

    if (digitRefs.current[3]) {
      digitRefs.current[3].focus();
    }
  };

  // Handle OTP digit changes
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

  // Handle KeyDown on OTP digits (Backspace navigation)
  const handleDigitKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      digitRefs.current[index - 1]?.focus();
    }
  };

  // Verify OTP Code
  const handleVerifyOtp = (e) => {
    if (e) e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const enteredCode = otpDigits.join("");

    if (enteredCode.length < 4) {
      const msg = "لطفاً کد ۴ رقمی تایید را به طور کامل وارد کنید.";
      setErrorMsg(msg);
      showToast(msg, "error");
      return;
    }

    if (enteredCode !== generatedOtp) {
      const msg = "کد وارد شده نادرست است. لطفاً کد پیامک شده را بررسی کنید.";
      setErrorMsg(msg);
      showToast(msg, "error");
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
        joinedDate: new Date().getDate(),
      };

      // Save user to Auth Context and Storage
      login(userData);

      const successText = "کد تایید پذیرفته شد! ورود موفقیت‌آمیز بود.";
      setSuccessMsg(successText);
      showToast("خوش آمدید! ورود موفقیت‌آمیز بود.", "success");
      setSmsBubble(null);

      setTimeout(() => {
        setSuccessMsg("");
        onClose();
      }, 800);
    }, 600);
  };

  // Logout handle
  const handleLogout = () => {
    logout();
    setPhone("");
    setOtpDigits(["", "", "", ""]);
    setStep(1);
    setSmsBubble(null);
    showToast("با موفقیت از حساب کاربری خارج شدید.", "info");
  };

  return (
    <>
      {/* Floating SMS Notification Bubble (Simulated Toast) */}
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
                کد یک‌بار مصرف ورود شما به سایت بهراد:{" "}
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
              <button
                type="button"
                className={styles.copyCodeBtn}
                onClick={() => {
                  navigator.clipboard.writeText(smsBubble.code);
                  setCopied(true);
                  showToast("کد ۴ رقمی کپی شد.", "info");
                  setTimeout(() => setCopied(false), 2000);
                }}
              >
                <FaCopy />
                <span>کپی</span>
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
                  <span>{user.joinedDate || "۱۴۰۴/۰۵/۰۱"}</span>
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
                <h2 className={styles.modalTitle}>
                  ورود با رمز یک‌بار مصرف (OTP)
                </h2>
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
    </>
  );
}

export default LoginModal;
