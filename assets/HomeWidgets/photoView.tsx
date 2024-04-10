import { FIREBASE_AUTH } from "@/constants/firebaseConfig";
import userApiService, { baseURL } from "@/services/userApiService";
import { useFocusEffect } from "expo-router";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  FlatList,
  ScrollView,
  ActivityIndicator,
} from "react-native"; // Assuming apiService.js is in the same directory
import Carousel from "react-native-snap-carousel";
import photoschange from "../SettingsWidgets/functions/photoschange";

export const CarouselWidget = () => {
  const [images, setImages] = useState<string[]>([]);

  useFocusEffect(
    React.useCallback(() => {
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
  
      // Optional: Return a cleanup function to be called when the component is unmounted or the screen goes out of focus.
      return () => {
        setImages([]);
      };
    }, [])
  );
  const renderItem = ({ item, index }: { item: any; index: number }) => {
    // <Image onError={(w) => console.log(w)} source={{ uri: baseURL + "/images/Salon/" + item }} style={styles.image} />
    return (
      <View>
        <Image style={styles.image} source={{ uri: baseURL + "/images/Salon/" + item }} />
      </View>
    );
  };


  return images.length === 0 ? (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="white" /> 
    </View>
  ) : (
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
