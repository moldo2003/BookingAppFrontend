import Colors from "@/constants/Colors";
import { FIREBASE_AUTH } from "@/constants/firebaseConfig";
import { Service } from "@/Models/barberModel";
import barberApiService from "@/services/barberApiService";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import Dialog from "react-native-dialog";
import {
  View,
  Text,
  Dimensions,
  FlatList,
  Pressable,
  Alert,
} from "react-native";
import { StyleSheet } from "react-native";
import { Icon } from "react-native-elements";
import modifyservice from "../functions/modifyservice";
import { set } from "date-fns";
import { on } from "stream";

const { width, height } = Dimensions.get("window");
export default function ModifyService() {
  const [services, setServices] = useState<Service[]>([]);
  const [visible, setVisible] = useState(false);

  const [serviceTime, setServiceTime] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [serviceName, setServiceName] = useState("");

  const [create, setCreate] = useState(false);

  async function fetchServices() {
    try {
      const token = await FIREBASE_AUTH.currentUser?.getIdToken();
      const res = await barberApiService.getServices(token as string);
      setServices(res.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  }

  useEffect(() => {
    fetchServices();
  }, []);

  const showDialog = () => {
    setVisible(true);
  };

  const handleCancel = async () => {
    setVisible(false);
    setCreate(false);
  };

  const handleUpdate = async () => {
    const token = await FIREBASE_AUTH.currentUser?.getIdToken();
    await modifyservice.updateService(
      serviceName,
      parseFloat(servicePrice),
      parseInt(serviceTime)
    );
    setVisible(false);
    setCreate(false);
    await fetchServices();
  };

  const handleCreate = async () => {
    const token = await FIREBASE_AUTH.currentUser?.getIdToken();
    await modifyservice.addService(serviceName, servicePrice, serviceTime);
    setVisible(false);
    setCreate(false);
    await fetchServices();
  };
  return (
    <View style={{ flex: 1, alignContent: "center" }}>
      <Text style={styles.title}>Modify Services</Text>
      <FlatList
        data={services}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignContent: "center",
              marginBottom: 10,
              backgroundColor: Colors.thirdColor,
              padding: 10,
              borderRadius: 15,
            }}
          >
            <View>
              <Text style={styles.text}>{item.serviceName}</Text>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.text}>
                  {"Price: " + item.servicePrice + " "}
                </Text>
                <Text style={styles.text}>{"Time: " + item.serviceTime}</Text>
              </View>
            </View>
            <View style={{ flexDirection: "row" }}>
              <View style={{ flexDirection: "row" }}>
                <Ionicons
                  style={{ marginRight: 10 }}
                  name="pencil"
                  size={24}
                  color="white"
                  onPress={() => {
                    setServiceName(item.serviceName);
                    setServicePrice(item.servicePrice.toString());
                    setServiceTime(item.serviceTime.toString());
                    showDialog();
                  }}
                />
                <Ionicons
                  name="trash-bin"
                  size={24}
                  color="#B22222"
                  onPress={() => {
                    modifyservice.deleteService(item.serviceName);
                  }}
                />
              </View>
            </View>
          </View>
        )}
      />
      <Pressable
        style={styles.button}
        onPress={async () => {
          setCreate(true), showDialog();
        }}
      >
        <Text style={styles.textbutton}>Add Service</Text>
      </Pressable>
      <Dialog.Container
        contentStyle={{ backgroundColor: Colors.backgroundColor }}
        visible={visible}
      >
        <Dialog.Title style={styles.title}>
          {!create ? "Update service" : "Create Service"}
        </Dialog.Title>
        {create && (
          <Dialog.Input
            label="Service Name"
            value={serviceName}
            onChangeText={(text) => setServiceName(text)}
          />
        )}

        <Dialog.Input
          label="Service Price"
          value={servicePrice}
          onChangeText={(text) => setServicePrice(text)}
        />
        <Dialog.Input
          label="Service Time"
          value={serviceTime}
          onChangeText={(text) => setServiceTime(text)}
        />
        <Dialog.Button
          onPress={() => {
            handleCancel();
          }}
          label="Cancel"
        />
        <Dialog.Button
          onPress={() => {
            if (!create) handleUpdate();
            else handleCreate();
          }}
          label={create ? "Create" : "Update"}
        />
      </Dialog.Container>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    color: "white",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
    fontFamily: "Jakarta",
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: "white",
    borderColor: "black",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    height: height * 0.05,
    width: "100%",
    borderRadius: 10,
    backgroundColor: Colors.buttonColor,
    marginBottom: 20,
  },
  textbutton: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  text: {
    fontFamily: "Jakarta",
    fontSize: 12,
    color: "white",
  },
});
