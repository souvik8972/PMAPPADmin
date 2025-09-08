import React, { createContext, useEffect, useState } from "react";
import { getAuthInfo, saveAuthInfo, removeAuthInfo,checkTokenExpiration, getRefreshToken } from "../utils/auth"; // Updated to reflect changes
import { getNewTokenBYRefreshToken, savePushTokenToBackend } from "@/services/api";

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
      const auth_info = await getAuthInfo();
      if(auth_info?.token){
      await savePushTokenToBackend(auth_info?.empId, "", auth_info?.token);

      }
      await removeAuthInfo();
  //  console.log(user,"User")
      
    //  console.log("Logout button pressed 1");
    } catch (error) {
      // console.error("Failed to remove token:", error);
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
    console.log("Token expired, refreshing... from context outside");

   if (checkTokenExpiration(auth_info?.exp)){
    console.log("Token expired, refreshing... from context");
    const refToken= await getRefreshToken();
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
