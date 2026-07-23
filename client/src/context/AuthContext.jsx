import { createContext, useContext, useEffect, useState } from "react";
import { getMe } from "../lib/api";
import { getToken, setToken } from "../lib/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    getMe()
      .then((data) => setUser(data.user))
      .catch(() => setToken(null))
      .finally(() => setLoading(false));
  }, []);

  const login = (token, loggedInUser) => {
    setToken(token);
    setUser(loggedInUser);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const updateUser = (nextUser) => setUser(nextUser);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
