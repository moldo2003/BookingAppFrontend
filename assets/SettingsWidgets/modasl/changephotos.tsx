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
import DateTimePickerModal from "react-native-modal-datetime-picker";
import adminApiService from "@/services/adminApiService";
import { FIREBASE_AUTH } from "@/constants/firebaseConfig";
import { json } from "stream/consumers";
import { parseJSON } from "date-fns";
import { Time } from "@/Models/appointmentModel";
import { showFailToast, showSuccesToast } from "@/constants/toasts";
import Toast from "react-native-toast-message";

const { width, height } = Dimensions.get("window");

export function ChangePhotos({
  onClose,
}: {
  onClose: () => void;
}): JSX.Element {
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedStartTime, setSelectedStartTime] = useState(new Date());
  const [selectedEndTime, setSelectedEndTime] = useState(new Date());

  const fetchData = async () => {
    try {
      const res = await photoschange.getPhotos();
      setPhotos(res);
      const token = await FIREBASE_AUTH.currentUser?.getIdToken();
      const times = await adminApiService.getTimes(token as string);

      // Create new Date objects for the start and end times
      const startTime = new Date();
      const endTime = new Date();

      // Set the hours and minutes based on the times object
      startTime.setHours(
        times.data.startTime.hour,
        times.data.startTime.minute
      );
      endTime.setHours(times.data.endTime.hour, times.data.endTime.minute);

      // Update the state with the new start and end times
      setSelectedStartTime(startTime);
      setSelectedEndTime(endTime);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
            
            if(selectedStartTime >= selectedEndTime) {
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
              await adminApiService.setTimes(
                token as string,
                JSON.stringify(start),
                JSON.stringify(end)
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

      <DateTimePickerModal
        date={isStartTime ? selectedStartTime : selectedEndTime}
        isVisible={isPickerVisible}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={hidePicker}
      />

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
