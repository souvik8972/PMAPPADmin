import React, { createContext, useEffect, useState } from "react";
import { getToken, saveToken, removeToken } from "../utils/auth";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const token = await getToken();
      setUser(token); 
    };
    loadUser();
  }, []);

  const login = async (token) => {
    await saveToken(token);
    setUser(token);
  };

  const logout = async () => {
    await removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
