import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { Colors, screenHeight } from "@/constants";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import { IProduct, IUser, Ishop } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { gql } from "graphql-request";
import { gql_client, token } from "@/utils";

type Props = {};

const Shopdetails = (props: Props) => {
  const params = useLocalSearchParams();
  const navigation = useNavigation();

  // Getting some redux state
  const allShops: any = useSelector((state: RootState) => state.shop.shops);
  const user: any = useSelector((state: RootState) => state.user.details);
  const authState: any = useSelector(
    (state: RootState) => state.user.authState
  );
  // Normal states
  const [followed, setfollowed] = useState(false);
  const [shop, setshop] = useState<Ishop | undefined>();
  const [loading, setloading] = useState(false);
  const [owner, setowner] = useState(false);

  const handleFollowState = async (shopId: string) => {
    if (authState) {
      setloading(true);
      console.log("Follow button Pressed");
      const query = gql`
        mutation FOLLOWANDUNFOLLOWSHOP($SHOPID: ID!) {
          followShop(shopId: $SHOPID)
        }
      `;
      const variables = {
        SHOPID: shop?._id,
      };
      gql_client
        .setHeader("token", token)
        .request(query, variables)
        .then((resp: any) => {
          setloading(false);
          setfollowed((prev) => !prev);
          return Alert.alert("Success", `${resp.followShop}`);
        })
        .catch((err: any) => {
          setloading(false);
          console.log(err);
          return Alert.alert("Error", "Something went wrong.");
        });
    } else {
      return Alert.alert("Warning", "Please login to perform this task.");
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `${params.name}`,
    });

    const st = allShops?.find(
      (s: Ishop) => s._id.toString() === params.shopId.toString()
    );
    setshop(st);

    const fIndex = st?.followers?.findIndex(
      (s: IUser) => s._id.toString() === user._id.toString()
    );
    if (fIndex !== -1) {
      setfollowed(true);
    }
    if (user?._id.toString() === shop?.owner?._id.toString()) {
      setowner(true);
    }
  }, [user, allShops]);
  return loading ? (
    <View>
      <ActivityIndicator size={"large"} />
    </View>
  ) : (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ alignItems: "center" }}
      style={{ flex: 1 }}
    >
      {/* SHOP DATA  */}

      {/* Shop Image  */}
      {shop && shop.images?.length! > 0 ? (
        <View
          style={{
            width: "96%",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: Colors.LightBg,
            marginVertical: 15,
            height: screenHeight * 0.35,
            borderRadius: 8,
          }}
        >
          <Image
            style={{ width: "100%", height: "100%", resizeMode: "cover" }}
            source={
              shop.images?.length! > 0
                ? { uri: shop?.images![0]!.url }
                : require("../../assets/images/empty_box.png")
            }
          />
        </View>
      ) : (
        <View
          style={{
            width: "96%",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: Colors.LightBg,
            marginVertical: 15,
            height: screenHeight * 0.35,
            borderRadius: 8,
          }}
        >
          <Ionicons name="storefront-sharp" size={180} />
        </View>
      )}

      {/* Shop details  */}
      <View
        style={{
          width: "96%",
          paddingHorizontal: 10,
          backgroundColor: Colors.White,
          alignSelf: "center",
          borderRadius: 8,
          paddingVertical: 15,
        }}
      >
        {/* Shop Name  */}
        <Text
          style={{ fontSize: 35, fontWeight: "600", color: Colors.Primary }}
        >
          {shop?.name}
        </Text>

        {/* Shop Address  */}

        <Text style={{ fontWeight: "600" }}>{shop?.address}</Text>

        <Text
          style={{
            marginTop: 15,
            fontWeight: "600",
            fontSize: 20,
            marginBottom: 10,
          }}
        >
          About the shop
        </Text>
        <Text style={{}}>{shop?.description}</Text>

        <View
          style={{
            width: "100%",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-around",
            paddingVertical: 10,
          }}
        >
          {/* shop Products length  */}
          <View
            style={{
              width: "30%",
              backgroundColor: "#d5d5d5",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 4,
              height: 75,
            }}
          >
            <Text style={{ fontSize: 16, color: Colors.Primary }}>
              Products
            </Text>
            <Text style={{ fontSize: 25 }}>{shop?.products?.length}</Text>
          </View>

          {/* shop Followers length  */}
          <View
            style={{
              width: "30%",
              backgroundColor: "#d5d5d5",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 4,
              height: 75,
            }}
          >
            <Text style={{ fontSize: 16, color: Colors.Primary }}>
              Followers
            </Text>
            <Text style={{ fontSize: 25 }}>{shop?.followers?.length}</Text>
          </View>
        </View>
      </View>

      {/* shop owner details  */}

      <Text style={{ fontSize: 28, marginVertical: 20 }}>Shop Owner</Text>
      <View
        style={{
          width: "96%",
          alignSelf: "center",
          padding: 8,
          backgroundColor: Colors.White,
          borderRadius: 8,
          flexDirection: "row",
        }}
      >
        <Image
          style={{
            width: 100,
            height: 100,
            borderWidth: 2,
            borderColor: Colors.Primary,
            borderRadius: 6,
          }}
          source={{ uri: shop?.owner?.avatar.url }}
        />

        <View
          style={{
            flexGrow: 1,
            paddingHorizontal: 8,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 26, fontWeight: "600" }}>
            {shop?.owner?.name}
          </Text>

          <Text style={{ fontSize: 16, fontWeight: "600", color: "#888" }}>
            {shop?.owner?.email}
          </Text>

          <Text>+91 {shop?.owner?.phone_no}</Text>
        </View>
      </View>

      {/* Shop Products Details  */}
      <Text style={{ fontSize: 28, marginVertical: 20 }}>
        Products from {shop?.name}
      </Text>

      {/* Product section  */}
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
          alignSelf: "center",
          justifyContent: "center",
        }}
      >
        {shop?.products?.length! > 0 ? (
          shop?.products?.map((p: IProduct, index) => (
            <TouchableOpacity
              style={{
                width: "45%",
                alignItems: "center",

                backgroundColor: Colors.White,
                borderRadius: 6,
                padding: 4,
                alignSelf: "center",
              }}
              key={index}
              onPress={() =>
                router.push(`/(screens)/ProductsDetails?id=${p._id}` as any)
              }
            >
              {/* Product Image  */}
              <Image
                style={{ width: "100%", height: 150, resizeMode: "contain" }}
                source={{ uri: p.images[0].url }}
              />

              {/* Product Details  */}
              <Text style={{ fontWeight: "600", fontSize: 20 }}>
                {p.title?.substring(0, 15)}
              </Text>
              <Text style={{ color: "green", fontSize: 18 }}>
                ₹{p.discount_price}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 25, color: "red" }}>No Products yet.</Text>
            {/* {user?._id.toString() === shop?.owner?._id.toString() ? (
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.Primary,
                  width: "100%",
                  marginVertical: 25,
                  paddingVertical: 15,
                  borderRadius: 55,
                  paddingHorizontal: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => router.push(`/(screens)/AddProduct`)}
              >
                <Ionicons name="add-sharp" size={26} color={Colors.White} />
                <Text
                  style={{
                    textAlign: "center",
                    color: Colors.White,
                    fontSize: 16,
                  }}
                >
                  Add Product
                </Text>
              </TouchableOpacity>
            ) : null} */}
          </View>
        )}
      </View>

      {/* end of code  */}
    </ScrollView>
  );
};

export default Shopdetails;

const styles = StyleSheet.create({});
