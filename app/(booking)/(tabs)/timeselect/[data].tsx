import { Service } from "@/Models/barberModel";
import { router, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import DateDisplay from "@/assets/TimeSelectWidgets/dateDisplay";
import { StyleSheet } from "react-native";
import Colors from "@/constants/Colors";
import { useEffect, useState } from "react";
import { FIREBASE_AUTH } from "@/constants/firebaseConfig";
import appointmentApiService from "@/services/appointmentApiService";
import { GetGapResponse } from "@/Models/getGapResponse";
import { Time, WorkDay } from "@/Models/appointmentModel";
import { GetGapRequest } from "@/Models/getGapRequest";
import TimeDisplay from "@/assets/TimeSelectWidgets/timeDisplay";
import { text } from "stream/consumers";
import { showFailToast, showSuccesToast } from "@/constants/toasts";
import Toast from "react-native-toast-message";
import { set } from "date-fns";
const { width, height } = Dimensions.get("window");
export default function TimeSelect() {
  const { data } = useLocalSearchParams();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<Time | null>(null);
  const [selectedEndTime, setSelectedEndTime] = useState<Time | null>(null);
  const [dateAvailable, setDateAvailable] = useState<boolean[]>([]);
  const [gapsAvailable, setGapsAvailable] = useState<GetGapResponse[]>([]);
  const [isBooking, setIsBooking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const dates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });
  const services = JSON.parse(data as string).services as Service[];
  const neededTime = services.reduce(
    (total, service) => total + service.serviceTime,
    0
  );
  useEffect(() => {
    const fetchDateAvailability = async () => {
      try {
        const token = await FIREBASE_AUTH.currentUser?.getIdToken();
        //const neededTime =  JSON.parse(data as string).services;
        if (token == undefined) return;
        const res = await appointmentApiService.getAvailableDays(
          token,
          JSON.parse(data as string).id,
          neededTime
        );

        setDateAvailable(res); // Assuming you want to set the first boolean value in the array
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    fetchDateAvailability();
  }, []);

  useEffect(() => {
    const fetchGapsAvailability = async () => {
      if (selectedDate.getDay() == 0) {
        setGapsAvailable([]);
        return;
      }
      try {
        const token = await FIREBASE_AUTH.currentUser?.getIdToken();
        if (token == undefined) return;
        const res = await appointmentApiService.getAvailableGaps(
          token,
          new GetGapRequest(
            new WorkDay(
              selectedDate.getDate(),
              selectedDate.getMonth() + 1,
              selectedDate.getFullYear()
            ),
            JSON.parse(data as string).id,
            neededTime
          )
        );
        setGapsAvailable(res); // Assuming you want to set the first boolean value in the array
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    fetchGapsAvailability();
  }, [selectedDate]);

  async function bookAppointment() {
    if (selectedTime == null) {
      showFailToast("Select a time to book an appointment");
      return;
    }

    try {
      const token = await FIREBASE_AUTH.currentUser?.getIdToken();
      if (token == undefined) return;
      const servicesArray = JSON.parse(data as string).services as Service[];
      let serviceName = [];
      for (let i = 0; i < servicesArray.length; i++) {
        serviceName.push(servicesArray[i].serviceName);
      }
      const res = await appointmentApiService.createAppointment(token, {
        startDate: JSON.stringify(selectedTime),
        endDate: JSON.stringify(selectedEndTime),
        day: JSON.stringify(
          new WorkDay(
            selectedDate.getDate(),
            selectedDate.getMonth() + 1,
            selectedDate.getFullYear()
          )
        ),
        clientId: FIREBASE_AUTH.currentUser?.uid as string,
        barberId: JSON.parse(data as string).id,
        services: serviceName,
      });
      router.push("/(app)");
      showSuccesToast("Appointment booked");
      return;
    } catch (error) {
      console.error("Error booking appointment", error);
      showFailToast("Error booking appointment, try another time");
      return;
    }
  }
  return isLoading ? (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.backgroundColor,
      }}
    >
      <ActivityIndicator size="large" color="white" />
    </View>
  ) : (
    <View style={styles.container}>
      <Text style={styles.text}>Select an Date</Text>
      <FlatList
        style={{
          height: height * 0.2,
          flexGrow: 0,
        }}
        data={dates}
        renderItem={({ item, index }) => (
          <Pressable
            style={{height: "100%"}}
            onPress={() => {
              setSelectedDate(item);
            }}
          >
            <DateDisplay
              date={item}
              isAvailable={dateAvailable[index]}
              isSelected={selectedDate.getUTCDate() == item.getUTCDate()}
            />
          </Pressable>
        )}
        keyExtractor={(item) => item.toISOString()}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
      <Text style={styles.text}>Select a Time</Text>
      {gapsAvailable.length != 0 ? null : (
        <Text style={styles.text}>No available times</Text>
      )}
        <FlatList
          data={gapsAvailable}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                setSelectedTime(item.startDate);
                setSelectedEndTime(item.endDate);
              }}
            >
              <TimeDisplay
                start={item.startDate}
                end={item.endDate}
                isSelected={item.startDate === selectedTime}
              />
            </Pressable>
          )}
        />

      <Pressable
        style={styles.button}
        onPress={async () => {
          if (!isBooking) {
            setIsBooking(true);
            await bookAppointment();
            setIsBooking(false);
          }
        }}
        disabled={isBooking}
      >
        <Text style={styles.buttontext}>Book now</Text>
      </Pressable>
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundColor,
    height: "100%",
  },
  text: {
    margin: 10,
    color: "white",
    fontFamily: "Jakarta",
    fontSize: 20,
  },
  text2: {
    margin: 10,
    color: "white",
    fontFamily: "Jakarta",
    fontSize: 20,
    height: "100%",
  },

  button: {
    position: "absolute",
    width: width * 0.9,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    height: height * 0.06,
    borderRadius: 10,
    margin: 10,
    backgroundColor: Colors.buttonColor,
  },
  buttontext: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});
