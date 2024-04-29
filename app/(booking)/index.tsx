import Colors from "@/constants/Colors";
import { FIREBASE_AUTH } from "@/constants/firebaseConfig";
import { showFailToast } from "@/constants/toasts";
import { useAuth } from "@/context/auth";
import { Barber } from "@/Models/barberModel";
import userApiService, { baseURL } from "@/services/userApiService";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, Button, FlatList,Image, Dimensions, Pressable } from "react-native";
import { StyleSheet } from "react-native";
const { width, height } = Dimensions.get("window");
export default function BarberSelect() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const { userData } = useAuth();


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

  const renderItem = ({ item, index }: { item: Barber; index: number }) => {
    let imgUrl = baseURL + "/images/" + item.profilePic;
    
    if(item.profilePic == ""){
       imgUrl = "https://upload.wikimedia.org/wikipedia/commons/a/af/Default_avatar_profile.jpg";
    }
    return (
      <Pressable onPress={() => router.push(`/(booking)/(tabs)/serviceselect/${item.firebaseUid}`)}>
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
      </Pressable>
    );
  };
  return (
    <View style={styles.container}>
      <FlatList data={barbers} renderItem={renderItem} numColumns={2} />
      {/* <Button title="Go to Barber Profile" onPress={() => {router.push("/(booking)/(tabs)/serviceselect/asdas")}}/> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: Colors.backgroundColor,
  },
});
