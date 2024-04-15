import React from "react";
import { Stack } from "expo-router";

const StackLayout = () => {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{ headerShown: false, headerTitleAlign: "center" }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="Register" />
      <Stack.Screen name="forgotPassword" options={{ headerShown: true }} />
    </Stack>
  );
};

export default StackLayout;
