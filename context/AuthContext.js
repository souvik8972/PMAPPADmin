import React, { createContext, useEffect, useState } from "react";
import { getAuthInfo, saveAuthInfo, removeAuthInfo,checkTokenExpiration, getRefreshToken } from "../utils/auth"; // Updated to reflect changes
import { getNewTokenBYRefreshToken, removeExpoToken, savePushTokenToBackend } from "@/services/api";
import { router } from "expo-router";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [expoTokenToSend,setExpoTokenToSend]=useState();

  useEffect(() => {
   
    loadUser();
  }, []);
 const loadUser = async () => {
      try {
        const authInfo = await getAuthInfo(); // Get user info (token, email, empId, userType)
        if (authInfo) {
 // Log the auth info for debugging
          // const tokenExpiration = checkTokenExpiration(authInfo.exp);
          setUser(authInfo) // Check token expiration
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
  const login = async (token) => {
    // console.log("token1111",token)
    try {
    
      await saveAuthInfo(token?.accessToken,token?.refreshToken); // Save token and refresh token
      const authInfo = await getAuthInfo(); 
     
      // const refreshToken = await getRefreshToken();
      // console.log(authInfo,"AuthInfo")
      // console.log("refreshToken1111",refreshToken)
      // console.log(refreshToken,"RefreshToken")
      setUser(authInfo); 
    } catch (error) {
      // console.error("Failed to save token:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const token = await accessTokenGetter();
      if(token){
      await removeExpoToken(user.empId, expoTokenToSend||"", token);
    console.log("Expo token removed from backend");

      }
      await removeAuthInfo();

     
  //  console.log(user,"User")
      
    //  console.log("Logout button pressed 1");
    } catch (error) {
        await removeAuthInfo();
      console.error("Failed to remove token:", error);
      router.replace('/login');
      throw error;
    }
  };
    const logoutWithOutTokenRemove = async () => {
    try {
   
      //  await  savePushTokenToBackend(user.empId,"",user.token)
      await removeAuthInfo();
  //  console.log(user,"User")
      
    //  console.log("Logout button pressed 1");
    } catch (error) {
      // console.error("Failed to remove token:", error);
      throw error;
    }
  };

  const accessTokenGetter=async()=>{
    const auth_info = await getAuthInfo();
    console.log("Token checking,  from context outside");

   if (checkTokenExpiration(auth_info?.exp)){
    console.log("Token expired, refreshing... from context");
    const refToken= await getRefreshToken();
    if(!refToken) {
      await logout();
      console.log("No refresh token available, redirecting to login");
       router.replace('/login');
      return null;
    }
     const newToken = await getNewTokenBYRefreshToken(refToken);
     if (newToken) {
       await saveAuthInfo(newToken.accessToken, newToken.refreshToken);
       await loadUser();
       return newToken.accessToken;
     }
   }

    return auth_info?.token;
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login,logoutWithOutTokenRemove, logout,setExpoTokenToSend,expoTokenToSend, accessTokenGetter,loadUser }}>
      {children}
    </AuthContext.Provider>
  );
}
