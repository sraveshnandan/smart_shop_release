import React from "react";
import { Stack } from "expo-router";

const StackLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="Register" />
      <Stack.Screen name="forgotPassword" />
    </Stack>
  );
};

export default StackLayout;
