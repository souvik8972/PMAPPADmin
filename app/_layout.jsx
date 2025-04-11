import { Stack, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import * as Font from "expo-font";
 // If using an older version of Expo
import "../global.css";
import { AuthContext, AuthProvider } from "../context/AuthContext";
import { Text } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

async function loadFonts() {
  await Font.loadAsync({
    "PubLicSans": require("../assets/fonts/PublicSans-VariableFont_wght.ttf"),
    "PlayFair":require("../assets/fonts/Aladin-Regular.ttf")
   
     
    
  });
}



export default function RootLayout() {
  const queryClient = new QueryClient();
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
  }, []);

  

  return (
    <QueryClientProvider client={queryClient}>
    <AuthProvider>
    <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
    </QueryClientProvider>
  );
}
