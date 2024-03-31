import Colors from "@/constants/Colors";
import { Barber } from "@/Models/barberModel";
import { View, Text, Pressable, StyleSheet, Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
export default function BarberDescription({ barber }: { barber: Barber }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{barber.username}</Text>
      <Text style={styles.secondTitiel}>{barber.smallDescription}</Text>
      <Pressable style={styles.button}>
        <Text style={styles.text}>Book Now</Text>
      </Pressable>
      <Text style={styles.title}>About</Text>
      <Text style={styles.description}>{barber.bigDescription}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    height: height * 0.05,
    borderRadius: 10,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: Colors.thirdColor,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textColor,
    fontFamily: "Jakarta",
  },
  secondTitiel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.thirdColor,
    fontFamily: "Jakarta",
  },
  description: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textColor,
    fontFamily: "Jakarta",
  },
  text: {
    fontSize: 12,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: "white",
    fontFamily: "Jakarta",
  },
});
