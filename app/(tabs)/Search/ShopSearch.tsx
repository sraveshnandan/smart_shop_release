import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useLayoutEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, screenHeight } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import { Ishop } from "@/types";
import { router, useNavigation } from "expo-router";

const Search = () => {
  const navigation = useNavigation();
  const AllProducts: any = useSelector((state: RootState) => state.shop.shops);
  const AllUser: any = useSelector((state: RootState) => state.user.users);
  const [products, setProducts] = useState<Ishop[] | []>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const [refressing, setrefressing] = useState(false);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setLoading(true);
    const filteredProducts = AllProducts.filter((product: Ishop) =>
      product?.name?.toLowerCase().includes(value.toLowerCase())
    );

    setLoading(false);
    setProducts(filteredProducts);
  };

  // handle refress
  const onRefress = useCallback(() => {
    setrefressing(true);
    setTimeout(() => {
      setrefressing(false);
    }, 2000);
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Search Shops",
      headerBackTitleVisible: true,
      headerTitleStyle: {
        fontFamily: "default",
      },

      headerLeft: () => (
        <Ionicons
          name="chevron-back-circle-outline"
          size={25}
          style={{ marginRight: 25 }}
          onPress={() => router.push("/(tabs)/Search/")}
        />
      ),
    });

    setProducts(AllProducts);
  }, [AllProducts]);
  return loading ? (
    <View style={{ flex: 1, backgroundColor: "red", borderWidth: 2 }}>
      <ActivityIndicator color={Colors.Primary} size={"large"} />
    </View>
  ) : (
    <SafeAreaView
      style={{
        flex: 1,
        borderColor: "blue",
        paddingHorizontal: 10,
      }}
    >
      <View
        style={{
          backgroundColor: Colors.White,
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
          width: "95%",
          alignSelf: "center",
          padding: 8,
          borderRadius: 6,
          marginTop: -20,
          marginBottom: 10,
          overflow: "hidden",
          justifyContent: "center",
        }}
      >
        <Ionicons name="search-sharp" size={30} />
        <TextInput
          style={{
            overflow: "hidden",
            width: "90%",
            padding: 5,
            fontSize: 16,
            fontWeight: "600",
            fontFamily: "default",
          }}
          value={searchQuery}
          onChangeText={(value) => handleSearch(value)}
          placeholder="Search products"
        />
      </View>
      <ScrollView
        contentContainerStyle={{ alignItems: "center" }}
        showsVerticalScrollIndicator={false}
      >
        <RefreshControl
          tintColor={Colors.Primary}
          title="Refressing..."
          titleColor={Colors.Primary}
          refreshing={refressing}
          onRefresh={onRefress}
        />
        {/* Search Bar  */}

        {/* Product List Title  */}

        <Text
          style={{ fontSize: 28, marginVertical: 15, fontFamily: "default" }}
        >
          All Shops
        </Text>

        {/* Product List  */}
        {AllProducts &&
          products.map((p: Ishop, index: number) => (
            <View
              style={{
                width: "90%",
                borderWidth: 2,
                marginVertical: 15,
                borderRadius: 6,
                padding: 8,
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                backgroundColor: Colors.White,
                height: screenHeight * 0.2,
                borderColor: Colors.Primary,
              }}
              key={index}
            >
              {/* Owner Image  */}
              <View
                style={{
                  width: "35%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {p.owner?.avatar.url !== "" ? (
                  <Image
                    style={{
                      width: 100,
                      height: 100,
                      resizeMode: "contain",
                      borderRadius: 55,
                      borderColor: Colors.Primary,
                      borderWidth: 2,
                    }}
                    source={{ uri: p.owner?.avatar?.url }}
                  />
                ) : (
                  <View
                    style={{
                      width: 100,
                      height: 100,
                      borderWidth: 2,
                      borderColor: Colors.Primary,
                      borderRadius: 55,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons
                      name="storefront-sharp"
                      color={"#444"}
                      size={75}
                    />
                  </View>
                )}
              </View>

              {/* Shop details  */}

              <View
                style={{
                  width: "62%",
                  height: "100%",
                  backgroundColor: "#e5f8f7",
                  padding: 4,
                  borderRadius: 6,
                }}
              >
                {/* Shop name  */}
                <Text
                  style={{
                    fontSize: 20,
                    textAlign: "center",
                    fontWeight: "600",
                    color: Colors.Primary,
                    fontFamily: "default",
                  }}
                >
                  {p.name?.substring(0, 20)}
                </Text>

                {/* Shop address  */}
                <Text
                  style={{
                    fontSize: 12,
                    textAlign: "center",
                    fontWeight: "600",
                    color: "#444",
                    fontFamily: "default",
                  }}
                >
                  {p.address?.substring(0, 30)}
                </Text>
                {/* Shop CTA  */}
                <TouchableOpacity
                  style={{
                    alignSelf: "center",
                    backgroundColor: Colors.Primary,
                    paddingVertical: 10,
                    width: "60%",
                    borderRadius: 6,
                    position: "absolute",
                    bottom: 2,
                  }}
                  onPress={() =>
                    router.push(
                      `/(screens)/Shopdetails?shopId=${p._id}&name=${p.name}` as any
                    )
                  }
                >
                  <Text
                    style={{
                      textAlign: "center",
                      fontWeight: "600",
                      fontSize: 16,
                      color: Colors.White,
                      fontFamily: "default",
                    }}
                  >
                    View More
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Search;

const styles = StyleSheet.create({});
