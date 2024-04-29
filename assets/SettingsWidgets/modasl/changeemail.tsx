import Colors from "@/constants/Colors";
import { FIREBASE_AUTH } from "@/constants/firebaseConfig";
import { showFailToast, showSuccesToast } from "@/constants/toasts";
import {
  AuthCredential,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendEmailVerification,
  updateEmail,
} from "firebase/auth";
import { useState } from "react";
import { View, Text, Dimensions, TextInput, Pressable } from "react-native";
import { StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");
export const ChangeEmail = () => {
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  async function sendEmailReset() {
    try {
      const currentUser = FIREBASE_AUTH.currentUser;
      if (currentUser) {
        let credential = EmailAuthProvider.credential(
          currentUser.email ?? "",
          password
        );
        // Reauthenticate user with current credentials
        await reauthenticateWithCredential(currentUser, credential);
        // If reauthentication successful, update email
        await updateEmail(currentUser, newEmail);
        await sendEmailVerification(currentUser);
        showSuccesToast("Email updated successfully");
      }
    } catch (error) {
      console.error("Error updating email:", error);
      showFailToast(error as string);
    }
  }
  return (
    <View>
      <Text style={styles.text}>Change email</Text>
      <TextInput
        style={styles.input}
        placeholder="New email"
        onChangeText={(text) => setNewEmail(text)}
      />

      <TextInput
        secureTextEntry={true}
        style={styles.input}
        placeholder="Password"
        onChangeText={(text) => setPassword(text)}
      />

      <Pressable
        style={styles.button}
        onPress={async () => {
          sendEmailReset();
        }}
      >
        <Text style={styles.textbutton}>Change email</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 24,
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
});
