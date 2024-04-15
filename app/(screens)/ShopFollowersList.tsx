import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { IUser, Ishop } from "@/types";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Image, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants";

type Props = {};

const ShopFollowersList = (props: Props) => {
  const params: { data: IUser[] | any } = useLocalSearchParams();
  const navigation = useNavigation();
  const allShops = useSelector((state: RootState) => state.shop.shops);
  const [users, setusers] = useState<IUser[] | undefined>([]);
  const [hide, sethide] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Followers Page",
    });
    const shopss = allShops?.find(
      (s: Ishop) => s._id.toString() === params.data.toString()
    );
    console.log("shop", shopss);
    console.log("params", params);
    setusers(shopss?.followers);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, borderWidth: 2 }}>
      <FlatList
        data={users}
        renderItem={({ item }) => (
          <View
            style={{
              width: "95%",
              flexDirection: "row",
              alignItems: "center",
              padding: 5,
              backgroundColor: Colors.White,
              borderRadius: 8,
              marginVertical: 15,
            }}
          >
            <Image
              style={{
                width: 80,
                height: 80,
                resizeMode: "contain",
                borderRadius: 55,
                borderWidth: 2,
                borderColor: Colors.Primary,
              }}
              source={{ uri: item.avatar?.url }}
            />

            <View
              style={{
                flexGrow: 1,
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 25, fontWeight: "600" }}>
                {item.name}
              </Text>
              <View style={{ flexGrow: 1, alignItems: "center" }}>
                {hide ? (
                  <Text
                    style={{ fontSize: 14, fontWeight: "600", color: "#888" }}
                  >
                    {item.email?.slice(0, 4)}*******@email.com
                  </Text>
                ) : (
                  <Text
                    style={{ fontSize: 14, fontWeight: "600", color: "#888" }}
                  >
                    {item.email}
                  </Text>
                )}

                <Ionicons
                  onPress={() => sethide((prev) => !prev)}
                  name={hide ? "eye-outline" : "eye-off-outline"}
                  size={25}
                />
              </View>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default ShopFollowersList;
