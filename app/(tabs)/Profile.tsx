import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { LoginAlert } from "@/components";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import { Colors, ProfileButtons, screenHeight } from "@/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Ishop } from "@/types";

const Profile = () => {
  const navigation = useNavigation();
  const authState = useSelector((state: RootState) => state.user.authState);
  const details: any = useSelector((state: RootState) => state.user.details);
  const allShops = useSelector((state: RootState) => state.shop.shops);
  const [shopOwner, setshopOwner] = useState(details.isShopOwner);
  const [shop, setshop] = useState<Ishop | undefined>();

  const [authType, setauthType] = useState(authState);

  // handle logout function
  const handlelogout = () => {
    console.log("Log out button clicked.");
    Alert.alert("Warning", "Logging you out.");
    AsyncStorage.removeItem("token").then((res) => {
      router.replace(`/(auth)/`);
    });
  };

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

  if (shopOwner) {
    useLayoutEffect(() => {
      const userShop = allShops!.filter(
        (s) => s.owner?._id.toString() === details._id.toString()
      );
      console.log("usershop", userShop);
      setshop(userShop[0]);

      navigation.setOptions({
        headerTitle: `${shop?.name}`,
        headerRight: () => (
          <Ionicons
            onPressIn={handlelogout}
            name="settings-sharp"
            size={25}
            style={{ marginRight: "10%" }}
            color={Colors.Primary}
            onPress={() => console.log("setting icon is pressed.")}
          />
        ),
        headerLeft: () => (
          <View
            style={{
              marginLeft: "10%",
              backgroundColor: Colors.LightBg,
              padding: 4,
              borderRadius: 6,
            }}
          >
            <Ionicons name="storefront-sharp" size={25} />
          </View>
        ),
      });
    }, []);
  }

  if (!shopOwner && authState) {
    useEffect(() => {
      navigation.setOptions({
        headerTitle: `${details.name}`,
      });
    }, []);
  }

  return authType ? (
    <>
      {shopOwner === true ? (
        <SafeAreaView style={{ flex: 1, borderWidth: 1 }}>
          {/* Shop Profile Card  */}
          <View
            style={{
              width: "95%",
              alignSelf: "center",
              backgroundColor: Colors.White,
              position: "relative",
              height: screenHeight * 0.44,
              borderRadius: 8,
              shadowColor: "#8deff4",
              shadowOffset: { width: 5, height: 5 },
              shadowOpacity: 0.43,
            }}
          >
            {/* Shop Banner Image  */}
            {!shop?.images?.length ? (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  backgroundColor: Colors.LightBg,
                }}
              >
                <Ionicons name="storefront-outline" size={200} color={"#555"} />
              </View>
            ) : (
              <Image
                style={{ width: "100%", height: 250, resizeMode: "cover" }}
                source={{ uri: shop?.images![0]?.url }}
              />
            )}

            {/* Shop Owner Image  */}
            <View
              style={{
                borderWidth: 4,
                position: "absolute",
                width: 120,
                height: 120,
                borderRadius: 100,
                overflow: "hidden",
                padding: 2,
                alignItems: "center",
                justifyContent: "center",
                top: "50%",
                zIndex: 100,
                left: 2,
                borderColor: Colors.Primary,
              }}
            >
              <Image
                style={{
                  width: 130,
                  height: 130,
                  resizeMode: "cover",
                  borderRadius: 100,
                }}
                source={{ uri: details.avatar.url }}
              />
            </View>

            {/* Shop Details  */}

            <View
              style={{
                width: "65%",
                position: "absolute",
                top: "70%",
                right: 0,
                paddingLeft: "2%",
              }}
            >
              <Text style={{ fontSize: 28, fontWeight: "600" }}>
                {shop?.name}
              </Text>
              <Text style={{ color: "#444", fontWeight: "600" }}>
                {shop?.address}
              </Text>
            </View>
          </View>

          {/* Shop stats  */}
          <View style={{ borderWidth: 1, padding: 15, marginTop: 20 }}></View>
        </SafeAreaView>
      ) : (
        // NORMAL USER PROFILE PAGE
        <ScrollView style={{ flex: 1, backgroundColor: Colors.White }}>
          {/* Profile Card  */}
          <View
            style={{
              backgroundColor: Colors.LightBg,
              width: "95%",
              paddingVertical: 10,
              paddingHorizontal: 10,
              alignSelf: "center",
              marginVertical: 10,
              borderRadius: 8,
              shadowColor: "#000",
              shadowOffset: { width: 10, height: 10 },
              shadowOpacity: 1,
              elevation: 10,
            }}
          >
            {/* User Profile Picture  */}

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {/* Profile picture  */}
              <View
                style={{
                  borderWidth: 2,
                  borderColor: Colors.Primary,
                  borderRadius: 55,
                  overflow: "hidden",
                  padding: 4,
                  width: 100,
                  height: 100,
                }}
              >
                <Image
                  style={{ width: "100%", height: "100%", borderRadius: 55 }}
                  source={{ uri: details.avatar?.url }}
                />
              </View>

              {/* User Details  */}
              <View
                style={{
                  alignItems: "flex-start",
                  width: "100%",
                  height: "100%",
                  paddingVertical: 20,
                  paddingHorizontal: 10,
                }}
              >
                <Text style={{ fontSize: 22, fontWeight: "600" }}>
                  {details.name}
                </Text>
                <Text style={{ color: "#444" }}>{details.email}</Text>
              </View>
            </View>
          </View>

          {/* Action Button  */}

          {ProfileButtons.slice(0, ProfileButtons.length - 1).map(
            (item, index: number) => (
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.LightBg,
                  width: "95%",
                  paddingVertical: 20,
                  paddingHorizontal: 10,
                  alignSelf: "center",
                  marginVertical: 10,
                  borderRadius: 8,
                  shadowColor: "#000",
                  shadowOffset: { width: 5, height: 5 },
                  shadowOpacity: 1,
                  elevation: 10,
                  flexDirection: "row",
                  alignItems: "center",
                }}
                key={index}
                onPress={() => handleLinkPress(item.link)}
              >
                <Text style={{ fontSize: 18, fontWeight: "400" }}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            )
          )}

          {/* Log out button  */}

          <TouchableOpacity
            style={{
              backgroundColor: Colors.LightBg,
              width: "95%",
              paddingVertical: 10,
              paddingHorizontal: 10,
              alignSelf: "center",
              marginVertical: 10,
              borderRadius: 8,
              shadowColor: "#000",
              shadowOffset: { width: 10, height: 10 },
              shadowOpacity: 1,
              elevation: 10,
              flexDirection: "row",
              alignItems: "center",
            }}
            onPress={handlelogout}
          >
            <Text style={{ fontSize: 18, fontWeight: "400" }}>Log out</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </>
  ) : (
    <LoginAlert />
  );
};

export default Profile;

const styles = StyleSheet.create({
  headsub: {
    borderRadius: 55,
    resizeMode: "cover",
    height: 50,
    width: 50,
    borderWidth: 2,
    borderColor: Colors.Primary,
    marginLeft: 10,
  },
  headsubs: {
    borderRadius: 55,
    resizeMode: "cover",
    height: 110,
    width: 110,
    borderWidth: 2,
    borderColor: Colors.Primary,
    marginLeft: 10,
  },
  number: {
    color: Colors.Bg,
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  follow: {
    color: Colors.Bg,
    fontSize: 15,
    textAlign: "center",
    fontWeight: "400",
  },

  add: {
    backgroundColor: "#fc03a5",
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  textadd: { textAlign: "center", color: "#fff", fontSize: 15 },
  preview: {
    backgroundColor: Colors.Primary,
    paddingHorizontal: 15,
    paddingVertical: 5,
    flexDirection: "row",
    borderRadius: 10,
  },

  text: { textAlign: "center", color: "#fff", fontSize: 18 },
});
