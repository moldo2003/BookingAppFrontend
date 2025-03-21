import { FIREBASE_AUTH } from "@/constants/firebaseConfig";
import { Appointment } from "@/Models/appointmentModel";
import appointmentApiService from "@/services/appointmentApiService";
import { isPast, isToday, format } from "date-fns";
import { useState, useEffect } from "react";
import { View, FlatList, Alert } from "react-native";
import Toast from "react-native-toast-message";
import { StyleSheet, Text } from "react-native";
import Colors from "@/constants/Colors";
import { Icon } from "react-native-elements";
import { showFailToast, showSuccesToast } from "@/constants/toasts";

export default function ClientHistory() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = await FIREBASE_AUTH.currentUser?.getIdToken();
        if (token == undefined) return;
        const res = await appointmentApiService.getClientAppointments(
          token,
          FIREBASE_AUTH.currentUser?.uid as string
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
  }, []);

  function ispast(app: Appointment) {
    const date = new Date(app.day.year, app.day.month - 1, app.day.day);
    date.setHours(app.startDate.hour, app.startDate.minute);

    return date.getTime() < new Date().getTime();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titletext}>Appointment History</Text>
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
                  marginTop: 20,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={styles.apptext}>
                  {format(
                    new Date(item.day.year, item.day.month - 1, item.day.day),
                    "d 'of' MMMM"
                  ) +
                    " From " +
                    item.startDate.hour +
                    ":" +
                    String(item.startDate.minute).padStart(2, "0") +
                    " to " +
                    item.endDate.hour +
                    ":" +
                    String(item.endDate.minute).padStart(2, "0")}
                </Text>
                {!ispast(item) && (
                  <Icon
                    name="trash"
                    type="font-awesome"
                    color="red"
                    onPress={() =>
                      Alert.alert(
                        "Delete Appointment",
                        "Are you sure you want to delete this appointment?",
                        [
                          {
                            text: "Cancel",
                            style: "cancel",
                          },
                          {
                            text: "Yes",
                            onPress: async () => {
                              const token =
                                await FIREBASE_AUTH.currentUser?.getIdToken();
                              if (item != undefined && token != undefined) {
                                let res =
                                  await appointmentApiService.deleteAppointment(
                                    token as string,
                                    item._id as string
                                  );
                                if (res.status == 200) {
                                  let newApp = appointments.filter(
                                    (app) => app._id != item._id
                                  );

                                  setAppointments(newApp);
                                  showSuccesToast("Appointment deleted");
                                } else {
                                  showFailToast(res.data);
                                }
                              }
                            },
                          },
                        ]
                      )
                    }
                  />
                )}
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
    marginRight: 10,
  },
  status: {
    fontSize: 16,
    fontWeight: "bold",
    color: "green",
    textAlign: "right",
    marginTop: 10,
  },
});
