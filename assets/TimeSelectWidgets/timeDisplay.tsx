import { Time } from "@/Models/appointmentModel";
import { View, Text } from "react-native";
import { StyleSheet } from "react-native";
import { text } from "stream/consumers";

export default function TimeDisplay( {start,end,isSelected} : {start: Time, end: Time , isSelected: boolean}) {
    return (
        <View style={ isSelected? styles.containerSelected : styles.container}>
             <View>
                  <Text style={ isSelected? styles.textSelected : styles.text} >{start.hour}:{ String(start.minute).padStart(2, '0')}</Text>
                </View>

                <View>
                    <Text style={ isSelected? styles.textSelected : styles.text} >{end.hour}:{String(end.minute).padStart(2, '0')}</Text>
                </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        margin: 10,
        borderRadius: 10,
        backgroundColor: 'white',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },

    containerSelected:{
    
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        margin: 10,
        borderRadius: 10,
        backgroundColor: 'green',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },

    text:{
        color: 'black',
        fontSize: 16,
        fontFamily: 'Jakarta',
    },

    textSelected:{
        color: 'white',
        fontSize: 16,
        fontFamily: 'Jakarta',
    }
});


