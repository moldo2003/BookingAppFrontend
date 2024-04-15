import { Time } from "@/Models/appointmentModel";
import Colors from "@/constants/Colors";
import { FIREBASE_AUTH } from "@/constants/firebaseConfig";
import { showFailToast, showSuccesToast } from "@/constants/toasts";
import barberApiService from "@/services/barberApiService";
import { useState } from "react";
import { View, Text, Dimensions, Pressable } from "react-native";
import { StyleSheet } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const { width, height } = Dimensions.get("window");

export default function TimeBlock() {
  const [selectedStartTime, setSelectedStartTime] = useState(new Date());
  const [selectedEndTime, setSelectedEndTime] = useState(new Date());
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [isStartTime, setIsStartTime] = useState(true);

  const showPicker = () => {
    setPickerVisible(true);
  };

  const hidePicker = () => {
    setPickerVisible(false);
  };

  const handleConfirm = (datetime: Date) => {
    if (isStartTime) setSelectedStartTime(datetime);
    else setSelectedEndTime(datetime);
    hidePicker();
  };

  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleDateConfirm = (date: Date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  return (
    <View>
      <Text style={styles.title}>Time Block</Text>

      <Pressable onPress={showDatePicker}>
        <Text style={styles.timetext}>
          Select Date: {selectedDate.toLocaleDateString()}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => {
          setIsStartTime(true);
          showPicker();
        }}
      >
        <Text style={styles.timetext}>
          Select Start Time:{" "}
          {new Intl.DateTimeFormat("default", {
            hour: "2-digit",
            minute: "2-digit",
          }).format(selectedStartTime)}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => {
          setIsStartTime(false);
          showPicker();
        }}
      >
        <Text style={styles.timetext}>
          Select End Time:{" "}
          {new Intl.DateTimeFormat("default", {
            hour: "2-digit",
            minute: "2-digit",
          }).format(selectedEndTime)}
        </Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={async () => {
          if (selectedStartTime >= selectedEndTime) {
            showFailToast("Start time should be less than end time");
            return;
          }
          try {
            const token = await FIREBASE_AUTH.currentUser?.getIdToken();
            const start = new Time(selectedStartTime.getHours(), selectedStartTime.getMinutes());
            const end = new Time(selectedEndTime.getHours(), selectedEndTime.getMinutes());
            await barberApiService.blockTime(
              token as string,
              selectedDate,
             start,
             end
            );
            showSuccesToast("Time blocked successfully");
          } catch (e) {
            showFailToast("Failed to update time");
          }
        }}
      >
        <Text style={styles.textbutton}>Block this time</Text>
      </Pressable>

      <DateTimePickerModal
        date={isStartTime ? selectedStartTime : selectedEndTime}
        isVisible={isPickerVisible}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={hidePicker}
      />

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundColor2,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    color: "white",
    textAlign: "center",
    fontFamily: "Jakarta",
  },
  button: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    height: height * 0.06,
    width: "100%",
    borderRadius: 10,
    backgroundColor: Colors.buttonColor,
  },
  timetext: {
    paddingTop: 10,
    paddingLeft: 10,
    fontSize: 18,
    color: "white",
    fontFamily: "Jakarta",
    textAlign: "left", // Add this line
  },
  textbutton: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});
