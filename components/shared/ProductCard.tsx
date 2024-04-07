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
import { getPercentage } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { IProduct } from "@/types";
import { router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import { LikeAndUnlikeProduct } from "@/utils/actions";
import { addToWishlist } from "@/redux/reducers/user.reducer";
const ScreenWidth = Dimensions.get("screen").width;
const ProductCard = ({ p }: { p: IProduct }) => {
  const dispatch = useDispatch();
  const AllProduct: any = useSelector(
    (state: RootState) => state.product.products
  );
  const details: any = useSelector((state: RootState) => state.user.details);

  const authState: any = useSelector(
    (state: RootState) => state.user.authState
  );
  const AllWishlist: any = useSelector(
    (state: RootState) => state.user.wishlist
  );
  const [liked, setliked] = useState<boolean>(
    p.likes.some((p: any) => p._id === details._id)
  );
  const [followed, setfollowed] = useState(true);
  const [unauth, setunauth] = useState(false);

  const handleLike = async () => {
    if (authState) {
      if (!liked) {
        console.log("function may start.");
        LikeAndUnlikeProduct(p._id);
        dispatch(addToWishlist({ ...p }));
        setliked(true);
      } else {
        return Alert.alert("Alert", "Item already added to your cart.");
      }
    } else {
      Alert.alert("Info", "Please login to perform this task.");
    }
  };
  useEffect(() => {
    return () => {};
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
          paddingHorizontal: 10,
          paddingVertical: 10,
        }}
      >
        <View style={{ flexDirection: "row", gap: 15, alignItems: "center" }}>
          <Ionicons
            style={{ backgroundColor: Colors.CardBg }}
            name="storefront-outline"
            size={28}
          />
          <Text style={{ fontSize: 18, fontWeight: "600" }}>
            {p?.owner?.name}
          </Text>
        </View>

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
          onPress={() => setfollowed((prev) => !prev)}
        >
          <Text style={{ color: Colors.White, fontWeight: "600" }}>
            {followed ? "Unfollow" : "follow"}
          </Text>
        </TouchableOpacity>
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
