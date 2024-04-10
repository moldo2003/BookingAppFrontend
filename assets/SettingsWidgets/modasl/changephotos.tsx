import {
  View,
  Text,
  Pressable,
  Dimensions,
  Image,
  FlatList,
  Alert,
} from "react-native";
import { Button } from "react-native-elements";
import photoschange from "../functions/photoschange";
import { StyleSheet } from "react-native";
import Colors from "@/constants/Colors";
import { useEffect, useState } from "react";
import { baseURL } from "@/services/userApiService";

const { width, height } = Dimensions.get("window");

export function ChangePhotos({
  onClose,
}: {
  onClose: () => void;
}): JSX.Element {
  const [photos, setPhotos] = useState<string[]>([]);
  const fetchData = async () => {
    const res = await photoschange.getPhotos();
    setPhotos(res);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderItem = ({ item, index }: { item: string; index: number }) => {
    let imgUrl = baseURL + "/images/Salon/" + item;
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
                    await photoschange.removePhoto(item);
                    const res = await photoschange.getPhotos();
                   fetchData();
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
    <View style={styles.container}>
      <Text style={styles.title}>Change Photos</Text>
      {photos.length !== 0 ? (
        <FlatList data={photos} renderItem={renderItem} numColumns={2} />
      ) : (
        <Text>No photos to display</Text>
      )}

      <Pressable
        style={styles.button}
        onPress={async () => {
          await photoschange.addPhoto();
        }}
      >
        <Text style={styles.textbutton}>Upload photo</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.backgroundColor2,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    color: "white",
    textAlign: "center",
    fontFamily: "Jakarta",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    height: height * 0.06,
    width: "100%",
    borderRadius: 10,
    backgroundColor: Colors.buttonColor,
  },
  textbutton: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});
