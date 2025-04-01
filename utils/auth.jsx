import * as SecureStore from "expo-secure-store";

const AUTH_KEY = "userToken";

export async function saveAuthToken(token) {
  await SecureStore.setItemAsync(AUTH_KEY, token);
}

export async function getAuthToken() {
  return await SecureStore.getItemAsync(AUTH_KEY);
}

export async function removeAuthToken() {
  await SecureStore.deleteItemAsync(AUTH_KEY);
}
