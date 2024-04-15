import React from "react";
import { Tabs } from "expo-router";
import { Colors } from "@/constants";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const StackLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.Primary,
        headerLeftLabelVisible: true,
        headerShadowVisible: true,
        headerTitleAlign: "center",
      }}
    >
      {/* Home Screen  */}
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "home" : "home-outline"}
              size={25}
              color={color}
            />
          ),
        }}
      />
      {/* Search Screen  */}
      <Tabs.Screen
        name="Search"
        options={{
          tabBarLabel: "Search",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="search-sharp" size={20} color={color} />
          ),
        }}
      />

      {/* Wislist Screen  */}
      <Tabs.Screen
        name="Wishlist"
        options={{
          tabBarLabel: "Wishlist",
          headerTitle: " Your Wishlist Products",
          headerTitleStyle: {
            fontFamily: "default",
          },
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "cart-sharp" : "cart-outline"}
              size={20}
              color={color}
            />
          ),
        }}
      />

      {/* Profile Screen  */}
      <Tabs.Screen
        name="Profile"
        options={{
          tabBarLabel: "Profile",
          headerTitle: "Profile Page",
          headerTitleStyle: {
            fontFamily: "default",
          },
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person-sharp" : "person-outline"}
              size={20}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default StackLayout;
