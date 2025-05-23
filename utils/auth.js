import * as SecureStore from "expo-secure-store";
import { decode as atob } from "base-64";

import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';

const AUTH_KEY = "auth_info";

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

export async function saveAuthInfo(token) {
  const decoded = parseJwt(token);
  console.log("Decoded JWT:", decoded);
  if (!decoded) return;
const tokenExpiration = checkTokenExpiration(decoded.exp);
  const authInfo = {
    token: token,
    email: decoded.sub,
    name:decoded?.sub?.split(".")[0],
    empId: decoded.EmpId,
    exp:decoded.exp,
    checkTokenExpiration: tokenExpiration,
    userType: decoded.UserType
  };

  await SecureStore.setItemAsync(AUTH_KEY, JSON.stringify(authInfo));
}

export async function getAuthInfo() {
  const result = await SecureStore.getItemAsync(AUTH_KEY);
  return result ? JSON.parse(result) : null;
}

export async function removeAuthInfo() {
  await SecureStore.deleteItemAsync(AUTH_KEY);
}

export const checkTokenExpiration = (exp) => {
  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  return exp < currentTime; // true if expired
};



export const useRedirectIfTokenExpired = (token) => {
  const navigation = useNavigation();

  useEffect(() => {
    if (!token) return;

    const decoded = parseJwt(token);
    const exp = decoded?.exp;

    if (!exp || checkTokenExpiration(exp)) {
      navigation.replace('Login');
    }
  }, [token]);
};
