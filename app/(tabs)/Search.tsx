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
import { useNavigation } from "expo-router";

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
      headerRight: () => (
        <TouchableOpacity>
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
    });
    setProducts(AllProducts);
  }, [AllProducts]);

  return loading ? (
    <View style={{ flex: 1, backgroundColor: "red", borderWidth: 2 }}>
      LOading
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
          }}
          value={searchQuery}
          onChangeText={(value) => handleSearch(value)}
          placeholder="Search products"
        />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search Bar  */}

        {/* Product List Title  */}

        <Text style={{ fontSize: 28, marginVertical: 15 }}>All Products</Text>

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
