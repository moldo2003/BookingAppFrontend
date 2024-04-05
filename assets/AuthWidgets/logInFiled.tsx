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
import { useAuth } from "@/context/auth";

const { width, height } = Dimensions.get("window");
export default function LogInFiled() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn } = useAuth(); 
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Log In to your Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={Colors.textColor}
        onChangeText={(text) => setEmail(text)}
        value={email}
      ></TextInput>
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={Colors.textColor}
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
        value={password}
      ></TextInput>
      <Pressable
        style={{ margin: 10 }}
        onPress={() => router.push("/(auth)/reset")}
      >
        <Text style={styles.textbutton}>Forgot your Password?</Text>
      </Pressable>
      <Pressable
        style={styles.button2}
        onPress={() => router.push("/(auth)/register")}
      >
        <Text style={styles.text}>Sign Up</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => signIn(email, password)}>
        <Text style={styles.text}>Log In</Text>
      </Pressable>
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

  button2: {
    alignItems: "center",
    justifyContent: "center",
    height: height * 0.06,
    borderRadius: 10,
    margin: 10,
    backgroundColor: Colors.thirdColor,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    height: height * 0.06,
    borderRadius: 10,
    margin: 10,
    backgroundColor: Colors.buttonColor,
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
