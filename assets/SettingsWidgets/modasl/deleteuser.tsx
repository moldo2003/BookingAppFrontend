import Colors from "@/constants/Colors";
import { FIREBASE_AUTH } from "@/constants/firebaseConfig";
import { User } from "@/Models/userModel";
import adminApiService from "@/services/adminApiService";
import userApiService from "@/services/userApiService";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { TouchableOpacity, View, Text, FlatList, Alert } from "react-native";
import { StyleSheet } from "react-native";

export function DeletUser() {
  const [users, setUsers] = useState<User[]>([]);
  async function fetchUsers() {
    try {
      const token = await FIREBASE_AUTH.currentUser?.getIdToken();
      const res = await userApiService.getUsers(token as string);
      setUsers(res);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delete User</Text>
      {users ? (
        <FlatList
          data={users}
          renderItem={({ item }) => {
            return (
              <View style={styles.userContainer}>
                <View style={styles.userInfo}>
                  <Text style={styles.usertext1}>{item.username}</Text>
                  <Text style={styles.usertext2}>{item.email}</Text>
                </View>
                <View style={styles.icons}>
                  <TouchableOpacity
                    onPress={async () => {
                      Alert.alert(
                        "Delete User",
                        "Are you sure you want to delete this user?",
                        [
                          {
                            text: "Cancel",
                            style: "cancel",
                          },
                          {
                            text: "OK",
                            onPress: async () => {
                              const token =
                                await FIREBASE_AUTH.currentUser?.getIdToken();
                              await adminApiService.deleteUser(
                                token as string,
                                item.firebaseUid,
                              );
                              await fetchUsers();
                            },
                          },
                        ]
                      );
                    }}
                  >
                    <Ionicons name="trash-bin" size={24} color="#B22222" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      ) : (
        <Text>No users to verify</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor2,
  },
  iconButton: {
    marginHorizontal: 5, // add horizontal padding between icons
  },
  title: {
    fontSize: 24,
    color: "white",
    textAlign: "center",
    fontFamily: "Jakarta",
  },
  usertext1: {
    fontSize: 12,
    color: "white",
    fontFamily: "Jakarta",
  },
  usertext2: {
    fontSize: 12,

    fontFamily: "Jakarta",
  },
  userContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
  },
  userInfo: {
    flexDirection: "column",
  },
  icons: {
    flexDirection: "row",
  },
});
