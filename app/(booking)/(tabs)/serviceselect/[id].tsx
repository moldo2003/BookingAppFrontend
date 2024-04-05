import Colors from "@/constants/Colors";
import { FIREBASE_AUTH } from "@/constants/firebaseConfig";
import { showFailToast } from "@/constants/toasts";
import { Service } from "@/Models/barberModel";
import userApiService from "@/services/userApiService";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  Pressable,
  Dimensions,
} from "react-native";
import { StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
const { width, height } = Dimensions.get("window");
export default function ServiceSelect() {
  const { id } = useLocalSearchParams();

  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedService] = useState<Service[]>([]);
  useEffect(() => {
    const fetchBarberServices = async () => {
      try {
        const token = await FIREBASE_AUTH.currentUser?.getIdToken();
        if (token == undefined) return;
        const barbersData = await userApiService.getServices(
          token,
          id as string
        );
        setServices(barbersData);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    fetchBarberServices();
  }, []);

  const selectServices = (service: Service) => {
    if (selectedServices.includes(service)) {
      setSelectedService(selectedServices.filter((item) => item !== service));
    } else {
      setSelectedService([...selectedServices, service]);
    }
  };
  const renderItem = ({ item, index }: { item: Service; index: number }) => {
    const isSelected = selectedServices.includes(item);
    return (
      <Pressable onPress={() => selectServices(item)}>
        <View
          style={[
            styles.serviceContainer,
            isSelected ? styles.selectedserviceContainer : {},
          ]}
        >
          <Text style={styles.text}>{item.serviceName}</Text>
          <Text style={styles.text}>{item.servicePrice + " Ron"}</Text>
        </View>
      </Pressable>
    );
  };

  function getData() {
    return JSON.stringify({
      services: selectedServices,
      id: id,
    });
  }

  function getfastestapp() {
    if (selectedServices.length === 0)
      showFailToast("Select at least one service");
    else
      router.push({
        pathname: "(booking)/(tabs)/getfastestapp/[data]",
        params: { data: getData() },
      } as never);
  }

  function getcustomapp() {
    if (selectedServices.length === 0)
      showFailToast("Select at least one service");
    else
      router.push({
        pathname: "(booking)/(tabs)/timeselect/[data]",
        params: { data: getData() },
      } as never);
  }
  return (
    <View style={styles.container}>
      <FlatList data={services} renderItem={renderItem} />
      <Pressable style={styles.button} onPress={() => getfastestapp()}>
        <Text style={styles.buttontext}>Get fastest appointment</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => getcustomapp()}>
        <Text style={styles.buttontext}>Get a custom appointment</Text>
      </Pressable>
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: Colors.backgroundColor,
  },
  serviceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "white",
  },
  selectedserviceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "white",
    backgroundColor: "green",
  },
  text: {
    fontFamily: "Jakarta",
    color: "white",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
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
