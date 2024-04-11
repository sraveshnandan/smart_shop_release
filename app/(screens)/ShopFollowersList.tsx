import { View, Text, ScrollView, Image } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { IUser } from "@/types";
import { Colors } from "@/constants";
import { Ionicons } from "@expo/vector-icons";

type Props = {};

const ShopFollowersList = (props: Props) => {
  const params: { data: IUser[] | any } = useLocalSearchParams();
  const navigation = useNavigation();

  const [users, setusers] = useState<IUser[] | []>([]);
  const [hide, sethide] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Followers Page",
    });

    setusers(JSON.parse(params.data));
  }, []);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ alignItems: "center" }}
      style={{ flex: 1, paddingVertical: 20 }}
    >
      {users.map((u: IUser, index) => (
        <View
          key={index}
          style={{
            width: "95%",

            flexDirection: "row",
            alignItems: "center",
            padding: 5,
            backgroundColor: Colors.White,
            borderRadius: 8,
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
            source={{ uri: u.avatar?.url }}
          />

          <View
            style={{
              flexGrow: 1,
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 25, fontWeight: "600" }}>{u.name}</Text>
            <View style={{  flexGrow: 1, alignItems: "center" }}>
              {hide ? (
                <Text
                  style={{ fontSize: 14, fontWeight: "600", color: "#888" }}
                >
                  {u.email?.slice(0,4)}*******@email.com
                </Text>
              ) : (
                <Text
                  style={{ fontSize: 14, fontWeight: "600", color: "#888" }}
                >
                  {u.email}
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
      ))}
    </ScrollView>
  );
};

export default ShopFollowersList;
