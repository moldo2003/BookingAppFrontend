// Assuming you use @react-native-firebase/auth for Firebase authentication

import axios from "axios";
import { FIREBASE_AUTH } from "@/constants/firebaseConfig";
import userApiService, { baseURL } from "@/services/userApiService";
import adminApiService from "@/services/adminApiService";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";

class PhotoModel {
  async getPhotos(): Promise<string[]> {
    const token = await FIREBASE_AUTH.currentUser?.getIdToken();

    if (!token) {
      throw new Error("User not authenticated.");
    }

    const response = await userApiService.getPhotos(token);
    return response; // Assuming userApi.getPhotos returns a Promise with response object containing data
  }

  async removePhoto(photo: string): Promise<void> {
    const token = await FIREBASE_AUTH.currentUser?.getIdToken();

    if (!token) {
      throw new Error("User not authenticated.");
    }

    await adminApiService.removePhoto(token, photo);
    return;
  }

  async addPhoto(): Promise<void> {
    const token = await FIREBASE_AUTH.currentUser?.getIdToken();
    try {
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.canceled) {
        let base64Image;
        if (Platform.OS === 'web') {
          const response = await fetch(result.assets[0].uri);
          const blob = await response.blob();
          base64Image = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        } else {
          base64Image = await FileSystem.readAsStringAsync(result.assets[0].uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
        }
  
        try {
          await axios.post(
            `${baseURL}/admin/addPhoto`,
            {
              photo: base64Image,
              photoname: result.assets[0].uri.split("/").pop(),
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: token,
              },
            }
          );
          return;
        } catch (e) {
          throw new Error("Error adding photo");
        }
      }
    } catch (e) {
      console.log(e);
    }
    return;
  }
}

export default new PhotoModel();
