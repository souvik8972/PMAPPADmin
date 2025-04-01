import * as SecureStore from "expo-secure-store";

const AUTH_KEY = "auth_token";

export async function saveToken(token) {
  await SecureStore.setItemAsync(AUTH_KEY, token);
}

export async function getToken() {
  return await SecureStore.getItemAsync(AUTH_KEY);
}

export async function removeToken() {
  await SecureStore.deleteItemAsync(AUTH_KEY);
}
