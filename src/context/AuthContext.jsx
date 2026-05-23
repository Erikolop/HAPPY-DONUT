import { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("hd_token") || "");
  const [admin, setAdmin] = useState(() => {
    try {
      const raw = localStorage.getItem("hd_admin");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback((newToken, newAdmin) => {
    setToken(newToken);
    setAdmin(newAdmin);
    localStorage.setItem("hd_token", newToken);
    localStorage.setItem("hd_admin", JSON.stringify(newAdmin));
  }, []);

  const logout = useCallback(() => {
    setToken("");
    setAdmin(null);
    localStorage.removeItem("hd_token");
    localStorage.removeItem("hd_admin");
  }, []);

  return (
    <AuthContext.Provider value={{ token, admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
