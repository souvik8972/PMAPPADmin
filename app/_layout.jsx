import { Stack } from "expo-router";
import "../global.css";
import { AuthProvider } from "../context/AuthContext";
import { SafeAreaView, Text } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ActivityIndicator, View } from "react-native";
import ToastManager from "toastify-react-native";

export default function RootLayout() {
  const queryClient = new QueryClient();

  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
    <ToastManager
  // useModal={true}
  position="bottom"
  animationIn="slideInDown"
  animationOut="slideOutUp"
  width={"90%"}
  height={100}
  duration={600}
  textStyle={{ fontSize: 16 }}
  touchable={true}
  showCloseIcon={false}   // 👈 hides the close (X) button
/>

        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </QueryClientProvider>
  );
}
