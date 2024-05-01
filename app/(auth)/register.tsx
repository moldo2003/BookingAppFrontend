
import LogInFiled from "@/assets/AuthWidgets/logInFiled";
import RegisterFiled from "@/assets/AuthWidgets/registerField";
import Colors from "@/constants/Colors";
import { useAuth } from "@/context/auth";
import React from "react";
import { View,Text, Button } from "react-native";
import { StyleSheet } from "react-native";
import Toast from "react-native-toast-message";

export default function Register() {
    return (
        <View style={styles.container}>
            <RegisterFiled ></RegisterFiled>
            <Toast />
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