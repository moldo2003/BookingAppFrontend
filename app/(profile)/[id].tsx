import BarberDescription from "@/assets/BarberProfileWidgets/description";
import BarberGallery from "@/assets/BarberProfileWidgets/gallery";
import Colors from "@/constants/Colors";
import { FIREBASE_AUTH } from "@/constants/firebaseConfig";
import { Barber } from "@/Models/barberModel";
import userApiService, { baseURL } from "@/services/userApiService";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BarberProfile() {
  const { id } = useLocalSearchParams();
  const [barber, setBarber] = useState<Barber | undefined>(undefined);

  useFocusEffect(
    React.useCallback(() => {
    const fetchBarber = async () => {
      try {
        const token = await FIREBASE_AUTH.currentUser?.getIdToken();
        if (token == undefined) return;
        const barbersData = await userApiService.getBarbers(token);

        barbersData.forEach((barber) => {
          if (barber.firebaseUid === id) {
            setBarber(barber);
          }
        });
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    fetchBarber();
  }, []));
  return (
    <SafeAreaView style={styles.container}>
      {barber && (
        <>
          <Pressable
            onPress={() => {
              router.push("/(app)/");
            }}
          >
            <View style={styles.header}>
              <Ionicons
                style={{ position: "absolute", left: 10 }}
                name="arrow-back"
                size={24}
                color="white"
              />
              <Text style={styles.headertext}>Profile</Text>
            </View>
          </Pressable>
          <Image
            style={styles.avatar}
            source={{ uri: baseURL + "/images/" + barber?.profilePic }} // replace with your image URL
          />
          <BarberDescription barber={barber as Barber} />
          <BarberGallery barber={barber as Barber} />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    margin: 10,
  },
  headertext: {
    flex: 1, // This line makes the Text component take up all remaining space
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    fontFamily: "Jakarta",
  },
  avatar: {
    margin: 10,
    width: Dimensions.get("window").width * 0.3,
    height: Dimensions.get("window").width * 0.3,
    borderRadius: 50,
  },
  container: {
    height: "100%",
    backgroundColor: Colors.backgroundColor,
  },
  titleText: {
    color: Colors.textColor,
    fontSize: 25,
    fontWeight: "bold",
    alignSelf: "center",
  },
});
