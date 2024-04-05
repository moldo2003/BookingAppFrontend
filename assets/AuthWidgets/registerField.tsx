import {
  View,
  Text,
  Button,
  TextInput,
  Dimensions,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import Colors from "@/constants/Colors";
import { router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from "@/constants/firebaseConfig";
import userApiService from "@/services/userApiService";
import { showFailToast, showSuccesToast } from "@/constants/toasts";
import Toast from "react-native-toast-message";

const { width, height } = Dimensions.get("window");
export default function RegisterFiled() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confpassword, setConfPassword] = useState("");

  const cretateAccount = async () => {

    if (password == confpassword)
      try {
        const res = await createUserWithEmailAndPassword(
          FIREBASE_AUTH,
          email,
          password
        );
        const token = await res.user.getIdToken();
        await userApiService.createUser(token,res.user.uid, name, email,"");
        router.push("/(auth)/login");
        showSuccesToast("Account created successfully, please verify your email");
      } catch (e) {
        console.log(e);
        showFailToast("Error creating account");
      }
    else showFailToast("Passwords do not match");
  };
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Create your Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        placeholderTextColor={Colors.textColor}
        value={name}
        onChangeText={(text)=>setName(text)}
      ></TextInput>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={Colors.textColor}
        value={email}
        onChangeText={(text)=>setEmail(text)}
      ></TextInput>
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={Colors.textColor}
        secureTextEntry={true}
        value={password}
        onChangeText={(text)=>setPassword(text)}
      ></TextInput>

      <TextInput
        style={styles.input}
        placeholder="Confirm password"
        placeholderTextColor={Colors.textColor}
        secureTextEntry={true}
        value={confpassword}
        onChangeText={(text)=>setConfPassword(text)}
      ></TextInput>
      <Pressable
        style={{ margin: 10 }}
        onPress={() => router.push("/(auth)/reset")}
      >
        <Text style={styles.textbutton}>Forgot your Password?</Text>
      </Pressable>
      <Pressable
        style={styles.button2}
        onPress={() => router.push("/(auth)/login")}
      >
        <Text style={styles.text}>Have an account?</Text>
      </Pressable>
      <Pressable onPress={cretateAccount} style={styles.button}>
        <Text style={styles.text}>Create account</Text>
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
