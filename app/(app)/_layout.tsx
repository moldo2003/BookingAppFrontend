import { useAuth } from "@/context/auth";
import { Tabs } from "expo-router";

export default function Layout(){
    const {user} = useAuth();
    console.log(user)
    return(
        <Tabs screenOptions={{headerShown: false}}>
            <Tabs.Screen  name="index"/>
            <Tabs.Screen name="(tabs)"/>
        </Tabs>
    )
}