import Colors from "@/constants/Colors";
import { FIREBASE_AUTH } from "@/constants/firebaseConfig";
import { showFailToast, showSuccesToast } from "@/constants/toasts";
import { Appointment } from "@/Models/appointmentModel";
import { Service } from "@/Models/barberModel";
import appointmentApiService from "@/services/appointmentApiService";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, Button, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import Toast from "react-native-toast-message";

export default function getfastestapp() {
  const { data } = useLocalSearchParams();
  const [app, setApp] = useState<Appointment>();
  const services = JSON.parse(data as string).services as Service[];
  const id = JSON.parse(data as string).id;
  // Calculate neededTime by summing the duration of all services
  const neededTime = services.reduce(
    (total, service) => total + service.serviceTime,
    0
  );

  // Transform services into a string array
  const serviceNames = services.map((service) => service.serviceName);

  useEffect(() => {
    const getFastestApp = async () => {
      try {
        const token = await FIREBASE_AUTH.currentUser?.getIdToken();

        if (token == undefined) return;
        const res = await appointmentApiService.getFastestAppointment(
          token,
          neededTime.toString(),
          FIREBASE_AUTH.currentUser?.uid as string,
          id,
          serviceNames
        );
        setApp(res);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    getFastestApp();
  }, []);

  const acceptAppointment = async () => {
    try {
      const token = await FIREBASE_AUTH.currentUser?.getIdToken();
      if (token == undefined) return;
      await appointmentApiService.acceptAppointment(token, app?._id as string);
      router.push("/(app)");
      showSuccesToast("Appointment accepted");
      
    } catch (error) {
      console.error("Error fetching images:", error);
      showFailToast("Error accepting appointment");
    }
  };

  const declineAppointment = async () => {
    try {
      const token = await FIREBASE_AUTH.currentUser?.getIdToken();
      if (token == undefined) return;
      await appointmentApiService.declineAppointment(token, app?._id as string);
      router.back();
      showSuccesToast("Appointment declined");
    } catch (error) {
      console.error("Error fetching images:", error);
      showFailToast("Error declining appointment");
    }
  };
  return (
    app && (
      <View style={styles.container}>
        <Text style={styles.text}>We found the fastest appointment on:</Text>
        <Text style={styles.text}>
          {format(
            new Date(app?.day.year, app?.day.month - 1, app?.day.day),
            "EEEE, d 'of' MMMM"
          )}
        </Text>
        <View style={styles.row}>
          <View>
            <Text style={styles.text}>From:</Text>
            <Text style={styles.text}>
              {app?.startDate.hour}:
              {app?.startDate.minute === 0 ? "00" : app?.startDate.minute}
            </Text>
            <TouchableOpacity
              style={styles.button2}
              onPress={() => {
                acceptAppointment();
              }}
            >
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
          </View>
          <Ionicons name="arrow-forward" size={24} color={Colors.textColor} />
          <View>
            <Text style={styles.text}>To:</Text>
            <Text style={styles.text}>
              {app?.endDate.hour}:
              {app?.endDate.minute === 0 ? "00" : app?.endDate.minute}
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                declineAppointment();
              }}
            >
              <Text style={styles.buttonText}>Decline</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Toast />
      </View>
    )
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "red",
    borderRadius: 10, // This will give the button rounded corners
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  button2: {
    backgroundColor: "green",
    borderRadius: 10, // This will give the button rounded corners
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontSize: 16,
  },
  row: {
    alignContent: "center",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 50,
    marginRight: 50,
    marginTop: 20,
  },
  container: {
    height: "100%",
    backgroundColor: Colors.backgroundColor,
  },
  text: {
    textAlign: "center",
    margin: 10,
    color: Colors.textColor,
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Jakarta",
  },
});
