import { Stack } from "expo-router";
import "../global.css";
import { AuthProvider } from "../context/AuthContext";
import { SafeAreaView, Text } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ActivityIndicator, View } from "react-native";

export default function RootLayout() {
  const queryClient = new QueryClient();

  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
     
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </QueryClientProvider>
  );
}
