import React, { useState, useEffect } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../firebase'; // مطمئن بشید مسیر فایل firebase.js درست باشه

export default function LoginModal() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [step, setStep] = useState('phone'); // 'phone' یا 'otp'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // ۱. ساخت recaptcha موقع لود شدن صفحه
  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA تایید شد
        },
        'expired-callback': () => {
          setError('تاییدیه کپچا منقضی شد. دوباره تلاش کنید.');
        }
      });
    }
  }, []);

  // ۲. مدیریت تایمر معکوس برای ارسال مجدد
  useEffect(() => {
    let interval = null;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // ۳. تابع تبدیل شماره به فرمت بین‌المللی (+98)
  const formatPhoneNumber = (phone) => {
    let cleaned = phone.trim().replace(/\s+/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '+98' + cleaned.slice(1);
    } else if (!cleaned.startsWith('+')) {
      cleaned = '+98' + cleaned;
    }
    return cleaned;
  };

  // ۴. ارسال کد SMS
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      const appVerifier = window.recaptchaVerifier;

      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      
      setConfirmationResult(confirmation);
      setStep('otp');
      setTimer(60);
      setCanResend(false);
    } catch (err) {
      console.error(err);
      setError('خطا در ارسال پیامک. شماره موبایل یا تنظیمات فایربیس را بررسی کنید.');
    } finally {
      setLoading(false);
    }
  };

  // ۵. تایید کد ارسال شده
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      console.log('ورود موفقیت‌آمیز کاربر:', user);
      alert(`ورود با موفقیت انجام شد! کد کاربر: ${user.uid}`);
      // اینجا می‌تونید کاربر رو به داشبورد هدایت کنید (با useNavigate)
    } catch (err) {
      console.error(err);
      setError('کد وارد شده اشتباه است یا منقضی شده.');
    } finally {
      setLoading(false);
    }
  };

  // ۶. تغییر شماره (بازگشت به مرحله اول)
  const handleReset = () => {
    setStep('phone');
    setOtp('');
    setError('');
    setConfirmationResult(null);
  };

  return (
    <div style={styles.container}>
      {/* المان نگهدارنده کپچای مخفی */}
      <div id="recaptcha-container"></div>

      <h2 style={styles.title}>ورود با شماره موبایل</h2>

      {error && <div style={styles.errorBox}>{error}</div>}

      {step === 'phone' ? (
        <form onSubmit={handleSendOtp} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>شماره موبایل:</label>
            <input
              type="tel"
              placeholder="09123456789"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              style={styles.input}
              dir="ltr"
            />
          </div>
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'در حال ارسال کد...' : 'ارسال کد تایید'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              کد تایید ارسال شده به {phoneNumber} را وارد کنید:
            </label>
            <input
              type="text"
              placeholder="123456"
              maxLength="6"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              style={styles.input}
              dir="ltr"
            />
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'در حال بررسی...' : 'تایید و ورود'}
          </button>

          <div style={styles.resendContainer}>
            {canResend ? (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
                style={styles.textButton}
              >
                ارسال مجدد کد
              </button>
            ) : (
              <span style={styles.timerText}>
                ارسال مجدد کد تا {timer} ثانیه دیگر
              </span>
            )}

            <button
              type="button"
              onClick={handleReset}
              style={{ ...styles.textButton, color: '#666' }}
            >
              ویرایش شماره موبایل
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

// استایل‌های پایه برای تمیزتر شدن فرم
const styles = {
  container: {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    fontFamily: 'Tahoma, sans-serif',
    direction: 'rtl',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    color: '#333',
  },
  input: {
    padding: '10px 12px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '16px',
    textAlign: 'center',
  },
  button: {
    padding: '12px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  textButton: {
    background: 'none',
    border: 'none',
    color: '#007bff',
    cursor: 'pointer',
    fontSize: '14px',
    padding: '0',
  },
  resendContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
  },
  timerText: {
    fontSize: '14px',
    color: '#888',
  },
  errorBox: {
    backgroundColor: '#ffe6e6',
    color: '#d9534f',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '16px',
    fontSize: '14px',
    textAlign: 'center',
  },
};