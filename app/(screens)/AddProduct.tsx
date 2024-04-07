import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  Modal,
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
import { Ionicons } from "@expo/vector-icons";
import { Colors, screenWidth } from "@/constants";
import * as ImagePicker from "expo-image-picker";
import DropDown from "@/components/shared/DropDownPicker";
import { ProductPreview } from "@/components";
import { fetchAllProducts, uploadImagesToCloudinary } from "@/utils/actions";
import { gql } from "graphql-request";
import { gql_client, token } from "@/utils";
import { setProducts } from "@/redux/reducers/product.reducer";
import { router } from "expo-router";
import { IProduct, Ishop } from "@/types";

const AddProduct = () => {
  const dispatch = useDispatch();
  const user: any = useSelector((state: RootState) => state.user.details);
  const AllProduct = useSelector((state: RootState) => state.product.products);
  const AllCategory = useSelector((state: RootState) => state.product.category);
  const AllShops: any = useSelector((state: RootState) => state.shop.shops);
  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");
  const [o_price, seto_price] = useState("");
  const [d_price, setd_price] = useState("");
  const [images, setimages] = useState<
    { public_id: string; url: string }[] | []
  >([]);
  const [extras, setextras] = useState<{ name: string; value: string }[]>([
    { name: "", value: "" },
  ]);
  const [uri, seturi] = useState<string[]>([]);
  const [category, setcategory] = useState<string[] | []>([]);

  const [modelOpen, setmodelOpen] = useState(false);
  const [dummyProduct, setdummyProduct] = useState({});
  const [loading, setloading] = useState(false);
  const [shopOwner, setshopOwner] = useState<string>(
    AllShops?.filter(
      (s: any) => s.owner._id.toString() === user._id.toString()
    )[0]._id
  );

  // Image selection function

  const handleImagePress = async () => {
    const { status } = await ImagePicker.getCameraPermissionsAsync();
    if (status === "undetermined" || status === "denied") {
      await ImagePicker.requestCameraPermissionsAsync();
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [1, 1],
      quality: 1,
      allowsEditing: true,
    });
    if (!result.canceled) {
      if (result.assets.length < 5 && uri.length < 5) {
        result.assets.forEach((i) => seturi((prev) => [...prev, i.uri]));
      } else {
        return Alert.alert(
          "Warning",
          "You can only add five images to a product."
        );
      }
    }
  };

  // handling category change
  const handlecategorySelect = (cat: string[]) => {
    setcategory(cat);
    console.log("hi real one ", cat);
  };

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

  // final useLayoutEffect

  // handle preview function

  const handlepreviewfunction = () => {
    console.log("Preview function started.");
    // Input validation
    if (
      title === "" ||
      description === "" ||
      o_price === "" ||
      d_price === "" ||
      category.length === 0 ||
      extras.length === 0
    ) {
      return Alert.alert("Input error", "All fields are required.");
    } else if (uri.length === 0) {
      return Alert.alert(
        "Please choose at least single image for your product."
      );
    } else if (category.length === 0) {
      return Alert.alert(
        "Please choose at least single category for your product."
      );
    }
    const data = {
      title,
      description,
      uri,
      category,
      o_price,
      d_price,
      extras,
      owner: user._id,
    };
    setdummyProduct(data);
    setmodelOpen(true);
  };

  const handleProductUpload = async () => {
    setloading(true);
    uploadImagesToCloudinary(uri)
      .then((res: any) => {
        setloading(false);
        console.log("Image upload responce", res);
        const query = gql`
          mutation CreatePRoductFunction($productData: ProductInput) {
            createProduct(data: $productData) {
              message
              data {
                _id
                title
                description
                images {
                  url
                }
                original_price
                discount_price
                category {
                  _id
                  name
                }
                owner {
                  _id
                  name
                  address
                  owner {
                    _id
                    avatar {
                      url
                    }
                  }
                }
                views
                ratings
                likes {
                  _id
                }
                extra {
                  name
                  value
                }
              }
            }
          }
        `;

        const variables = {
          productData: {
            title: title,
            description: description,
            images: res,
            category: category,
            original_price: Number(o_price),
            discount_price: Number(d_price),
            extra: extras,
            owner: shopOwner,
          },
        };
        setloading(true);
        gql_client
          .setHeader("token", token)
          .request(query, variables)
          .then(async (resp: any) => {
            if (resp.createProduct) {
              setloading(false);
              console.log("product created", resp.createProduct);
              Alert.alert("Success", "Product created successfully.");
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
      })
      .catch((e) => {
        setloading(false);
        console.log("Unable to upload images", e);
        return Alert.alert("Error", "Unable to upload images.");
      });
  };

  // Final UselayoutEffect
  useLayoutEffect(() => {
    console.log("original owner", shopOwner);
  }, []);

  // Final return satement
  return !modelOpen ? (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
      }}
    >
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
          <ScrollView horizontal style={{ width: screenWidth * 1 }}>
            {uri &&
              uri.map((i, index) => (
                <Image
                  style={{
                    width: screenWidth * 0.98,
                    height: 360,
                    resizeMode: "contain",
                    borderWidth: 2,
                    alignSelf: "center",
                    marginRight: 5,
                    marginLeft: 3,
                    borderRadius: 20,
                  }}
                  key={index}
                  source={{ uri: i }}
                />
              ))}
          </ScrollView>
          <TouchableOpacity
            style={{
              backgroundColor: Colors.Link,
              width: 35,
              height: 35,
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              marginTop: 10,
              borderRadius: 8,
            }}
            onPress={handleImagePress}
          >
            <Ionicons size={25} name="add-sharp" />
          </TouchableOpacity>
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
            placeholder=" ₹35999"
            keyboardType="numeric"
            placeholderTextColor={Colors.DarkBg}
            value={o_price}
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
            placeholder="₹25990"
            keyboardType="numeric"
            placeholderTextColor={Colors.DarkBg}
            value={d_price}
            onChangeText={setd_price}
          />
        </View>

        {/* Category  */}

        <View style={{ width: "100%" }}>
          <DropDown
            onselectCategory={handlecategorySelect}
            items={AllCategory}
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
            onPress={handlepreviewfunction}
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
  ) : (
    <Modal animationType="slide">
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: Colors.LightBg,
          position: "relative",
        }}
      >
        <View
          style={{
            backgroundColor: Colors.LightBg,
            paddingHorizontal: 10,
            paddingVertical: 10,
            flexDirection: "row",
            width: "100%",
          }}
        >
          <Ionicons
            name="close-sharp"
            size={25}
            color={"red"}
            style={{
              backgroundColor: Colors.White,
              width: 25,
              borderRadius: 55,
              marginRight: 80,
            }}
            onPress={() => setmodelOpen(false)}
          />

          <Text
            style={{
              alignSelf: "center",
              width: "100%",
              fontSize: 18,
              fontWeight: "600",
            }}
          >
            Publish your product
          </Text>
        </View>
        {loading && (
          <View
            style={{
              width: 100,
              height: 100,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: Colors.White,
              position: "absolute",
              top: "42%",
              zIndex: 100,
              left: "40%",
              borderRadius: 8,
            }}
          >
            <ActivityIndicator size={"large"} color={Colors.Primary} />
          </View>
        )}
        <ProductPreview p={dummyProduct} />

        <TouchableOpacity
          disabled={loading}
          onPress={handleProductUpload}
          style={[
            {
              backgroundColor: Colors.Primary,
              paddingVertical: 15,
              width: "90%",
              alignSelf: "center",
              borderRadius: 8,
              marginVertical: 30,
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              justifyContent: "center",
            },
            loading ? { backgroundColor: "#555" } : null,
          ]}
        >
          <Ionicons name="cloud-upload-sharp" size={25} color={"red"} />
          <Text
            style={{
              textAlign: "center",
              fontSize: 20,
              color: "#fff",
              fontWeight: "600",
            }}
          >
            {loading ? "please wait..." : "Publish now"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </Modal>
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
