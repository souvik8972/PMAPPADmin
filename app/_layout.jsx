import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import * as Font from "expo-font";
import "../global.css";
import { AuthProvider } from "../context/AuthContext";
import { Text } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { checkTokenExpiration } from "@/utils/auth";

async function loadFonts() {
  await Font.loadAsync({
    "PubLicSans": require("../assets/fonts/PublicSans-VariableFont_wght.ttf"),
    "PlayFair": require("../assets/fonts/Aladin-Regular.ttf"),
  });
}

export default function RootLayout() {


  
  const queryClient = new QueryClient();
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
  }, []);

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
