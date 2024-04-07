import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, {
  useEffect, useState
} from "react";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useSelector } from "react-redux";
import { IProduct, Ishop } from "@/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { Slider } from "@/components";
import { Colors } from "@/constants";
import { getPercentage } from "@/utils";
import { RootState } from "@/redux/Store";
const ScreenWidth = Dimensions.get("screen").width;
const Productpage = () => {
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const Allproducts = useSelector((state: RootState) => state.product.products);
  const details: any = useSelector((state: RootState) => state.user.details);
  const [owner, setowner] = useState<Ishop | null>(null);
  const [product, setproduct] = useState<IProduct | undefined>(undefined);
  const [pImg, setpImg] = useState<string[] | undefined>([]);
  // Final UseEffect
  useEffect(() => {
    const p: IProduct[] | undefined = Allproducts?.filter(
      (p) => p._id.toString() === params.id.toString()
    );
    p![0].images.forEach((p) => {
      pImg?.push(p.url!);
    });
    setproduct(p![0]);

    return () => {};
  }, []);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        width: ScreenWidth,
      }}
    >
      <ScrollView
        style={{ width: ScreenWidth }}
        showsVerticalScrollIndicator={false}
      >
        {/* Product images  */}
        <View
          style={{
            width: ScreenWidth * 0.98,
            backgroundColor: Colors.White,
            paddingVertical: 5,
          }}
        >
          <Slider
            containerStyle={{ height: 300 }}
            contentStyle={{
              height: "100%",
              resizeMode: "contain",
            }}
            images={pImg}
            dotColor={Colors.Primary}
          />
        </View>

        {/* product title  */}

        <View style={{ marginTop: 10, alignSelf: "flex-start", padding: 10 }}>
          <Text style={{ fontSize: 28, fontWeight: "600", textAlign: "left" }}>
            {product?.title}
          </Text>
        </View>

        {/* Products price  */}

        <View
          style={{
            alignSelf: "flex-start",
            padding: 10,
            flexDirection: "row",
            gap: 5,
            alignItems: "center",
            position: "relative",
          }}
        >
          <Text
            style={{
              fontSize: 28,
              textDecorationLine: "line-through",
              color: "red",
            }}
          >
            {" "}
            ₹{product?.original_price}
          </Text>
          <Text style={{ fontSize: 24, color: "green" }}>
            {" "}
            ₹{product?.discount_price}
          </Text>

          <Text
            style={{
              fontSize: 18,
              color: "green",
              marginLeft: 10,
              position: "relative",
              top: -9,
              left: -8,
            }}
          >
            {getPercentage(
              Number(product?.original_price),
              Number(product?.discount_price)
            )}
            % OFF
          </Text>
        </View>

        {/* Product Description  */}

        <View style={{ padding: 10 }}>
          <Text style={{ fontSize: 22, marginBottom: 10 }}>Description</Text>
          <Text style={{ fontSize: 18 }}>{product?.description}</Text>
          {/* Extra field Specifications  */}
          {product?.extra && (
            <>
              <Text style={{ fontSize: 22, marginVertical: 10 }}>
                Specifications
              </Text>
              {product.extra.map((item, index) => (
                <View
                  key={index}
                  style={{
                    marginBottom: 8,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingVertical: 15,
                    backgroundColor: Colors.White,
                    paddingHorizontal: 10,
                    borderRadius: 6,
                  }}
                >
                  <Text
                    style={{ color: "#444", fontWeight: "600", fontSize: 18 }}
                  >
                    {item.name} :
                  </Text>
                  <Text
                    style={{
                      color: "#000",
                      fontSize: 16,
                      fontWeight: "600",
                    }}
                  >
                    {item.value}
                  </Text>
                </View>
              ))}
            </>
          )}
        </View>

        {/* Owner Deatails  */}
        <Text style={{ fontSize: 25, paddingLeft: 10 }}>Sold by</Text>
        <View
          style={{
            marginTop: 10,
            width: ScreenWidth * 0.9,
            backgroundColor: Colors.White,
            paddingHorizontal: 10,
            paddingVertical: 15,
            borderRadius: 6,
            alignSelf: "center",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            style={{
              width: 100,
              height: 100,
              marginBottom: 8,
              borderRadius: 55,
              borderWidth: 1,
            }}
            source={
              owner !== null
                ? { uri: owner?.owner?.avatar?.url }
                : require("../../assets/images/user.png")
            }
          />
          <Text style={{ fontSize: 28, fontWeight: "600" }}>
            {product?.owner?.name}
          </Text>
          <Text>{product?.owner?.address}</Text>

          <TouchableOpacity
            style={{
              backgroundColor: Colors.Primary,
              padding: 15,
              marginVertical: 10,
              borderRadius: 55,
            }}
            onPress={() => {
              router.push(
                `/(screens)/ProductsDetails?shopId=${product?.owner?._id}&name=${product?.owner?.name}` as never
              );
            }}
          >
            <Text style={{ color: Colors.White, fontSize: 18 }}>
              View all products
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Productpage;

const styles = StyleSheet.create({});
