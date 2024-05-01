import Colors from "@/constants/Colors";
import { Barber } from "@/Models/barberModel";
import { baseURL } from "@/services/userApiService";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
} from "react-native";
const { width, height } = Dimensions.get("window");
export default function BarberGallery({ barber }: { barber: Barber }) {
  const renderItem = ({ item, index }: { item: string; index: number }) => {
    let imgUrl = baseURL + "/images/" + item;
    return (
      <View>
        <Image
          style={{
            width: width / 2 - 30,
            height: width / 2 - 30,
            margin: 10,
            borderRadius: 10,
          }}
          source={{ uri: imgUrl }}
        />
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gallery</Text>
       <FlatList data={barber.photos} renderItem={renderItem} numColumns={2} scrollEnabled={false}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textColor,
    fontFamily: "Jakarta",
  },
});
