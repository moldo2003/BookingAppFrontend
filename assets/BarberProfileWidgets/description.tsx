import Colors from "@/constants/Colors";
import { showFailToast } from "@/constants/toasts";
import { useAuth } from "@/context/auth";
import { Barber } from "@/Models/barberModel";
import { router } from "expo-router";
import { View, Text, Pressable, StyleSheet, Dimensions } from "react-native";
import Toast from "react-native-toast-message";
const { width, height } = Dimensions.get("window");
export default function BarberDescription({ barber }: { barber: Barber }) {
  const { userData } = useAuth();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{barber.username}</Text>
      <Text style={styles.secondTitiel}>{barber.smallDescription}</Text>
      <Pressable
        style={styles.button}
        onPress={() => {
          if (userData.isValidated == false) {
            showFailToast("The account is not validated yet");
          } else {
            router.push(
              `/(booking)/(tabs)/serviceselect/${barber.firebaseUid}`
            );
          }
        }}
      >
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
    color: Colors.textColor,
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
