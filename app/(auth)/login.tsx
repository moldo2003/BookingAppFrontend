import { useAuth } from "@/context/auth";
import React from "react";
import { View,Text, Button } from "react-native";
export default function Login() {
    const {signIn}  = useAuth();
    return (
        <View>
            <Text>Login</Text>
            <Button title="Sign In" color={"orange"} onPress={signIn}/>
        </View>
    );
    }