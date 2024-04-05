import { View, Text, Dimensions, Pressable } from "react-native";
import { StyleSheet } from "react-native";
import { format } from "date-fns";
import Colors from "@/constants/Colors";
import { useState } from "react";

const { width, height } = Dimensions.get("window");
export default function DateDisplay({
  date,
  isAvailable,
  isSelected,
}: {
  date: Date;
  isAvailable: boolean;
  isSelected: boolean;
}) {
  return (
    <View
      style={
        isSelected
          ? styles.containerselected
          : isAvailable
          ? styles.containeravailable
          : styles.containerunavailable
      }
    >
      <Text style={styles.titleText}>{date.getDate()}</Text>
      <Text style={styles.titleText}>{format(date, "MMMM")}</Text>
      <Text style={styles.titleText}>|</Text>
      <Text style={styles.buttonText}>{format(date, "E")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  containerselected: {
    backgroundColor: Colors.thirdColor,
    textAlign: "center",
    margin: 10,
    padding: 10,
    borderRadius: 10,
  },
  containeravailable: {
    backgroundColor: "green",
    textAlign: "center",
    margin: 10,
    padding: 10,
    borderRadius: 10,
  },
  containerunavailable: {
    backgroundColor: "red",
    textAlign: "center",
    margin: 10,
    padding: 10,
    borderRadius: 10,
  },
  titleText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Jakarta",
    color: "white",
    // Add your titleText styles here
  },
  buttonText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Jakarta",
    color: "white",
    // Add your buttonText styles here
  },
});
