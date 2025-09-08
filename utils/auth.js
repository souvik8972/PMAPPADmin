import * as SecureStore from "expo-secure-store";
import { decode as atob } from "base-64";
import   {getNewTokenBYRefreshToken, savePushTokenToBackend} from '../services/api'

import { useNavigation } from '@react-navigation/native';
import {  useContext, useEffect, useState } from 'react';
import { useRouter } from "expo-router";
import { AuthContext } from "@/context/AuthContext";


const AUTH_KEY = "auth_info";
const REFRESH_KEY = "refresh_token";

export function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = atob(base64);
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Invalid JWT", e);
    return null;
  }
}

export async function saveAuthInfo(token, refToken) {
  const decoded = parseJwt(token);
  // console.log("Decoded JWT:", decoded);
  if (!decoded) return;
const tokenExpiration = checkTokenExpiration(decoded.exp);
  const authInfo = {
    token: token,
    email: decoded.sub,
    name:decoded?.Emp_Name.split(" ")[0],
    empId: decoded.EmpId,
    exp:decoded.exp,
    checkTokenExpiration: tokenExpiration,
    userType: decoded.UserType
  };
 await SecureStore.setItemAsync(REFRESH_KEY, refToken);

  await SecureStore.setItemAsync(AUTH_KEY, JSON.stringify(authInfo));
  // console.log("Auth info saved:", authInfo);
}



export async function getAuthInfo() {
  const result = await SecureStore.getItemAsync(AUTH_KEY);
  
  return result ? JSON.parse(result) : null;
}

export async function getRefreshToken() {
  const result = await SecureStore.getItemAsync(REFRESH_KEY);
  return result || null;
}

export async function removeAuthInfo() {

  //  await  savePushTokenToBackend(user.empId,"",user.token)
   await SecureStore.deleteItemAsync(AUTH_KEY);
  await SecureStore.deleteItemAsync(REFRESH_KEY);
 
}

export const checkTokenExpiration = (exp) => {
  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
 if(currentTime>=exp){ console.log("Token expiration check:", { exp, currentTime });}
  return exp < currentTime; // true if expired
};



export const useRedirectIfTokenExpired = (token) => {
  const router = useRouter();
  
  useEffect(() => {
          if (!token) return;

      const decoded = parseJwt(token);
      const exp = decoded?.exp;

      if (!exp || checkTokenExpiration(exp)) {
                    router.replace('/login');
          }
          }, [token]);
};
let refreshingTokenPromise = null;

export const useRefreshToken = (initialToken, endpoint) => {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState(initialToken);
  const { loadUser } = useContext(AuthContext);

  useEffect(() => {
    const handleToken = async () => {
      if (!accessToken) return;
      console.log("Checking token expiration for:", accessToken);

      const auth_info = await getAuthInfo();
      const exp = auth_info?.exp;
      const currentTime = Math.floor(Date.now() / 1000);
      const isExpired = currentTime >= exp;
console.log("Token expiration status:", { exp, currentTime, isExpired });
      if (!isExpired) return auth_info?.token;

      const refreshToken = await getRefreshToken();
      if (!refreshToken) {
        router.replace("/login");
        return null;
      }

      const res = await getNewTokenBYRefreshToken(refreshToken);
      if (res && res.accessToken) {
        console.log("Token refreshed successfully:", res.accessToken);
        await saveAuthInfo(res.accessToken, res.refreshToken);
        setAccessToken(res.accessToken);
        await loadUser();
        return res.accessToken;
      } else {
        router.replace("/login");
        return null;
      }
    };

    handleToken();
  }, [router, endpoint,  loadUser]);

  return accessToken;
};


