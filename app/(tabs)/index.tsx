import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Colors, SliderImages } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { CategorySection, ProductCard, Slider } from "@/components";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import { IProduct } from "@/types";

const index = () => {
  const details: any = useSelector((state: RootState) => state.user.details);
  const [onwer, setonwer] = useState<boolean>(details.isShopOwner);
  const authState = useSelector((state: RootState) => state.user.authState);
  const allProducts = useSelector((state: RootState) => state.product.products);
  const navigation = useNavigation();
  // Home Screen Layout Effect
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleStyle: {
        display: "none",
      },
      headerLeft: () => (
        <View
          style={{
            backgroundColor: Colors.Bg,
            marginLeft: 10,
            padding: 10,
            borderRadius: 6,
          }}
        >
          <Text
            style={{ color: Colors.White, fontSize: 18, fontWeight: "600" }}
          >
            Smart shop
          </Text>
        </View>
      ),
      headerRight: () => (
        <View
          style={{
            paddingRight: 10,
            flexDirection: "row",
            alignItems: "center",
            gap: 25,
          }}
        >
          {onwer ? (
            <Ionicons
              onPress={() => router.push(`/(screens)/AddProduct`)}
              size={25}
              name="add-circle-outline"
            />
          ) : null}
          
        </View>
      ),
    });
  }, []);
  return (
    <ScrollView style={{ flex: 1 }}>
      {/* Image Slider  */}
      <Slider
        infinite={true}
        delay={2000}
        containerStyle={{
          width: "96%",
          alignSelf: "center",
          marginTop: 15,
          borderRadius: 6,
        }}
        contentStyle={{ borderRadius: 6 }}
        images={SliderImages}
      />
      {/* category slider box  */}
      <CategorySection />
      {/* Product lists  */}
      <Text style={{ fontSize: 25, marginVertical: 10, textAlign: "center" }}>
        All Products
      </Text>
      <View style={{ width: "100%", alignItems: "center", marginVertical: 20 }}>
        {allProducts?.map((p: IProduct, index: number) => (
          <ProductCard key={index} p={p} />
        ))}
      </View>

      {/* shop list horizontal  */}
    </ScrollView>
  );
};

export default index;

const styles = StyleSheet.create({});
