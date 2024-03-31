import { useAuth } from "@/context/auth";
import { Tabs } from "expo-router";

export default function Layout() {
  const { user } = useAuth();
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="(tabs)/appointments" />
    </Tabs>
  );
}
