import { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import {
  getLoggedUser,
  saveLoggedUser,
  removeLoggedUser,
} from "../utils/storage";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getLoggedUser());

  useEffect(() => {
    const syncUser = () => {
      setUser(getLoggedUser());
    };
    window.addEventListener("user-auth-change", syncUser);
    return () => window.removeEventListener("user-auth-change", syncUser);
  }, []);

  const login = useCallback((userData) => {
    saveLoggedUser(userData);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    removeLoggedUser();
    setUser(null);
  }, []);

  const isLoggedIn = Boolean(user);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
