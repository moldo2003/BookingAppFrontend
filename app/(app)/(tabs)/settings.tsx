import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  Pressable,
  StyleSheet,
  View,
  Dimensions,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FIREBASE_AUTH } from "@/constants/firebaseConfig";

import Colors from "@/constants/Colors";
import BottomModal, { ModalType } from "@/assets/SettingsWidgets/bottommodal";
import { useAuth } from "@/context/auth";
import { User } from "@/Models/userModel";
const { width, height } = Dimensions.get("window");
export default function Settings() {
  const [modalVisible, setModalVisible] = useState(ModalType.None); // State to manage modal visibility
  const { userData } = useAuth();

  // Function to show the modal
  const showModal = (modalType: ModalType) => {
    setModalVisible(modalType);
  };

  // Function to hide the modal
  const hideModal = () => {
    setModalVisible(ModalType.None);
  };

  return (
    userData !== undefined && (
      <View>
        <ScrollView style={styles.container}>
          <View style={{ height: 50 }} />
          <Pressable onPress={() => showModal(ModalType.ChangePassword)}>
            <Text style={styles.text}>Change password</Text>
          </Pressable>
          <Pressable onPress={() => showModal(ModalType.ChangeEmail)}>
            <Text style={styles.text}>Change email</Text>
          </Pressable>
          {(userData as User).isAdmin && (
            <>
              <Pressable onPress={() => showModal(ModalType.VerifyUser)}>
                <Text style={styles.text}>Verify User</Text>
              </Pressable>
              <Pressable onPress={() => showModal(ModalType.DeleteUser)}>
                <Text style={styles.text}>Delete User</Text>
              </Pressable>
              <Pressable onPress={() => showModal(ModalType.AddBarber)}>
                <Text style={styles.text}>Add barber</Text>
              </Pressable>
              <Pressable onPress={() => showModal(ModalType.RemoveBarber)}>
                <Text style={styles.text}>Remove barber</Text>
              </Pressable>
              <Pressable onPress={() => showModal(ModalType.ChangePhotos)}>
                <Text style={styles.text}>Salon settings</Text>
              </Pressable>
            </>
          )}
          {(userData as User).isBarber && (
            <>
              <Pressable onPress={() => showModal(ModalType.ModifyProfile)}>
                <Text style={styles.text}>Modify profile</Text>
              </Pressable>
              <Pressable onPress={() => showModal(ModalType.ModifyServices)}>
                <Text style={styles.text}>Modify services</Text>
              </Pressable>
              <Pressable onPress={() => showModal(ModalType.TimeBlock)}>
                <Text style={styles.text}>Block Times</Text>
              </Pressable>
            </>
          )}
          <Pressable onPress={() => FIREBASE_AUTH.signOut()}>
            <Text style={styles.textred}>Sign out</Text>
          </Pressable>

          <View style={{ height: 50 }} />
          <BottomModal visible={modalVisible} onClose={hideModal} />
        </ScrollView>
        <Image
          style={styles.imageStyle}
          source={require("../../../assets/images/logo.png")}
          resizeMethod="scale"
          resizeMode="contain"
        />
      </View>
    )
  );
}

const styles = StyleSheet.create({
  imageStyle: {
    width: width * 0.9,
    height: height * 0.08,
    alignSelf: "center",
    marginBottom: 10,
    marginTop: 20,
    position: "absolute",
  },
  container: {
    padding: 20,
    backgroundColor: Colors.backgroundColor,
    height: "100%",
  },
  text: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 20,
    color: "white",
    fontFamily: "Jakarta",
  },
  textred: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 20,
    color: "red",
    fontFamily: "Jakarta",
  },
  titleText: {
    color: Colors.textColor,
    fontSize: 25,
    fontWeight: "bold",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 10,
  },
});
