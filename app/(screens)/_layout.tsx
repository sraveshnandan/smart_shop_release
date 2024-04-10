import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const StackLayout = () => {
  return (
    <Stack screenOptions={{ headerTitleAlign: "center" }}>
      <Stack.Screen
        name="AddProduct"
        options={{
          headerTitle: "Add new product",
        }}
      />
      <Stack.Screen name="ProductsDetails" />
      <Stack.Screen name="EditProfile" />
      <Stack.Screen name="ShopLists" />
      <Stack.Screen name="BecomeMerchant" />
      <Stack.Screen name="Shopdetails" />
      <Stack.Screen name="EditProduct" />
      <Stack.Screen name="EditShop" />
    </Stack>
  );
};

export default StackLayout;
