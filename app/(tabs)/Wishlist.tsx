import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, screenHeight, screenWidth } from "@/constants";
import { LoginAlert } from "@/components";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import { IProduct } from "@/types";

const Wishlist = () => {
  const AllData: any = useSelector((state: RootState) => state.user.wishlist);
  const AllProducts: any = useSelector(
    (state: RootState) => state.product.products
  );
  const user: any = useSelector((state: RootState) => state.user.details);
  const authState = useSelector((state: RootState) => state.user.authState);
  const [products, setproducts] = useState<any[]>(
    AllProducts.filter((p: any) =>
      p.likes.some((u: any) => u._id.toString() === user._id)
    )
  );
  useEffect(() => {
    console.log(
      AllProducts.filter((p: any) =>
        p.likes.some((u: any) => u._id.toString() === user._id)
      )
    );
    return () => {};
  }, [AllProducts]);

  return authState ? (
    <SafeAreaView style={{ flex: 1, borderColor: "green" }}>
      {/* Product List  */}
      <ScrollView style={{ flex: 1 }}>
        {products.length === 0 ? (
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
          <View style={{ paddingHorizontal: 10 }}>
            {products.map((p: IProduct, index) => (
              <View
                style={{
                  borderWidth: 1,
                  padding: 8,
                  alignItems: "center",
                  flexDirection: "row",
                }}
                key={index}
              >
                {/* Product Image  */}
                <Image
                  style={{
                    width: 100,
                    height: 100,
                    resizeMode: "contain",
                    borderRadius: 8,
                  }}
                  source={{ uri: p.images[0].url }}
                />

                {/* Other Details  */}
                <View style={{ borderWidth: 2, borderColor: "red" }}>
                  
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  ) : (
    <LoginAlert />
  );
};

export default Wishlist;

const styles = StyleSheet.create({});
