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
    "Poppins-Regular": require("../assets/fonts/PublicSans-VariableFont_wght.ttf"),
    "PlayFair":require("../assets/fonts/Aladin-Regular.ttf")
   
     
    
  });
}

function ProtectedLayout() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    console.log('user',user)
    if (!user) {
      router.replace("/");
    } else {
      router.replace("/(tabs)");
    }
  }, [user]);

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  const queryClient = new QueryClient();
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
  }, []);

  if (!fontsLoaded) {
    return <Text>Loading</Text> // Show a loading screen until fonts load
  }

  return (
    <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ProtectedLayout />
    </AuthProvider>
    </QueryClientProvider>
  );
}
