
import { AuthProvider } from "@/context/auth";
import { useFonts } from "expo-font";
import { Slot, SplashScreen, Stack } from "expo-router";
import React, { useCallback } from "react";

export default function Layout(){

    const [fontsLoaded, fontError] = useFonts({
        'Jakarta': require('../assets/fonts/Plus_Jakarta_Sans/Jakarta.ttf'),
      });
    
      const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded || fontError) {
          await SplashScreen.hideAsync();
        }
      }, [fontsLoaded, fontError]);
    
      if (!fontsLoaded && !fontError) {
        return null;
      }
    

    return(
        <AuthProvider>
             <Slot />
        </AuthProvider>
    )
}