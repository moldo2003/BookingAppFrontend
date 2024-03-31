
import LogInFiled from "@/assets/AuthWidgets/logInFiled";
import ResetFiled from "@/assets/AuthWidgets/resetFiled";
import Colors from "@/constants/Colors";
import { useAuth } from "@/context/auth";
import React from "react";
import { View,Text, Button } from "react-native";
import { StyleSheet } from "react-native";

export default function Reset() {
    return (
        <View style={styles.container}>
            <ResetFiled/>
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