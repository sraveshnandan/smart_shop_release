import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const StackLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerTitleAlign: "center",
        animation: "ios",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="ShopSearch" />
    </Stack>
  );
};

export default StackLayout;
