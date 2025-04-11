import * as SecureStore from "expo-secure-store";
import { decode as atob } from "base-64";

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
  if (!decoded) return;

  const authInfo = {
    token: token,
    email: decoded.sub,
    empId: decoded.EmpId,
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
