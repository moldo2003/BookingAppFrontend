
import LogInFiled from "@/assets/AuthWidgets/logInFiled";
import Colors from "@/constants/Colors";
import { useAuth } from "@/context/auth";
import React from "react";
import { View,Text, Button } from "react-native";
import { StyleSheet } from "react-native";
import Toast from "react-native-toast-message";

export default function Login() {
    const {signIn}  = useAuth();
    return (
        <View style={styles.container}>
            <Toast />
            <LogInFiled></LogInFiled>
        </View>
    );
    }
const styles = StyleSheet.create({
    container:{
        backgroundColor: Colors.backgroundColor,
        flex: 1,
        justifyContent: 'flex-start',
        alignContent: "center"
    },
    titleText:{
        fontFamily: "",
        color: Colors.textColor,
        fontWeight: "bold",
        alignSelf: "center"
    
    }
})