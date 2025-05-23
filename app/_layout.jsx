import { Stack } from "expo-router";
import "../global.css";
import { AuthProvider } from "../context/AuthContext";
import { SafeAreaView, Text } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { ActivityIndicator, View } from "react-native";

export default function RootLayout() {
  const queryClient = new QueryClient();

  const [fontsLoaded] = useFonts({
    PubLicSans: require("../assets/fonts/PublicSans-VariableFont_wght.ttf"),
     Aladin: require("../assets/fonts/Aladin-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SafeAreaView></SafeAreaView>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </QueryClientProvider>
  );
}
