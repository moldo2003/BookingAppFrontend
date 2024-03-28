
import { AuthProvider } from "@/context/auth";
import { Slot, Stack } from "expo-router";
import React from "react";

export default function Layout(){

    return(
        <AuthProvider>
             <Slot />
        </AuthProvider>
    )
}