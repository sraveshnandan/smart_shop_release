import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import { IUser, Ishop } from "@/types";
import { Colors } from "@/constants";
import { router } from "expo-router";

const ShopLists = () => {
  const user: IUser | any = useSelector(
    (state: RootState) => state.user.details
  );

  const [userData, setuserData] = useState<IUser | undefined>();
  useEffect(() => {
    setuserData(user);
    console.log(user.shops);
  }, [user]);
  console.log(JSON.stringify(user, null, 1));
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ alignItems: "center" }}
      style={{ flex: 1 }}
    >
      <Text style={{ fontSize: 28, fontWeight: "600", marginBottom: 20 }}>
        Shops, you follow
      </Text>
      {user && user?.shops?.length > 0 ? (
        <>
          {userData &&
            userData?.shops?.map((s: Ishop, index: number) => (
              <TouchableOpacity
                key={index}
                style={{
                  width: "96%",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                  backgroundColor: Colors.White,
                  borderRadius: 8,
                  padding: 6,
                  overflow: "hidden",
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
                  source={{ uri: s?.images![0].url }}
                />

                {/* Shop Details  */}

                <View
                  style={{
                    flexGrow: 1,
                    padding: 5,
                    height: "100%",
                    width: "60%",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 25,
                      color: Colors.Primary,
                      fontWeight: "500",
                    }}
                  >
                    {s.name?.substring(0, 15)}...
                  </Text>

                  <Text style={{ fontWeight: "600", color: "#888" }}>
                    {s.address?.substring(0, 20)}...
                  </Text>
                </View>
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
