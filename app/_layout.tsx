import { AuthProvider } from "@/context/auth";
import { useFonts } from "expo-font";
import { Slot, SplashScreen, Stack } from "expo-router";
import React, { useCallback } from "react";
import Toast from "react-native-toast-message";
import { Dimensions, Platform, View, Text } from "react-native";
import Colors from "@/constants/Colors";

export default function Layout() {
  const [fontsLoaded, fontError] = useFonts({
    Jakarta: require("../assets/fonts/Plus_Jakarta_Sans/Jakarta.ttf"),
  });
  const { width, height } = Dimensions.get("window");
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return ((Platform.OS === "web" && width < height ) || Platform.OS=="android" )? (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_bottom",
          animationDuration: 30,
        }}
      >
        <Stack.Screen name="(app)" options={{ animation: "ios" }} />
      </Stack>
    </AuthProvider>
  ) : (
    <View
      style={{
        backgroundColor: Colors.backgroundColor,
        flex: 1,
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <Text style={{
        color: Colors.textColor,
        fontSize: 20,
        textAlign: "center"

      }}>App not supported Pc, use the app on your phone</Text>
    </View>
  );
}

/*#include <ESP32Servo.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

const int trigPin = 2;
const int echoPin = 4;
const int distPin = 19;
const int laserPin = 18;

#define SOUND_SPEED 0.034

Servo distServo;
Servo laserServo;

TaskHandle_t sonarTask;
SemaphoreHandle_t sonarSemaphore;  // Create a semaphore for sonar sensor reading

portMUX_TYPE mux = portMUX_INITIALIZER_UNLOCKED;

void initHc() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
}

void initServo() {
  ESP32PWM::allocateTimer(0);
  ESP32PWM::allocateTimer(1);
  ESP32PWM::allocateTimer(2);
  ESP32PWM::allocateTimer(3);

  distServo.setPeriodHertz(50);
  distServo.attach(distPin, 500, 2400);

  laserServo.setPeriodHertz(50);
  laserServo.attach(laserPin, 500, 2400);
}

float dist = 0;
int pos = 0;
int dir = 1;
void getDistance(void *parameter) {
  for (;;) {
    long duration;
    float distanceCm;
    // Clears the trigPin
    digitalWrite(trigPin, LOW);
    delayMicroseconds(2);
    // Sets the trigPin on HIGH state for 10 microseconds
    digitalWrite(trigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(trigPin, LOW);
    // Reads the echoPin, returns the sound wave travel time in microseconds
    duration = pulseIn(echoPin, HIGH);
    // Calculate the distance
    distanceCm = duration * SOUND_SPEED / 2;
    //Serial.println(distanceCm);
    if (distanceCm < 100) {
      Serial.print("Object on pos: ");
      Serial.println(pos);
    }

     vTaskDelay(15);
  }
  vTaskDelete(NULL);
}



void setup() {
  Serial.begin(115200);
  initHc();
  initServo();
  xTaskCreatePinnedToCore(getDistance, "SonarTask", 10000, NULL, 1, &sonarTask, 0);
}

void loop() {
  if (pos == 180)
    dir = -1;
  if (pos == 0)
    dir = 1;
  pos += dir;


  distServo.write(pos);
  delay(15);
}
*/
