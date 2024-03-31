import { FIREBASE_AUTH } from "@/constants/firebaseConfig";
import { View, Text, Button } from "react-native";

export default function AppointmentsHistory() {
  return (
    <View>
      <Text>Appointments History</Text>
      <Button
        title="Go to Appointment"
        onPress={() => {
          FIREBASE_AUTH.signOut();
        }}
      />
    </View>
  );
}
