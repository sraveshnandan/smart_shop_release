import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Colors } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const LoginAlert = () => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {/* Popup message  */}
      <View
        style={{
          width: "90%",
          alignItems: "center",
          paddingVertical: 10,
          backgroundColor: Colors.White,
          borderRadius: 6,
          shadowColor: "#222",
          shadowOffset: { width: 10, height: 10 },
          elevation: 10,
        }}
      >
        {/* Alert Icon  */}
        <Ionicons name="warning-outline" color={"orange"} size={50} />
        <Text style={{ fontSize: 28, color: "red", fontFamily: "default" }}>
          UnAuthenticated
        </Text>
        <Text
          style={{
            width: "90%",
            textAlign: "center",
            marginTop: 10,
            fontFamily: "default",
          }}
        >
          Please login to get the list of your wishlist items.Currently you are
          in Guest mode, you can only view the items.
        </Text>
        {/* Action Buttons  */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            paddingHorizontal: 10,
            marginTop: 15,
          }}
        >
          {/* Cancle Button  */}
          <TouchableOpacity
            onPress={() => router.push(`/(tabs)/`)}
            style={{
              backgroundColor: Colors.CardBg,
              padding: 10,
              borderRadius: 6,
              width: "48%",
              borderWidth: 1,
              borderColor: Colors.Primary,
            }}
          >
            <Text
              style={{
                color: Colors.Primary,
                fontSize: 18,
                textAlign: "center",
                fontFamily: "default",
              }}
            >
              Cancle
            </Text>
          </TouchableOpacity>
          {/* Contnue Button  */}
          <TouchableOpacity
            onPress={() => router.replace(`/(auth)/`)}
            style={{
              backgroundColor: Colors.Primary,
              padding: 10,
              borderRadius: 6,
              width: "48%",
            }}
          >
            <Text
              style={{
                color: Colors.White,
                fontSize: 18,
                textAlign: "center",
                fontFamily: "default",
              }}
            >
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginAlert;
