import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import { Colors, screenWidth } from "@/constants";
import { fetchAllProducts } from "@/utils/actions";
import { gql } from "graphql-request";
import { gql_client, token } from "@/utils";
import { setProducts } from "@/redux/reducers/product.reducer";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { IProduct, Ishop } from "@/types";
import { Ionicons } from "@expo/vector-icons";

const AddProduct = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const params: any = useLocalSearchParams();
  const user: any = useSelector((state: RootState) => state.user.details);
  const AllCategory = useSelector((state: RootState) => state.product.category);
  const AllShops: any = useSelector((state: RootState) => state.shop.shops);
  const AllProducts = useSelector((state: RootState) => state.product.products);

  const prd = AllProducts?.find(
    (p: IProduct) => p._id.toString() === params.data.toString()
  );
  const [product, setproduct] = useState<IProduct | null>(null);
  const [title, settitle] = useState(prd?.title);
  const [description, setdescription] = useState(prd?.description);
  const [o_price, seto_price] = useState(String(prd?.original_price));
  const [d_price, setd_price] = useState(String(prd?.discount_price));
  const [images, setimages] = useState<
    { public_id: string; url: string }[] | any[]
  >(prd?.images);
  const [extras, setextras] = useState<
    { name: string; value: string }[] | undefined
  >(prd?.extra);
  const [modelOpen, setmodelOpen] = useState(false);
  const [dummyProduct, setdummyProduct] = useState({});
  const [loading, setloading] = useState(false);
  const [shopOwner, setshopOwner] = useState<string>();

  // handle extra fields operations
  const handleChangeText = (text: string, index: number, field: any) => {
    const newData: any = [...extras];
    newData[index][field] = text;
    setextras(newData);
  };
  const handleAddField = () => {
    setextras([...extras, { name: "", value: "" }]);
  };
  const handleRemoveField = (index: number) => {
    const newData = [...extras];
    newData.splice(index, 1);
    setextras(newData);
  };
  const handleProductUpload = async () => {
    if (
      title === "" ||
      description === "" ||
      o_price === "" ||
      d_price === ""
    ) {
      return Alert.alert("Error", "All fields are required.");
    }
    setloading(true);
    const query = gql`
      mutation UpdateProduct($productData: ProductInput) {
        updateProduct(data: $productData) {
          message
          data {
            _id
            title
            description
            discount_price
            original_price
          }
        }
      }
    `;
    const variables = {
      productData: {
        id: prd?._id,
        title: title,
        description: description,
        original_price: Number(o_price),
        discount_price: Number(d_price),
        extra: extras,
        owner: shopOwner,
      },
    };
    setloading(true);

    console.log("payload", variables.productData);
    gql_client
      .setHeader("token", token)
      .request(query, variables)
      .then(async (resp: any) => {
        setloading(false);
        if (resp.updateProduct) {
          setloading(false);
          console.log("product Updated", resp.updateProduct);
          Alert.alert("Success", "Product Updated successfully.");
          await fetchAllProducts((p: IProduct[]) => {
            setloading(false);
            dispatch(setProducts(p));
            router.replace("/(tabs)/");
          });
        }
      })
      .catch((e: any) => {
        setloading(false);
        console.log("Product create error", e);
        return Alert.alert("Error", "Something went wrong.");
      });
  };

  // handleing product delete function
  const handledelete = async () => {
    Alert.alert(
      "Warning",
      `Do you want to delete : ${prd?.title}`,
      [
        {
          text: "No",
          onPress: () => {
            return;
          },
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            console.log("User requested to delete product.");
            // Delete Product Function
            const query = gql`
              mutation deleteProduct($pId: ID!) {
                deleteProduct(productId: $pId)
              }
            `;
            const variables = {
              pId: prd?._id,
            };

            gql_client
              .request(query, variables)
              .then((resp: any) => {
                if (resp.deleteProduct) {
                   Alert.alert("Success", `${resp.deleteProduct}`);
                   return router.push(`/(tabs)/`)
                }
              })
              .catch((err: any) => {
                console.log("error from delete product request", err);
                return Alert.alert(
                  "Error",
                  `Error occured while deleting: ${prd?.title}`
                );
              });
          },
        },
      ],
      { cancelable: false }
    );
  };
  // Final useLayoutEffect

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: ` Edit ${prd?.title}`,
      headerRight: () => (
        <Ionicons
          onPress={handledelete}
          name="trash-bin-outline"
          color={"red"}
          size={25}
        />
      ),
    });
    const userShop = AllShops.find(
      (s: Ishop) => s.owner?._id.toString() === user._id.toString()
    );
    setshopOwner(userShop._id);
    const p = AllProducts?.find(
      (p: IProduct) => p._id.toString() === params.data.toString()
    );
    setproduct(p!);
  }, []);

  // Final return satement
  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
      }}
    >
      {loading && (
        <View
          style={{
            position: "absolute",
            top: "50%",
            zIndex: 100,
            backgroundColor: "#E2E8F0",
            padding: 15,
            borderRadius: 8,
          }}
        >
          <ActivityIndicator size={"large"} color={Colors.Primary} />
        </View>
      )}
      <ScrollView
        style={{ width: "100%" }}
        contentContainerStyle={{ alignItems: "center" }}
      >
        {/* Image Box  */}
        <Text
          style={{
            marginBottom: 10,
            fontSize: 20,
            alignSelf: "flex-start",
            paddingLeft: 15,
          }}
        >
          Product Images:
        </Text>
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            backgroundColor: Colors.White,
            borderRadius: 8,
          }}
        >
          {/* Images  */}
          <ScrollView
            horizontal
            style={{ width: screenWidth * 1 }}
            contentContainerStyle={{ alignItems: "center" }}
          >
            <Image
              style={{
                width: screenWidth,
                height: 350,
                alignSelf: "center",
              }}
              source={{ uri: prd?.images[0].url }}
            />
          </ScrollView>
        </View>

        {/* Product Title  */}
        <View
          style={{
            width: "90%",
            marginVertical: 10,
            padding: 5,
            backgroundColor: Colors.White,
            borderRadius: 8,
          }}
        >
          <TextInput
            style={{ padding: 5, fontSize: 18, color: Colors.Primary }}
            value={title}
            onChangeText={settitle}
            placeholder="Product name"
            placeholderTextColor={Colors.DarkBg}
          />
        </View>
        {/* Product Description   */}
        <View
          style={{
            width: "90%",
            marginVertical: 10,
            padding: 5,
            backgroundColor: Colors.White,
            borderRadius: 8,
          }}
        >
          <TextInput
            style={{ padding: 5, fontSize: 18, color: Colors.Primary }}
            value={description}
            onChangeText={setdescription}
            placeholder="Product Description"
            placeholderTextColor={Colors.DarkBg}
            multiline={true}
          />
        </View>

        {/* Price  */}

        <View
          style={{
            width: "100%",

            flexDirection: "row",
            alignItems: "center",
            padding: 5,
            gap: 10,
          }}
        >
          {/* Original price  */}
          <TextInput
            style={{
              width: "50%",
              padding: 8,
              fontSize: 25,
              backgroundColor: Colors.White,
              borderRadius: 8,
            }}
            placeholder={String(o_price)}
            keyboardType="numeric"
            placeholderTextColor={Colors.DarkBg}
            value={String(o_price)}
            onChangeText={seto_price}
          />
          {/* Discount price  */}
          <TextInput
            style={{
              width: "50%",
              padding: 8,
              fontSize: 25,
              backgroundColor: Colors.White,
              borderRadius: 8,
            }}
            placeholder={String(d_price)}
            keyboardType="numeric"
            placeholderTextColor={Colors.DarkBg}
            value={String(d_price)}
            onChangeText={setd_price}
          />
        </View>

        {/* Product Specifications  */}

        <Text
          style={{
            fontSize: 20,
            alignSelf: "flex-start",
            paddingLeft: 15,
            fontWeight: "600",
            marginVertical: 10,
          }}
        >
          Product Specifications
        </Text>

        {extras.map((item, index) => (
          <View key={index} style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={item.name}
              onChangeText={(text) => handleChangeText(text, index, "name")}
            />
            <TextInput
              style={styles.input}
              placeholder="Value"
              value={item.value}
              onChangeText={(text) => handleChangeText(text, index, "value")}
            />
            <Button title="Remove" onPress={() => handleRemoveField(index)} />
          </View>
        ))}

        <Button title="Add new" onPress={handleAddField} />

        {/* Preview button  */}

        <TouchableOpacity
          style={{
            marginTop: 60,
            marginBottom: 20,
            width: "90%",
            backgroundColor: Colors.Primary,
            paddingVertical: 15,
            borderRadius: 8,
          }}
        >
          <Text
            onPress={handleProductUpload}
            style={{
              textAlign: "center",
              fontSize: 20,
              color: Colors.White,
              textTransform: "uppercase",
            }}
          >
            Preview
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddProduct;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    backgroundColor: Colors.White,
    padding: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
});
