import {
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, screenHeight, screenWidth } from "@/constants";
import { LoginAlert } from "@/components";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import { IProduct } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { getPercentage } from "@/utils";
import { router } from "expo-router";
import { LikeAndUnlikeProduct } from "@/utils/actions";
import { removeToWishlist } from "@/redux/reducers/user.reducer";

const Wishlist = () => {
  const dispatch = useDispatch();
  const AllProducts: any = useSelector(
    (state: RootState) => state.product.products
  );
  const user: any = useSelector((state: RootState) => state.user.details);
  const authState = useSelector((state: RootState) => state.user.authState);
  const wishlist: any = useSelector((state: RootState) => state.user.wishlist);
  const [products, setproducts] = useState<any[]>(wishlist);

  const [refressing, setrefressing] = useState(false);
  // handling Product wishlist delete
  const handleProductDelete = async (p: IProduct) => {
    console.log("Delete request from :" + p);
    await LikeAndUnlikeProduct(p._id)
      .then((resp: any) => {
        dispatch(removeToWishlist({ ...p }));
        setproducts((prev) =>
          prev.filter(
            (prod: IProduct) => prod._id.toString() === p._id.toString()
          )
        );
      })
      .catch((e: any) => {
        return Alert.alert("Error", "Something went wrong.");
      });
  };
  const onRefress = useCallback(() => {
    setrefressing(true);
    setproducts(wishlist);
    setrefressing(false);
  }, []);

  // Final useEffect
  useEffect(() => {
    if (authState) {
      setproducts(wishlist);
    }
    return () => {};
  }, []);
  console.log("from wishlist page", wishlist.length);
  return authState ? (
    <SafeAreaView style={{ flex: 1, borderColor: "green" }}>
      {/* Product List  */}
      <ScrollView style={{ width: screenWidth * 1 }}>
        <RefreshControl
          refreshing={refressing}
          tintColor={Colors.Primary}
          title="Refressing..."
          titleColor={Colors.Primary}
          onRefresh={onRefress}
        />
        {!products.length ? (
          <View
            style={{
              height: screenHeight * 1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: Colors.White,
            }}
          >
            <Image
              source={require("../../assets/images/empty_box.png")}
              style={{
                width: screenWidth * 0.45,
                height: screenHeight * 0.25,
                resizeMode: "contain",
              }}
            />
            <Text style={{ fontSize: 28, fontWeight: "600" }}>Empty Cart.</Text>
            <Text
              style={{ fontSize: 18, fontWeight: "500", textAlign: "center" }}
            >
              There is no items in your cart.
            </Text>
          </View>
        ) : (
          <>
            {products.map((p: IProduct, index) => (
              <View
                key={index}
                style={{
                  width: "95%",
                  alignSelf: "center",
                  borderRadius: 8,
                  flexDirection: "row",
                  marginVertical: 10,
                  backgroundColor: Colors.White,
                  padding: 8,
                }}
              >
                {/* Product Image  */}
                <Image
                  style={{ width: 100, height: 100, borderRadius: 8 }}
                  source={{ uri: p.images[0].url }}
                />

                {/* Other Details  */}
                <TouchableOpacity
                  style={{
                    borderColor: "red",
                    maxHeight: 80,
                    width: "60%",
                    gap: 5,
                    paddingLeft: 5,
                  }}
                  onPress={() => {
                    router.push(
                      `/(screens)/ProductsDetails?id=${p._id}` as any
                    );
                  }}
                >
                  <Text style={{ fontSize: 20, fontWeight: "600" }}>
                    {p.title?.substring(0, 15)}...
                  </Text>
                  <View
                    style={{
                      alignSelf: "flex-start",
                      flexDirection: "row",
                      gap: 5,
                      alignItems: "center",
                      position: "relative",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        textDecorationLine: "line-through",
                        color: "red",
                      }}
                    >
                      {" "}
                      ₹{p?.original_price}
                    </Text>
                    <Text style={{ fontSize: 18, color: "green" }}>
                      {" "}
                      ₹{p?.discount_price}
                    </Text>

                    <Text
                      style={{
                        fontSize: 10,
                        color: "green",
                      }}
                    >
                      {getPercentage(
                        Number(p?.original_price),
                        Number(p?.discount_price)
                      )}
                      % OFF
                    </Text>
                  </View>
                  <Text style={{ color: "#888" }}>
                    {" "}
                    <Ionicons name="storefront-sharp" />{" "}
                    {p.owner?.name?.substring(0, 50)}
                  </Text>
                </TouchableOpacity>

                <View
                  style={{
                    borderColor: "red",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "10%",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      backgroundColor: Colors.LightBg,
                      padding: 5,
                      borderRadius: 8,
                    }}
                    onPress={() => handleProductDelete(p)}
                  >
                    <Ionicons name="trash-bin-sharp" color={"red"} size={25} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  ) : (
    <LoginAlert />
  );
};

export default Wishlist;

const styles = StyleSheet.create({});
