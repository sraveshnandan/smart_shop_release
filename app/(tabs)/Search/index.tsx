import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import { ProductCard } from "@/components";
import { IProduct } from "@/types";
import { router, useNavigation } from "expo-router";

const Search = () => {
  const navigation = useNavigation();
  const AllProducts: any = useSelector(
    (state: RootState) => state.product.products
  );

  const [products, setProducts] = useState<IProduct[] | []>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setLoading(true);
    const filteredProducts = AllProducts.filter((product: IProduct) =>
      product?.title?.toLowerCase().includes(value.toLowerCase())
    );

    setLoading(false);
    setProducts(filteredProducts);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Search Products",
      headerTitleStyle: {
        fontFamily: "default",
      },
      headerRight: () => (
        <TouchableOpacity
          onPress={() => router.push(`/(tabs)/Search/ShopSearch`)}
        >
          <Text
            style={{
              color: Colors.Primary,
              marginRight: 15,
              fontWeight: "600",
            }}
          >
            find shops
          </Text>
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <Ionicons
          name="chevron-back-sharp"
          size={25}
          onPress={() => router.push(`/(tabs)/`)}
        />
      ),
    });
    setProducts(AllProducts);
  }, [AllProducts]);

  return loading ? (
    <View
      style={{
        flex: 1,
        backgroundColor: "red",
        borderWidth: 2,
      }}
    >
      <Text style={{ fontFamily: "default" }}>Loading...</Text>
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
        {/* Search Bar  */}

        {/* Product List Title  */}

        <Text
          style={{ fontSize: 28, marginVertical: 15, fontFamily: "default" }}
        >
          All Products
        </Text>

        {/* Product List  */}
        {AllProducts &&
          products.map((p: IProduct, index: number) => (
            <ProductCard p={p} key={index} />
          ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Search;

const styles = StyleSheet.create({});
