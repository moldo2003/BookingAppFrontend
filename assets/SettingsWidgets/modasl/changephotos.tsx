import {
  View,
  Text,
  Pressable,
  Dimensions,
  Image,
  FlatList,
  Alert,
  ScrollView,
} from "react-native";
import { Button } from "react-native-elements";
import photoschange from "../functions/photoschange";
import { StyleSheet } from "react-native";
import Colors from "@/constants/Colors";
import { useEffect, useState } from "react";
import { baseURL } from "@/services/userApiService";
import adminApiService from "@/services/adminApiService";
import { FIREBASE_AUTH } from "@/constants/firebaseConfig";
import { json } from "stream/consumers";
import { parseJSON, set } from "date-fns";
import { Time } from "@/Models/appointmentModel";
import { showFailToast, showSuccesToast } from "@/constants/toasts";
import Toast from "react-native-toast-message";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";

const { width, height } = Dimensions.get("window");

export function ChangePhotos({
  onClose,
}: {
  onClose: () => void;
}): JSX.Element {
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedStartTime, setSelectedStartTime] = useState(new Date());
  const [selectedEndTime, setSelectedEndTime] = useState(new Date());
  const [selectedSaturdayTime, setSelectedSaturdayTime] = useState(new Date());

  const fetchData = async () => {
    try {
      const res = await photoschange.getPhotos();
      setPhotos(res);
      const token = await FIREBASE_AUTH.currentUser?.getIdToken();
      const times = await adminApiService.getTimes(token as string);
      // Create new Date objects for the start and end times
      const startTime = new Date();
      const endTime = new Date();
      const saturdayEnd = new Date();

      // Set the hours and minutes based on the times object
      startTime.setHours(
        times.data.startTime.hour,
        times.data.startTime.minute
      );
      endTime.setHours(times.data.endTime.hour, times.data.endTime.minute);
      saturdayEnd.setHours(
        times.data.saturdayEndTime.hour,
        times.data.saturdayEndTime.minute
      );

      // Update the state with the new start and end times
      setSelectedStartTime(startTime);
      setSelectedEndTime(endTime);
      setSelectedSaturdayTime(saturdayEnd);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
      return () => {};
    }, [])
  );

  const [isPickerVisible, setPickerVisible] = useState(false);
  const [isStartTime, setIsStartTime] = useState(false);
  const [isSaturdayTime, setIsSaturdayTime] = useState(false);

  const showPicker = () => {
    setPickerVisible(true);
  };

  const hidePicker = () => {
    setPickerVisible(false);
  };

  const handleConfirm = (datetime: Date) => {
    if (isStartTime) {
      setSelectedStartTime(datetime);
    } else if (isSaturdayTime) {
      setSelectedSaturdayTime(datetime);
    } else {
      setSelectedEndTime(datetime);
    }
    hidePicker();
  };

  const getPickerValue = () => {
    if (isStartTime) {
      return selectedStartTime;
    } else if (isSaturdayTime) {
      return selectedSaturdayTime;
    } else {
      return selectedEndTime;
    }
  };

  const renderItem = ({ item, index }: { item: string; index: number }) => {
    let imgUrl = baseURL + "/images/Salon/" + item;
    return (
      <View>
        <Pressable
          onLongPress={() => {
            Alert.alert(
              "Delete photo",
              "Are you sure you want to delete this photo?",
              [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
                {
                  text: "Delete",
                  onPress: async () => {
                    await photoschange.removePhoto(item);
                    const res = await photoschange.getPhotos();
                    fetchData();
                  },
                },
              ]
            );
          }}
        >
          <Image
            style={{
              width: width / 2 - 30,
              height: width / 2 - 30,
              margin: 10,
              borderRadius: 10,
            }}
            source={{ uri: imgUrl }}
          />
        </Pressable>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Set working hours</Text>
      <View style={{ flex: 1, alignSelf: "stretch", paddingTop: 10 }}>
        <Pressable
          onPress={() => {
            setIsSaturdayTime(false);
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
            setIsSaturdayTime(false);
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
          onPress={() => {
            setIsStartTime(false);
            setIsSaturdayTime(true);
            showPicker();
          }}
        >
          <Text style={styles.timetext}>
            Select Saturday End Time:{" "}
            {new Intl.DateTimeFormat("default", {
              hour: "2-digit",
              minute: "2-digit",
            }).format(selectedSaturdayTime)}
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
              const start = new Time(
                selectedStartTime.getHours(),
                selectedStartTime.getMinutes()
              );
              const end = new Time(
                selectedEndTime.getHours(),
                selectedEndTime.getMinutes()
              );
              const s = new Time(
                selectedSaturdayTime.getHours(),
                selectedSaturdayTime.getMinutes()
              );
              await adminApiService.setTimes(
                token as string,
                JSON.stringify(start),
                JSON.stringify(end),
                JSON.stringify(s)
              );
              showSuccesToast("Times updated successfully");
            } catch (error) {
              console.error("Error setting times:", error);
              showFailToast("Error setting times");
            }
          }}
        >
          <Text style={styles.textbutton}>Update Time</Text>
        </Pressable>
      </View>

      {isPickerVisible && (
        <DateTimePicker
          mode="time"
          display="spinner"
          value={getPickerValue()}
          onChange={(event, date) => handleConfirm(date as Date)}
        />
      )}

      <Text style={styles.title}>Change Photos</Text>
      {photos.length !== 0 ? (
        <FlatList
          data={photos}
          renderItem={renderItem}
          numColumns={2}
          scrollEnabled={false}
        />
      ) : (
        <Text>No photos to display</Text>
      )}

      <Pressable
        style={styles.button}
        onPress={async () => {
          await photoschange.addPhoto();
          fetchData();
        }}
      >
        <Text style={styles.textbutton}>Upload photo</Text>
      </Pressable>
    </ScrollView>
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

/*<DateTimePickerModal
date={isStartTime ? selectedStartTime : selectedEndTime}
isVisible={isPickerVisible}
mode="time"
onConfirm={handleConfirm}
onCancel={hidePicker}
/>*/
