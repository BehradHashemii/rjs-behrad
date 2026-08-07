import { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase";
import {
  getUserProfileFromFirestore,
  saveUserProfileToFirestore,
} from "../services/firestoreService";
import {
  getLoggedUser,
  saveLoggedUser,
  removeLoggedUser,
} from "../utils/storage";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getLoggedUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        let firestoreProfile = await getUserProfileFromFirestore(firebaseUser.uid);
        if (!firestoreProfile) {
          firestoreProfile = {
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email.split("@")[0],
            email: firebaseUser.email,
            phone: firebaseUser.phoneNumber || "۰۹۱۲۳۴۵۶۷۸۹",
            role: "کاربر ویژه",
            avatar: firebaseUser.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
            joinedDate: new Date().toLocaleDateString("fa-IR"),
          };
          await saveUserProfileToFirestore(firebaseUser.uid, firestoreProfile);
        }

        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firestoreProfile.name || firebaseUser.displayName || "کاربر بهراد",
          phone: firestoreProfile.phone || "۰۹۱۲۳۴۵۶۷۸۹",
          role: firestoreProfile.role || "کاربر ویژه",
          avatar: firestoreProfile.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
          joinedDate: firestoreProfile.joinedDate || new Date().toLocaleDateString("fa-IR"),
          bio: firestoreProfile.bio || "",
          skills: firestoreProfile.skills || ["React.js", "JavaScript", "Firebase"],
        };

        saveLoggedUser(userData);
        setUser(userData);
      } else {
        removeLoggedUser();
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = useCallback(async (email, password) => {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential.user;
  }, []);

  const signupWithEmail = useCallback(async (fullName, email, password) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = credential.user;

    if (fullName) {
      try {
        await updateProfile(firebaseUser, { displayName: fullName });
      } catch (e) {
        console.warn("Update profile error:", e);
      }
    }

    const newProfile = {
      uid: firebaseUser.uid,
      name: fullName || email.split("@")[0],
      email: firebaseUser.email,
      phone: "۰۹۱۲۳۴۵۶۷۸۹",
      role: "کاربر ویژه",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      joinedDate: new Date().toLocaleDateString("fa-IR"),
    };

    await saveUserProfileToFirestore(firebaseUser.uid, newProfile);
    saveLoggedUser(newProfile);
    setUser(newProfile);

    return firebaseUser;
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
    removeLoggedUser();
    setUser(null);
  }, []);

  const resetPassword = useCallback(async (email) => {
    await sendPasswordResetEmail(auth, email);
  }, []);

  const updateUserProfile = useCallback(async (updatedData) => {
    if (!user?.uid) return;
    const merged = { ...user, ...updatedData };
    setUser(merged);
    saveLoggedUser(merged);
    await saveUserProfileToFirestore(user.uid, merged);
  }, [user]);

  const isLoggedIn = Boolean(user);
  const isAdmin = Boolean(
    user && (
      user.role === "admin" ||
      user.role === "مدیر" ||
      user.email === "cantikarisma29@gmail.com" ||
      user.email?.toLowerCase().includes("admin")
    )
  );

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
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;

