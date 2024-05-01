import Colors from "@/constants/Colors";
import { useAuth } from "@/context/auth";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import Toast from "react-native-toast-message";

export default function Layout() {
  const { user } = useAuth();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.backgroundColor2,
          borderColor: Colors.backgroundColor2,
          borderTopWidth: 0,
        },
        tabBarInactiveTintColor: "white",
        tabBarActiveTintColor: Colors.buttonColor,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(tabs)/appointments"
        options={{
          title: "Appointments",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(tabs)/settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
