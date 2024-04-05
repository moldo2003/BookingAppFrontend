import { AuthProvider } from "@/context/auth";
import { useFonts } from "expo-font";
import { Slot, SplashScreen, Stack } from "expo-router";
import React, { useCallback } from "react";
import Toast from "react-native-toast-message";

export default function Layout() {
  const [fontsLoaded, fontError] = useFonts({
    Jakarta: require("../assets/fonts/Plus_Jakarta_Sans/Jakarta.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_bottom",
          animationDuration: 30,
        }}
      > 
        <Stack.Screen name="(app)" options={{ animation: "ios" }} />
      </Stack> 
    </AuthProvider>
  
  );
}
