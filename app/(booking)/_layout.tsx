import Colors from "@/constants/Colors";
import { Stack } from "expo-router";
import React from "react";

export default function Layout() {
  return (
    <Stack
      
      screenOptions={{
        animation: "slide_from_right",
        headerStyle: {      
          backgroundColor: Colors.backgroundColor,
        },
        headerTintColor: Colors.textColor,
        headerShadowVisible: false,
      
      }}
    >
            <Stack.Screen
        name="index"
        options={{ title: "Select a Barber" ,}}
      />
      <Stack.Screen
        name="(tabs)/serviceselect/[id]"
        options={{ title: "Select services" }}
        

      />
      <Stack.Screen
        name="(tabs)/timeselect/[data]"
        options={{ title: "Select date" }}
      />
      <Stack.Screen
        name="(tabs)/getfastestapp/[data]"
        options={{ title: "Accept appointment" }}
      />
    </Stack>
  );
}
