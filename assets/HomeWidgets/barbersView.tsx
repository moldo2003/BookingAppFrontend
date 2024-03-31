import { Barber } from "@/Models/barberModel";
import Colors from "@/constants/Colors";
import { FIREBASE_AUTH } from "@/constants/firebaseConfig";
import userApiService, { baseURL } from "@/services/userApiService";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  Pressable,
  ActivityIndicator,
} from "react-native";

export default function BarbersView() {
  const [barbers, setBarbers] = useState<Barber[]>([]);

  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        const token = await FIREBASE_AUTH.currentUser?.getIdToken();
        if (token == undefined) return;
        const barbersData = await userApiService.getBarbers(token);
        setBarbers(barbersData);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    fetchBarbers();
  }, []);

  const renderitem = ({ barber, index }: { barber: Barber; index: number }) => {
    let imgUrl = baseURL + "/images/" + barber.profilePic
    
    if(barber.profilePic == ""){
       imgUrl = "https://upload.wikimedia.org/wikipedia/commons/a/af/Default_avatar_profile.jpg";
    }
    return (
      <Pressable onPress={() => {router.push(`/(profile)/${barber.firebaseUid}`)}}>
        <View style={style.barberviewcontainer}>
          <Image
            style={style.image}
            source={{ uri: imgUrl }}
          />
          <View>
            <Text style={style.barbernametext}>{barber.username}</Text>
            <Text style={style.barberdescriptiontext}>
              {barber.smallDescription}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    barbers.length===0 ? (
      <ActivityIndicator size="large" color="white" /> // This is the loading screen
    ) : (
    <View style={{ flex: 1 }}>
      <Text style={style.titletext}>Our Barbers</Text>
      {barbers.length > 0 && (
        <FlatList
          keyExtractor={(item) => item.firebaseUid}
          data={barbers}
          renderItem={({ item, index }) =>
            renderitem({ barber: item, index })
          }
        />
      )}
    </View>
    )
  );
}
const style = StyleSheet.create({
  container:{
      height: 400,
  },
  titletext: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    margin: 10,
    fontFamily: "Jakarta",
  },
  image: {
    margin: 10,
    width: Dimensions.get("window").height * 0.15,
    height: Dimensions.get("window").height * 0.2,
    borderRadius: 10,
  },
  barberviewcontainer: {
    display: "flex",
    flexDirection: "row",
  },
  barbernametext: {
    fontFamily: "Jakarta",
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginTop: 10,
  },
  barberdescriptiontext: {
    fontFamily: "Jakarta",
    fontSize: 12,
    color: Colors.secondText,
  },
});
