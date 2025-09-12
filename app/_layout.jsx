import { Stack } from "expo-router";
import "../global.css";
import { AuthProvider } from "../context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ToastManager from "toastify-react-native";

export default function RootLayout() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastManager
          useModal={false}  
          position="bottom"
          animationIn="slideInDown"
          animationOut="slideOutUp"
          width={"90%"}
          height={100}
          duration={3000}
          textStyle={{ fontSize: 16 }}
          style={{ zIndex: 100 }}
          showCloseIcon={true}
        />

        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </QueryClientProvider>
  );
}
