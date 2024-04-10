import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { useNavigation } from "@react-navigation/native";
import { Colors, SliderImages, screenWidth } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ProductCard, Slider } from "@/components";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import { IProduct, Ishop } from "@/types";
import { fetchAllProducts, fetchAllShops } from "@/utils/actions";
import { setProducts } from "@/redux/reducers/product.reducer";
import { setShops } from "@/redux/reducers/shop.reducers";
import { bulkAddWishlist } from "@/redux/reducers/user.reducer";

const index = () => {
  const dispatch = useDispatch();
  const details: any = useSelector((state: RootState) => state.user.details);
  const [onwer, setonwer] = useState<boolean>(details.isShopOwner);
  const authState = useSelector((state: RootState) => state.user.authState);
  const allProducts: any = useSelector(
    (state: RootState) => state.product.products
  );
  const allShops: any = useSelector((state: RootState) => state.shop.shops);
  const navigation = useNavigation();

  const [refressing, setrefressing] = useState(false);

  const onRefress = useCallback(async () => {
    setrefressing(true);
    await fetchAllProducts((products: IProduct[]) => {
      dispatch(setProducts(products));
    });
    await fetchAllShops((shops: Ishop[]) => {
      dispatch(setShops(shops));
    });
    setrefressing(false);
  }, []);

  // Setting user wishlist items

  const setWishlistData = () => {
    // If user is logged in
    if (details._id && allProducts) {
      const wishlistData = allProducts.filter((prd: IProduct) =>
        prd.likes.some((l: any) => l._id.toString() === details?._id.toString())
      );
      console.log("w_items", wishlistData.length);
      console.log("Adding user wishlist data.");
      dispatch(bulkAddWishlist(wishlistData));
    }
  };
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

  useEffect(() => {
    setWishlistData();
  }, [allProducts, details]);
  return (
    <ScrollView style={{ flex: 1 }}>
      <RefreshControl
        tintColor={Colors.Primary}
        title="Refreshing..."
        titleColor={Colors.Primary}
        refreshing={refressing}
        onRefresh={onRefress}
      />
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
      {/* category slider box 
      <CategorySection /> */}

      {/* shop list horizontal  */}
      <Text style={{ fontSize: 25, marginVertical: 20, textAlign: "center" }}>
        All Shops
      </Text>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal
        style={{ paddingHorizontal: 15 }}
      >
        {allShops && allShops.length > 0 ? (
          <>
            {allShops.map((s: Ishop, index: number) => (
              <View
                key={index}
                style={{
                  width: screenWidth * 0.8,
                  marginRight: 10,
                  borderRadius: 6,
                  backgroundColor: Colors.White,
                  padding: 8,
                }}
              >
                {/* Shop Image  */}

                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: Colors.LightBg,
                    borderRadius: 4,
                  }}
                >
                  <Ionicons
                    name="storefront-sharp"
                    size={150}
                    color={Colors.Primary}
                  />
                </View>

                {/* Shop Details  */}
                <View style={{ width: "100%", marginTop: 8 }}>
                  <Text style={{ fontSize: 28 }}>
                    {s.name?.substring(0, 25)}...
                  </Text>
                  <Text style={{ fontSize: 18, color: "#444" }}>
                    {s.address?.substring(0, 25)}...
                  </Text>
                  {/* Shop stats  */}

                  <View
                    style={{ flexDirection: "row", width: "100%", gap: 10 }}
                  >
                    <View
                      style={{
                        backgroundColor: Colors.LightBg,
                        width: "30%",
                        paddingVertical: 15,
                        borderRadius: 8,
                        marginTop: 4,
                      }}
                    >
                      <Text
                        style={{ color: Colors.Primary, textAlign: "center" }}
                      >
                        Products
                      </Text>
                      <Text
                        style={{
                          fontSize: 24,
                          color: "#000",
                          textAlign: "center",
                        }}
                      >
                        {s.products?.length}
                      </Text>
                    </View>

                    <View
                      style={{
                        backgroundColor: Colors.LightBg,
                        width: "30%",
                        paddingVertical: 15,
                        borderRadius: 8,
                        marginTop: 4,
                      }}
                    >
                      <Text
                        style={{ color: Colors.Primary, textAlign: "center" }}
                      >
                        followers
                      </Text>
                      <Text
                        style={{
                          fontSize: 24,
                          color: "#000",
                          textAlign: "center",
                        }}
                      >
                        {s.followers?.length}
                      </Text>
                    </View>

                    {/* Last View  */}
                  </View>
                </View>
              </View>
            ))}
          </>
        ) : null}
      </ScrollView>

      {/* Product lists  */}
      <Text style={{ fontSize: 25, marginVertical: 10, textAlign: "center" }}>
        All Products
      </Text>
      <View style={{ width: "100%", alignItems: "center", marginVertical: 20 }}>
        {allProducts?.map((p: IProduct, index: number) => (
          <ProductCard key={index} p={p} />
        ))}
      </View>
    </ScrollView>
  );
};

export default index;

const styles = StyleSheet.create({});
