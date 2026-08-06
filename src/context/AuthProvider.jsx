import { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import { auth, db } from "../firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubUserDoc = null;

    // شنونده تغییرات وضعیت احراز هویت فایربیس
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // دریافت Realtime سند کاربر از Firestore برای خواندن نقش (role)
        unsubUserDoc = onSnapshot(
          doc(db, "users", currentUser.uid),
          (docSnap) => {
            if (docSnap.exists()) {
              setRole(docSnap.data().role || "user");
            } else {
              setRole("user");
            }
            setLoading(false);
          },
          (error) => {
            console.error("خطا در دریافت نقش کاربر:", error);
            setRole("user");
            setLoading(false);
          }
        );
      } else {
        setUser(null);
        setRole(null);
        setLoading(false);
        if (unsubUserDoc) unsubUserDoc();
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubUserDoc) unsubUserDoc();
    };
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      setUser(null);
      setRole(null);
    } catch (error) {
      console.error("خطا در خروج از حساب:", error);
    }
  }, []);

  const isLoggedIn = Boolean(user);
  const isAdmin = role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isLoggedIn,
        isAdmin,
        loading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;