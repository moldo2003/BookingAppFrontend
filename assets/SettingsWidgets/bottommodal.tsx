import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  Button,
} from "react-native";
import { VerifyUser } from "./modasl/verifyuser";
import Colors from "@/constants/Colors";
import { DeletUser } from "./modasl/deleteuser";
import { AddBarber } from "./modasl/addbarber";
import { DeletBarber } from "./modasl/removebarber";
//import { ChangePhotos } from "./modasl/changephotos";
import ModifyProfile from "./modasl/modifyprofile";
import ModifyService from "./modasl/modifyservice";
import Toast from "react-native-toast-message";
import { ChangePhotos } from "./modasl/changephotos";
import TimeBlock from "./modasl/timeblock";
import { ChangeEmail } from "./modasl/changeemail";
//import TimeBlock from "./modasl/timeblock";

export enum ModalType {
  None,
  ChangePassword,
  ChangeEmail,
  VerifyUser,
  DeleteUser,
  AddBarber,
  RemoveBarber,
  ChangePhotos,
  ModifyProfile,
  ModifyServices,
  TimeBlock
}

interface BottomModalProps {
  visible: ModalType;
  onClose: () => void;
}

const BottomModal: React.FC<BottomModalProps> = ({ visible, onClose }) => {
  const renderModalContent = () => {
    switch (visible) {
      case ModalType.ChangePassword:
        return <Text>Modal 1 content</Text>;
      case ModalType.ChangeEmail:
        return <ChangeEmail />;
      case ModalType.VerifyUser:
        return <VerifyUser />;
      case ModalType.DeleteUser:
        return <DeletUser />;
      case ModalType.AddBarber:
        return <AddBarber onClose={onClose }/>;
      case ModalType.RemoveBarber:
        return <DeletBarber />;
      case ModalType.ChangePhotos:
         return <ChangePhotos onClose={onClose }/>;
        
      case ModalType.ModifyProfile:
        return <ModifyProfile />;
      case ModalType.ModifyServices:
        return <ModifyService />;
      case ModalType.TimeBlock:
          return <TimeBlock />
          
      // Add more cases for additional modals
      default:
        return null;
    }
  };

  return (
    <View style={{flex: 1}}>
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible !== ModalType.None}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      <View style={styles.modalContainer}>
        {renderModalContent()}
        <Toast />
      </View>
      
    </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent black color
    height: "100%",
    width: "100%",
  },
  modalContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "70%",
    backgroundColor:  Colors.backgroundColor2,
    padding: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});

export default BottomModal;
