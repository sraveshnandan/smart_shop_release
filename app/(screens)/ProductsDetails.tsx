import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useSelector } from "react-redux";
import { IProduct, IUser, Ishop } from "@/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { Slider } from "@/components";
import { Colors, screenWidth } from "@/constants";
import { getPercentage } from "@/utils";
import { RootState } from "@/redux/Store";
const ScreenWidth = Dimensions.get("screen").width;
const Productpage = () => {
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const Allproducts = useSelector((state: RootState) => state.product.products);
  const details: any = useSelector((state: RootState) => state.user.details);
  const allshop: any = useSelector((state: RootState) => state.shop.shops);
  const [shop, setshop] = useState<Ishop | null>(null);
  const [product, setproduct] = useState<IProduct | undefined>(undefined);
  const [pImg, setpImg] = useState<string[] | undefined>([]);
  // Final UseEffect
  useEffect(() => {
    const p: IProduct[] | any = Allproducts?.filter(
      (p) => p._id.toString() === params.id.toString()
    );
    p![0].images.forEach((p: any) => {
      pImg?.push(p.url!);
    });
    setproduct(p![0]);
    const product: IProduct = p[0];
    const ownershop: IUser = allshop.find(
      (s: Ishop) => s._id.toString() === product.owner._id.toString()
    );
    setshop(ownershop);

    navigation.setOptions({
      headerTitle: `Product Details`,
    });
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
            source={{ uri: shop?.owner?.avatar.url }}
          />
          <Text style={{ fontSize: 28, fontWeight: "600" }}>{shop?.name}</Text>
          <Text>{shop?.address}</Text>
        </View>
        {/* OtherProduct From shop  */}
        <Text style={{ marginTop: 20, paddingLeft: 15, fontSize: 25 }}>
          Other products from {shop?.name}
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ paddingHorizontal: 20, paddingVertical: 20 }}
          contentContainerStyle={{ justifyContent: "center" }}
        >
          {shop?.products
            ?.filter(
              (p: IProduct) => p._id.toString() !== product?._id.toString()
            )
            .map((pr: IProduct, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  width: screenWidth * 0.7,
                  marginRight: 15,
                  backgroundColor: Colors.White,
                  borderRadius: 8,
                  shadowColor: "#de56",
                  shadowOpacity: 0.2,
                  shadowOffset: { width: 10, height: 10 },
                }}
                onPress={() =>
                  router.push(`/(screens)/ProductsDetails?id=${pr._id}` as any)
                }
              >
                <Image
                  style={{ width: "100%", height: 180, resizeMode: "contain" }}
                  source={{ uri: pr.images[0].url }}
                />
                {/* Product details  */}
                <View
                  style={{
                    width: "100%",
                    borderTopWidth: 0.4,
                    borderTopColor: "#999",
                    overflow: "hidden",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 25,
                      fontWeight: "600",
                      marginTop: 10,
                      paddingHorizontal: 10,
                    }}
                  >
                    {pr.title?.substring(0, 20)}...
                  </Text>
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
                      ₹{pr.discount_price}
                    </Text>

                    <Text
                      style={{
                        fontSize: 18,
                        color: "red",
                        textDecorationLine: "line-through",
                      }}
                    >
                      ₹{pr.original_price}
                    </Text>

                    <Text
                      style={{
                        fontSize: 14,
                        color: "green",
                      }}
                    >
                      {getPercentage(
                        Number(pr.original_price),
                        Number(pr.discount_price)
                      )}
                      % OFF
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Productpage;

const styles = StyleSheet.create({});
