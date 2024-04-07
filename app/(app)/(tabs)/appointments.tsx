import { FIREBASE_AUTH } from "@/constants/firebaseConfig";
import { View, Text, Button, FlatList } from "react-native";
import Toast from "react-native-toast-message";
import { StyleSheet } from "react-native";
import Colors from "@/constants/Colors";
import { useEffect, useState } from "react";
import userApiService from "@/services/userApiService";
import appointmentApiService from "@/services/appointmentApiService";
import { Appointment } from "@/Models/appointmentModel";
import { format, isPast, isToday } from "date-fns";
import { useAuth } from "@/context/auth";
import { User } from "@/Models/userModel";
import ClientHistory from "@/assets/AppHistoryWidgets/clientHistory";
import BarberHistory from "@/assets/AppHistoryWidgets/barberHistory";

export default function AppointmentsHistory() {
   const {userData} = useAuth();
 
  return (
     userData != undefined ? (userData as User).isBarber ? <BarberHistory /> : <ClientHistory />
     : <Text>Loading...</Text>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: Colors.backgroundColor,
  },
  titletext: {
    color: Colors.textColor,
    fontWeight: "bold",
    fontSize: 24,
    textAlign: "center",
    marginTop: "10%",
    marginBottom: "5%",
  },
  apptext: {
    color: Colors.textColor,
    fontWeight: "500",
    fontSize: 18,
    textAlign: "left",
    marginTop: 20,
    marginRight: 10,
  },
  status: {
    fontSize: 16,
    fontWeight: "bold",
    color: "green",
    textAlign: 'right',
    marginTop: 10,
  },
});
