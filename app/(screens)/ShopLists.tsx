import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import { IUser, Ishop } from "@/types";
import { Colors } from "@/constants";
import { router } from "expo-router";

const ShopLists = () => {
  const allShops: any = useSelector((state: RootState) => state.shop.shops);
  const user: IUser | any = useSelector(
    (state: RootState) => state.user.details
  );

  const [shops, setshops] = useState();
  console.log(user);
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ alignItems: "center" }}
      style={{ borderWidth: 2, flex: 1 }}
    >
      <Text style={{ fontSize: 28, fontWeight: "600", marginBottom: 20 }}>
        Shops, you follow
      </Text>
      {user && user?.Shops?.length > 0 ? (
        <>
          {user.Shops.map((s: Ishop, index: number) => (
            <TouchableOpacity
              style={{
                width: "80%",
                borderWidth: 2,
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                backgroundColor: Colors.White,
                borderRadius: 8,
                padding: 6,
              }}
              onPress={() =>
                router.push(
                  `/(screens)/Shopdetails?shopId=${s._id}&name=${s.name}` as any
                )
              }
            >
              <Image
                style={{
                  width: 100,
                  height: 100,
                  borderWidth: 2,
                  borderColor: Colors.Primary,
                  borderRadius: 55,
                }}
                source={{ uri: s.owner?.avatar.url }}
              />

              {/* Shop Details  */}

              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "600",
                  color: Colors.Primary,
                }}
              >
                {s.name}
              </Text>

              <Text style={{ fontWeight: "600", color: "#444" }}>
                {s.address}
              </Text>
            </TouchableOpacity>
          ))}
        </>
      ) : (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ fontSize: 28, fontWeight: "600" }}>No Shops yet.</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default ShopLists;

const styles = StyleSheet.create({});
