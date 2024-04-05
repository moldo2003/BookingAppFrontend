import { FIREBASE_AUTH } from "@/constants/firebaseConfig";
import { Appointment, WorkDay } from "@/Models/appointmentModel";
import appointmentApiService from "@/services/appointmentApiService";
import { isPast, isToday, format } from "date-fns";
import { useState, useEffect } from "react";
import { View, FlatList, TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";
import { StyleSheet, Text } from "react-native";
import Colors from "@/constants/Colors";
import { useAuth } from "@/context/auth";
import { json } from "stream/consumers";
import { MaterialIcons } from "@expo/vector-icons";
import userApiService from "@/services/userApiService";

export default function BarberHistory() {
  const [date, setDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [userdictionary, setUserDictionary] = useState<{
    [key: string]: string;
  }>({});
  const { user } = useAuth();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = await FIREBASE_AUTH.currentUser?.getIdToken();
        if (token == undefined) return;
        const res = await appointmentApiService.getBarberAppointments(
          token,
          FIREBASE_AUTH.currentUser?.uid as string,
          JSON.stringify(
            new WorkDay(date.getDate(), date.getMonth() + 1, date.getFullYear())
          )
        );
        res.sort((a: Appointment, b: Appointment) => {
          const dateA = new Date(
            a.day.year,
            a.day.month - 1,
            a.day.day,
            a.startDate.hour,
            a.startDate.minute
          );
          const dateB = new Date(
            b.day.year,
            b.day.month - 1,
            b.day.day,
            b.startDate.hour,
            b.startDate.minute
          );
          return dateB.getTime() - dateA.getTime();
        });
        setAppointments(res);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchAppointments();
  }, [date]);

  useEffect(() => {
    const fetchNames = async () => {
      const token = await FIREBASE_AUTH.currentUser?.getIdToken();
      const promises = appointments.map(async (appointment) => {
        try {
          const name = await userApiService.getUserName(
            token as string,
            appointment.clientId.toString()
          );
          return [appointment.clientId.toString(), name] as [string, string];
        } catch (error) {
          return [appointment.clientId.toString(), ""] as [string, string];
        }
      });
      const resolvedPromises = await Promise.all(promises);
      const updatedUserDictionary = Object.fromEntries(resolvedPromises);
      setUserDictionary({ ...userdictionary, ...updatedUserDictionary });
    };
    if (appointments.length > 0) {
      fetchNames();
    }
  }, [appointments]);

  function vectorToString<String>(vector: string[]) {
    let result = "";
    for (let i = 0; i < vector.length; i++) {
      result += vector[i];
      if (i != vector.length - 1) {
        result += ", ";
      }
    }
    return result;
  }
  return (
    <View style={styles.container}>
      <Text style={styles.titletext}>Appointment History</Text>
      <View style={styles.dateContainer}>
        <TouchableOpacity
          onPress={() => {
            setDate(new Date(date.getTime() - 24 * 60 * 60 * 1000));
          }}
        >
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <Text style={styles.apptext}>{format(date, "d 'of' MMMM")}</Text>

        <TouchableOpacity
          onPress={() =>
            setDate(new Date(date.getTime() + 24 * 60 * 60 * 1000))
          }
        >
          <MaterialIcons name="arrow-forward" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {appointments.length > 0 && (
        <FlatList
          data={appointments}
          renderItem={({ item }) => {
            const appointmentDate = new Date(
              item.day.year,
              item.day.month - 1,
              item.day.day
            );
            let status = "Upcoming";
            if (isPast(appointmentDate)) {
              status = "Past";
            } else if (isToday(appointmentDate)) {
              status = "Today";
            }

            return (
              <View
                style={{
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={styles.apptext}>
                  {userdictionary[item.clientId] +
                    " From " +
                    item.startDate.hour +
                    ":" +
                    String(item.startDate.minute).padStart(2, "0") +
                    " to " +
                    item.endDate.hour +
                    ":" +
                    String(item.endDate.minute).padStart(2, "0")}
                </Text>
                <Text style={styles.servicestext}>
                  {vectorToString(item.services)}
                </Text>
              </View>
            );
          }}
        />
      )}
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  dateContainer: {
    marginHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  container: {
    height: "100%",
    backgroundColor: Colors.backgroundColor,
    textAlign: "center",
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
    fontSize: 20,
    textAlign: "left",
    marginTop: 20,
    marginRight: 10,
  },
  servicestext: {
    color: Colors.textColor,
    fontWeight: "500",
    fontSize: 16,
    textAlign: "left",
  },
  status: {
    fontSize: 16,
    fontWeight: "bold",
    color: "green",
    textAlign: "right",
    marginTop: 10,
  },
});
