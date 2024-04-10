import Colors from "@/constants/Colors";
import { FIREBASE_AUTH } from "@/constants/firebaseConfig";
import adminApiService from "@/services/adminApiService";
import { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  Pressable,
  Dimensions,
} from "react-native";
import { StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

export function AddBarber({ onClose }: { onClose: () => void }): JSX.Element {
  const [email, setEmail] = useState("");
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Barber</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter email"
        onChangeText={(text) => setEmail(text)}
      />
      <Pressable
        style={styles.button}
        onPress={async () => {
          const token = await FIREBASE_AUTH.currentUser?.getIdToken();
          await adminApiService.addBarber(token as string, email);
          setEmail("");
          onClose();
        }}
      >
        <Text style={styles.textbutton}>Submit</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    height: height * 0.06,
    width: "100%",
    borderRadius: 10,
    margin: 10,
    backgroundColor: Colors.buttonColor,
  },
  textbutton: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  container: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontFamily: "Jakarta",
    color: "white",
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
});
