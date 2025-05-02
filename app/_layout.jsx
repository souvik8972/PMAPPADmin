import { Stack } from "expo-router";
import "../global.css";
import { AuthProvider } from "../context/AuthContext";
import { Text } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";

export default function RootLayout() {
  const queryClient = new QueryClient();

  const [fontsLoaded] = useFonts({
    PubLicSans: require("../assets/fonts/PublicSans-VariableFont_wght.ttf"),
    PlayFair: require("../assets/fonts/Aladin-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return <Text>Loading Fonts...</Text>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </QueryClientProvider>
  );
}
