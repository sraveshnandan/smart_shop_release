import { Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import React, { useLayoutEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { Colors, ownersButtons } from "@/constants";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = {};

const Setting = (props: Props) => {
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  // handle Link Press

  const handleLinkPress = (link: string) => {
    if (link === "") {
      return Alert.alert(
        "Alert",
        "Please wait , we are currently working on this feature. Stay tuned for next update."
      );
    }
    return router.push(link as any);
  };

  // handle logout function
  const handlelogout = async () => {
    console.log("Log out button clicked.");
    await AsyncStorage.clear();
    return router.replace(`/(auth)/`);
  };

  // Final UseLayoutEffect

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Settings Page",
    });
  }, []);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={{
          padding: 15,
          marginTop: 25,
          width: "96%",
          alignSelf: "center",
          borderRadius: 8,
          backgroundColor: Colors.White,
          flex: 1,
        }}
      >
        {/* Edit shop Button  */}

        <TouchableOpacity
          style={{
            backgroundColor: Colors.LightBg,
            marginVertical: 15,
            paddingVertical: 18,
            borderRadius: 8,
            paddingLeft: 20,
            flexDirection: "row",
            alignItems: "center",
            gap: 15,
          }}
          onPress={() =>
            router.push(`/(screens)/EditShop?shopId=${params.data}` as any)
          }
        >
          <AntDesign size={20} name="edit" color={"blue"} />
          <Text style={{ fontWeight: "600", fontSize: 20, color: "blue" }}>
            Edit Shop
          </Text>
        </TouchableOpacity>

        {ownersButtons.map((item, index) => (
          <TouchableOpacity
            style={{
              backgroundColor: Colors.LightBg,
              marginVertical: 15,
              paddingVertical: 18,
              borderRadius: 8,
              paddingLeft: 20,
            }}
            onPress={() => handleLinkPress(item.link)}
            key={index}
          >
            <Text style={{ fontWeight: "600", fontSize: 20 }}>
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Log  Out  Button  */}

        <TouchableOpacity
          style={{
            backgroundColor: Colors.LightBg,
            marginVertical: 15,
            paddingVertical: 18,
            borderRadius: 8,
            paddingLeft: 20,
            flexDirection: "row",
            alignItems: "center",
            gap: 15,
          }}
          onPress={handlelogout}
        >
          <AntDesign size={20} name="logout" color={"red"} />
          <Text style={{ fontWeight: "600", fontSize: 20, color: "red" }}>
            Log Out
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Setting;
