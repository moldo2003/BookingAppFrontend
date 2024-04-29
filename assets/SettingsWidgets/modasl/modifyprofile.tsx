import Colors from "@/constants/Colors";
import { FIREBASE_AUTH } from "@/constants/firebaseConfig";
import adminApiService from "@/services/adminApiService";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  Pressable,
  TextInput,
  Image,
  Alert,
  FlatList,
  ScrollView,
} from "react-native";
import { StyleSheet } from "react-native";
import modifyprofile from "../functions/modifyprofile";
import { baseURL } from "@/services/userApiService";
import { showFailToast, showSuccesToast } from "@/constants/toasts";
import Toast from "react-native-toast-message";

const { width, height } = Dimensions.get("window");
export default function ModifyProfile() {
  const [smallDescription, setSmallDescription] = useState("");
  const [bigDescription, setBigDescription] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const token = await FIREBASE_AUTH.currentUser?.getIdToken();
        const res = await modifyprofile.getBarberPhotos();
        setPhotos(res);
      } catch (error) {
        console.error("Error fetching photos:", error);
      }
    }
    fetchPhotos();
  }, []);

  const renderItem = ({ item, index }: { item: string; index: number }) => {
    let imgUrl = baseURL + "/images/" + item;
    return (
      <View>
        <Pressable
          onLongPress={() => {
            Alert.alert(
              "Delete photo",
              "Are you sure you want to delete this photo?",
              [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
                {
                  text: "Delete",
                  onPress: async () => {
                    try {
                      await modifyprofile.removePhotoFromGallery(item);
                      const res = await modifyprofile.getBarberPhotos();
                      setPhotos(res);
                      showSuccesToast("Photo deleted successfully");
                    } catch (error) {
                      showFailToast("Error deleting photo");
                    }
                  },
                },
              ]
            );
          }}
        >
          <Image
            style={{
              width: width / 2 - 30,
              height: width / 2 - 30,
              margin: 10,
              borderRadius: 10,
            }}
            source={{ uri: imgUrl }}
          />
        </Pressable>
      </View>
    );
  };

  return (
    <ScrollView style={{ flex: 1, alignContent: "center" }}>
      <Text style={styles.text}>Modify Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Small Description"
        onChangeText={(text) => {
          setSmallDescription(text);
        }}
      />
      <Pressable
        style={styles.button}
        onPress={async () => {
          try {
            modifyprofile.changeSmallDescription(smallDescription);
            showSuccesToast("Small Description changed successfully");
          } catch (error) {
            showFailToast("Error changing small description");
          }
        }}
      >
        <Text style={styles.textbutton}>Change Small Description</Text>
      </Pressable>

      <TextInput
        style={styles.input}
        placeholder="Enter Big Description"
        onChangeText={(text) => {
          setBigDescription(text);
        }}
      />
      <Pressable
        style={styles.button}
        onPress={async () => {
          try {
            modifyprofile.changeBigDescription(bigDescription);
            showSuccesToast("Big Description changed successfully");
          } catch (error) {
            showFailToast("Error changing big description");
          }
        }}
      >
        <Text style={styles.textbutton}>Change Big Description</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={async () => {
          try {
            await modifyprofile.changeProfilePicture();
            showSuccesToast("Profile picture changed successfully");
          } catch (error) {
            showFailToast("Error changing profile picture");
          }
        }}
      >
        <Text style={styles.textbutton}>Change Profile Picture</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={async () => {
          await modifyprofile.addPhotoToGallery();
          const res = await modifyprofile.getBarberPhotos();
          setPhotos(res);
        }}
      >
        <Text style={styles.textbutton}>Add photo to gallery </Text>
      </Pressable>

      {photos.length !== 0 ? (
        <FlatList
          data={photos}
          renderItem={renderItem}
          numColumns={2}
          scrollEnabled={false}
        />
      ) : (
        <Text style={styles.text}>No photos to display</Text>
      )}
      <Toast />
    </ScrollView>
  );
}

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
