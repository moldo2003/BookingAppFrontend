import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import axios from "axios";
import { Buffer } from "buffer";
import { FIREBASE_AUTH } from "@/constants/firebaseConfig";
import barberApiService from "@/services/barberApiService";
import { baseURL } from "@/services/userApiService";

class ProfileModel {
  apiLink = baseURL; // replace with your base URL

  async changeBigDescription(bigDescription: string) {
    const token = await FIREBASE_AUTH.currentUser?.getIdToken();
    await barberApiService.changeBigDescription(
      token as string,
      bigDescription
    );
    // Call your API to change big description
  }

  async changeSmallDescription(smallDescription: string) {
    const token = await FIREBASE_AUTH.currentUser?.getIdToken();
    await barberApiService.changeSmallDescription(
      token as string,
      smallDescription
    );
    // Call your API to change small description
  }

  async changeProfilePicture() {
    const token = await FIREBASE_AUTH.currentUser?.getIdToken();

    await ImagePicker.requestMediaLibraryPermissionsAsync();

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      base64: true,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (result.canceled) return;

    FileSystem.readAsStringAsync(result.assets[0].uri, {
      encoding: FileSystem.EncodingType.Base64,
    }).then(async (base64Image) => {
      await axios.post(
        `${this.apiLink}/barber/changeProfilePic`,
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
    });

    // Send the POST reques
  }

  async addPhotoToGallery() {
    const token = await FIREBASE_AUTH.currentUser?.getIdToken();

    await ImagePicker.requestMediaLibraryPermissionsAsync();

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (result.canceled) return;

    await FileSystem.readAsStringAsync(result.assets[0].uri, {
      encoding: FileSystem.EncodingType.Base64,
    }).then(async (base64Image) => {
      await axios.post(
        `${this.apiLink}/barber/addPhoto`,
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
    });

    return;
  }

  async removePhotoFromGallery(photo: string) {
    const token = await FIREBASE_AUTH.currentUser?.getIdToken();
    await barberApiService.removeBarberPhotos(token as string, photo);
    // Call your API to remove photo from gallery
  }

  async getBarberPhotos(): Promise<string[]>{
    const token = await FIREBASE_AUTH.currentUser?.getIdToken();
    const barberphotos = await barberApiService.getBarberPhotos(token as string);
    return barberphotos.data;
    // Call your API to get barber photos
  }
}

export default new ProfileModel();