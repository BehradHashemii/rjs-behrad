import { useState, useEffect, useCallback } from "react";
// این خط رو اضافه کن تا کانتکست رو از فایل خودش بخونه
import { AuthContext } from "./AuthContext";
import api from "../utils/axiosInstance";

// ❌ اگر این خط تو کدت هست، پاکش کن چون کانتکست تو فایل جداست:
// export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // ... ادامه کدها بدون هیچ تغییری ...
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        // اگر توکن و اطلاعات کاربر وجود داشت، کاربر لاگین است
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  // ۲. تابع ورود به حساب کاربری
  const loginWithEmail = useCallback(async (email, password) => {
    // ارسال درخواست به مسیر لاگین در Node.js
    const response = await api.post("/auth/login", { email, password });

    // بک‌اند ما token و اطلاعات user رو برمی‌گردونه
    const { token, user: userData } = response.data;

    // ذخیره در مرورگر
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);
    return userData;
  }, []);

  // ۳. تابع ثبت‌نام
  const signupWithEmail = useCallback(
    async (fullName, email, password) => {
      // چون فرم تو فقط یک فیلد نام داره ولی دیتابیس ما نام و نام خانوادگی میخواد، اینجا جداش می‌کنیم
      const nameParts = fullName.trim().split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ") || "کاربر";

      // ارسال درخواست به مسیر ثبت‌نام در Node.js
      await api.post("/auth/register", {
        firstName,
        lastName,
        email,
        password,
      });

      // بعد از ثبت‌نام موفق، خودکار تابع لاگین رو صدا می‌زنیم تا توکن رو بگیریم
      return await loginWithEmail(email, password);
    },
    [loginWithEmail],
  );

  // ۴. تابع خروج از حساب
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  // ۵. توابعی که هنوز در بک‌اند توسعه داده نشدند
  const resetPassword = useCallback(async (email) => {
    // این قابلیت رو تو فازهای بعدی بک‌اند میسازیم
    throw new Error(
      "قابلیت بازیابی رمز عبور هنوز در سرور راه‌اندازی نشده است.",
    );
  }, []);

  const updateUserProfile = useCallback(async (updatedData) => {
    console.warn("API آپدیت پروفایل هنوز در سرور ساخته نشده است.");
  }, []);

  // متغیرهای کمکی برای کامپوننت‌های دیگر
  const isLoggedIn = Boolean(user);

  // بررسی نقش ادمین مستقیماً از دیتای بازگشتی MongoDB
  const isAdmin = Boolean(user && user.role === "admin");

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isLoggedIn,
        loading,
        login: loginWithEmail,
        signup: signupWithEmail,
        logout,
        resetPassword,
        updateUserProfile,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
