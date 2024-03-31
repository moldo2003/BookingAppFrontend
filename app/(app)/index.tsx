import BarbersView from "@/assets/HomeWidgets/barbersView";
import { CarouselWidget } from "@/assets/HomeWidgets/photoView";
import Colors from "@/constants/Colors";

import React from "react";
import { View,Text,StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "react-native/Libraries/NewAppScreen";

export default function Home(){
    return (
        <SafeAreaView style={style.container}>
            <Text style={style.titleText}>Arogant Studio</Text>
            <CarouselWidget />
            <BarbersView />
        </SafeAreaView>
    );
}
const style = StyleSheet.create({
    container:{
        height: "100%",
        backgroundColor: Colors.backgroundColor,
    },
    titleText:{
        color: Colors.textColor,
        fontSize: 25,
        fontWeight: "bold",
        alignSelf: "center",
    }
})