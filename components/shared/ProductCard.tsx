import {
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "@/constants";
import { getPercentage, gql_client, token } from "@/utils";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { IProduct, IUser, Ishop } from "@/types";
import { router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import { LikeAndUnlikeProduct } from "@/utils/actions";
import { addToWishlist } from "@/redux/reducers/user.reducer";
import { gql } from "graphql-request";
const ScreenWidth = Dimensions.get("screen").width;
const ProductCard = ({ p }: { p: IProduct }) => {
  const dispatch = useDispatch();

  // Some redux states
  const details: any = useSelector((state: RootState) => state.user.details);
  const AllUser: any = useSelector((state: RootState) => state.user.users);
  const authState: any = useSelector(
    (state: RootState) => state.user.authState
  );
  const AllWishlist: any = useSelector(
    (state: RootState) => state.user.wishlist
  );

  const allShop: any = useSelector((state: RootState) => state.shop.shops);

  // Normal UseState
  const [liked, setliked] = useState<boolean>(false);
  const [followed, setfollowed] = useState(false);
  const [owner, setowner] = useState<IUser | undefined>();
  const [unauth, setunauth] = useState(false);
  // handling like function
  const handleLike = async () => {
    if (authState) {
      if (!liked) {
        console.log(" Like function invoked.");
        LikeAndUnlikeProduct(p._id);
        dispatch(addToWishlist({ ...p }));
        setliked((prev) => !prev);
      } else {
        return Alert.alert("Alert", "Item already added to your cart.");
      }
    } else {
      Alert.alert("Info", "Please login to perform this task.");
    }
  };

  const handleFollow = async () => {
    if (!authState) {
      return Alert.alert("Warning", "Please login to perform this action.");
    }
    const query = gql`
      mutation FOLLOWANDUNFOLLOWSHOP($SHOPID: ID!) {
        followShop(shopId: $SHOPID)
      }
    `;
    const variables = {
      SHOPID: p.owner._id,
    };
    gql_client
      .setHeader("token", token)
      .request(query, variables)
      .then((res: any) => {
        console.log(res);
        if (res.followShop === "You can't follow your shop.") {
          return Alert.alert("Warning", "You can't follow your shop.");
        }
        setfollowed((prev) => !prev);
      })
      .catch((e: any) => {
        console.log(e);
      });
  };

  // Final useEffect
  useEffect(() => {
    const ind = AllWishlist.findIndex(
      (prd: IProduct) => prd._id.toString() === p._id.toString()
    );
    if (ind !== -1) {
      setliked(true);
    }
    const pOwner = AllUser.find(
      (data: IUser) => data._id.toString() === p?.owner?.owner?._id.toString()
    );
    setowner(pOwner);
    // Handling followed state
    const pshop: Ishop = allShop.find(
      (s: Ishop) => s._id.toString() === p.owner._id.toString()
    );

    if (authState) {
      const isFollowed = pshop.followers?.find(
        (u: IUser) => u._id.toString() === details._id.toString()
      );

      if (isFollowed) {
        return setfollowed(true);
      }
    }
  }, []);
  return (
    <View style={styles.productCard}>
      {/* Store Detrails  */}
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 5,
          paddingVertical: 5,
          borderBottomWidth: 2,
          marginBottom: 10,
          borderBottomColor: "#888",
        }}
      >
        <View style={{ flexDirection: "row", gap: 15, alignItems: "center" }}>
          {owner !== undefined ? (
            <Image
              style={{
                width: 40,
                height: 40,
                borderRadius: 55,
                borderColor: Colors.Primary,
                borderWidth: 2,
                padding: 2,
              }}
              source={{ uri: owner?.avatar?.url }}
            />
          ) : (
            <Ionicons
              style={{ backgroundColor: Colors.CardBg }}
              name="storefront-outline"
              size={28}
            />
          )}
          <View>
            <Text style={{ fontSize: 18, fontWeight: "600" }}>
              {p?.owner?.name?.substring(0, 15)}...
            </Text>
            <Text style={{ fontSize: 10, fontWeight: "600" }}>
              {p.owner?.address}
            </Text>
          </View>
        </View>

        {p.owner.owner?._id === details._id ? (
          <View style={{ alignItems: "center", flexDirection: "row", gap: 15 }}>
            <TouchableOpacity
              onPress={() =>
                router.push(`/(screens)/EditProduct?data=${p._id}` as any)
              }
            >
              <AntDesign name="edit" size={25} color={Colors.Primary} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[
              {
                backgroundColor: Colors.Primary,
                paddingHorizontal: 15,
                paddingVertical: 5,
                borderRadius: 4,
              },
              followed
                ? { backgroundColor: "#444" }
                : { backgroundColor: Colors.Primary },
            ]}
            onPress={handleFollow}
          >
            <Text style={{ color: Colors.White, fontWeight: "600" }}>
              {followed ? "Unfollow" : "follow"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {/* Product Image  */}
      <View
        style={{
          width: "100%",
          height: 250,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: Colors.White,
          borderRadius: 6,
        }}
      >
        {p.images.length ? (
          <Image
            style={{ width: "100%", height: "100%", resizeMode: "contain" }}
            source={{ uri: p.images[0].url }}
          />
        ) : (
          <Ionicons name="paper-plane-outline" color={"#444"} size={155} />
        )}
      </View>
      {/* Like button  */}
      <View style={{ position: "absolute", right: 10, bottom: "35%" }}>
        <TouchableOpacity onPress={handleLike}>
          {liked ? (
            <Ionicons name="cart-sharp" size={30} color={Colors.Primary} />
          ) : (
            <Ionicons name="cart-outline" size={30} color={Colors.Primary} />
          )}
        </TouchableOpacity>
      </View>
      {/* Products Details  */}
      <TouchableOpacity
        style={{
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 10,
        }}
        onPress={() =>
          router.push(`/(screens)/ProductsDetails?id=${p._id}` as any)
        }
      >
        <Text style={{ fontSize: 28, fontWeight: "600" }}>
          {p.title?.substring(0, 13)}...
        </Text>

        <Text style={{ color: "green", fontSize: 18 }}>
          {p.ratings}
          <Text style={{ fontSize: 26 }}>★</Text>
        </Text>
      </TouchableOpacity>

      {/* Price Section  */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 8,
          justifyContent: "flex-start",
          width: "100%",
          gap: 5,
        }}
      >
        <Text style={{ fontSize: 28, color: "green" }}>
          ₹{p.discount_price}
        </Text>

        <Text
          style={{
            fontSize: 18,
            color: "red",
            textDecorationLine: "line-through",
          }}
        >
          ₹{p.original_price}
        </Text>

        <Text
          style={{
            fontSize: 16,
            color: "green",
            marginLeft: 10,
          }}
        >
          {getPercentage(Number(p.original_price), Number(p.discount_price))}%
          OFF
        </Text>
      </View>

      {/* Short Description  */}
      <Text
        style={{
          borderTopWidth: 1,
          borderColor: Colors.LightBg,
          marginTop: 5,
        }}
      >
        {p.description?.substring(0, 80)}...
      </Text>
    </View>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  productCard: {
    width: ScreenWidth * 0.9,
    padding: 5,
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#888",
    borderRadius: 6,
    marginBottom: 22,
    position: "relative",
  },
  pImg: {
    width: "100%",
    height: 250,
    resizeMode: "contain",
    backgroundColor: Colors.LightBg,
    padding: 5,
    borderRadius: 6,
  },
});
