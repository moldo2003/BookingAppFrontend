import BarbersView from "@/assets/HomeWidgets/barbersView";
import { CarouselWidget } from "@/assets/HomeWidgets/photoView";
import Colors from "@/constants/Colors";
import { router } from "expo-router";

import React from "react";
import { View, Text, StyleSheet, Pressable, Dimensions,Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { Header } from "react-native/Libraries/NewAppScreen";
const { width, height } = Dimensions.get("window");
export default function Home() {
  return (
    <SafeAreaView style={style.container}>
      <Image
        style={style.imageStyle}
        source={require("../../assets/images/logo.png")}
        resizeMethod="scale"
        resizeMode="contain"
      />
      <CarouselWidget />
      <BarbersView />
      <Pressable
        style={style.button}
        onPress={() => {
          router.push("/(booking)/");
        }}
      >
        <Text style={style.text}>Book Now</Text>
      </Pressable>
      <Toast />
    </SafeAreaView>
  );
}
const style = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: Colors.backgroundColor,
  },
  imageStyle: {
    width: width * 0.9,
    height: height * 0.08,
    alignSelf: "center",
    marginBottom: 10,
    padding: 0
  },
  titleText: {
    color: Colors.textColor,
    fontSize: 25,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 20,
  },
  button: {
    alignSelf: "center",
    bottom: 0,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    height: height * 0.06,
    width: width * 0.9,
    borderRadius: 10,
    margin: 10,
    backgroundColor: Colors.buttonColor,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});
