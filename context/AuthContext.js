import React, { createContext, useEffect, useState } from "react";
import { getAuthInfo, saveAuthInfo, removeAuthInfo,checkTokenExpiration } from "../utils/auth"; // Updated to reflect changes

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [expoTokenToSend,setExpoTokenToSend]=useState();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const authInfo = await getAuthInfo(); // Get user info (token, email, empId, userType)
        if (authInfo) {
 // Log the auth info for debugging
          const tokenExpiration = checkTokenExpiration(authInfo.exp);
          !tokenExpiration? setUser(authInfo):setUser(null); // Check token expiration
          // Store the user information in state
        } else {
          setUser(null); // No auth info, set user to null
        }
      } catch (error) {
        console.error("Failed to load user token:", error);
        setUser(null);
      } finally {
        setIsLoading(false); // Mark loading as complete
      }
    };
    loadUser();
  }, []);

  const login = async (token) => {
    console.log("token",token)
    try {
      await saveAuthInfo(token);
      const authInfo = await getAuthInfo(); 
      // console.log(authInfo,"AuthInfo")
      setUser(authInfo); 
    } catch (error) {
      // console.error("Failed to save token:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await removeAuthInfo(); // Remove all auth info (token + user data)
      setUser(null); // Clear user state on logout
    } catch (error) {
      // console.error("Failed to remove token:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout,setExpoTokenToSend,expoTokenToSend }}>
      {children}
    </AuthContext.Provider>
  );
}
