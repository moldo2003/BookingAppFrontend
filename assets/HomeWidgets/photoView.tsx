import { FIREBASE_AUTH } from "@/constants/firebaseConfig";
import userApiService, { baseURL } from "@/services/userApiService";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  FlatList,
  ScrollView,
} from "react-native"; // Assuming apiService.js is in the same directory
import Carousel from "react-native-snap-carousel";

export const CarouselWidget = () => {
  const [images, setImages] = useState<string[]>([]);
  const test = [1, 2, 3, 4, 5];

  useEffect(() => {
    const fetchImagesData = async () => {
      try {
        const token = await FIREBASE_AUTH.currentUser?.getIdToken();
        if (token == undefined) return;
        const imagesData = await userApiService.getPhotos(token);
        setImages(imagesData);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImagesData();
  }, []);

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    // <Image onError={(w) => console.log(w)} source={{ uri: baseURL + "/images/Salon/" + item }} style={styles.image} />
    return (
      <View>
        <Image style={styles.image} source={{ uri: baseURL + "/images/Salon/" + item }} />
      </View>
    );
  };


  return (
    <View style={styles.container}>
      {images.length > 0 && (
          <FlatList 
            keyExtractor={(item) => item}
            data={images}
            renderItem={(renderItem)}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
          />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get("window").height*0.35, 
  },
  image: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height*0.35, // Adjust height as needed
    resizeMode: "cover",
  },
});
