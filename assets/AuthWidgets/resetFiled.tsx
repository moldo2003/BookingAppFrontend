import {
  View,
  Text,
  Button,
  TextInput,
  Dimensions,
  Pressable,
} from "react-native";
import React from "react";
import { StyleSheet } from "react-native";
import Colors from "@/constants/Colors";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { FIREBASE_AUTH } from "@/constants/firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";
import { showFailToast, showSuccesToast } from "@/constants/toasts";

const { width, height } = Dimensions.get("window");
export default function ResetFiled() {
  const [email, setEmail] = React.useState("");
  async function sendLink() {
    try {
      await sendPasswordResetEmail(FIREBASE_AUTH, email);

      router.push("/(auth)/login");
      showSuccesToast("Email sent, please check your inbox");
    } catch (e) {
      console.log(e);
      showFailToast("Error sending email");
    }
  }
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Reset password</Text>
      <TextInput
        onChangeText={(text) => setEmail(text)}
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={Colors.textColor}
      ></TextInput>
      <Pressable
        style={{ margin: 10 }}
        onPress={() => router.push("/(auth)/register")}
      >
        <Text style={styles.textbutton}>Don`t have an account?</Text>
      </Pressable>
      <Pressable
        style={styles.button2}
        onPress={() => router.push("/(auth)/login")}
      >
        <Text style={styles.text}>Have an account?</Text>
      </Pressable>
      <Pressable  onPress={()=>sendLink()}style={styles.button}>
        <Text style={styles.text}>Send Link</Text>
      </Pressable>
      <Toast />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    marginTop: height * 0.1,
  },
  titleText: {
    fontFamily: "",
    color: Colors.textColor,
    fontWeight: "bold",
    alignSelf: "center",
    fontSize: 18,
  },
  input: {
    color: Colors.textColor,
    backgroundColor: Colors.thirdColor,
    borderRadius: 10,
    borderColor: Colors.thirdColor,
    height: height * 0.075,
    margin: 10,
    borderWidth: 1,
    paddingLeft: 10,
    paddingRight: 10,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    height: height * 0.06,
    borderRadius: 10,
    margin: 10,
    backgroundColor: Colors.buttonColor,
  },
  button2: {
    alignItems: "center",
    justifyContent: "center",
    height: height * 0.06,
    borderRadius: 10,
    margin: 10,
    backgroundColor: Colors.thirdColor,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  textbutton: {
    color: Colors.textColor,
    fontSize: 12,
    textDecorationLine: "underline",
  },
});
