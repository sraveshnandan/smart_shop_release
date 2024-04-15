import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, screenWidth } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { gql } from "graphql-request";
import { gql_client, token } from "@/utils";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import { setShops } from "@/redux/reducers/shop.reducers";
import { Ishop } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BecomeMerchant = () => {
  const dispatch = useDispatch();
  const params = useLocalSearchParams();
  const AllShops: any = useSelector((state: RootState) => state.shop.shops);
  const user: any = useSelector((state: RootState) => state.user.details);
  const shop = AllShops.find((s: Ishop) => s._id.toString() === params.shopId);
  const navigation = useNavigation();
  const [name, setname] = useState(shop?.name);
  const [descrition, setdescrition] = useState(shop?.description);
  const [loading, setloading] = useState(false);
  const [address, setaddress] = useState(shop?.address);
  const [pincode, setpincode] = useState("803101");
  const [city, setcity] = useState("Bihar sharif");
  const [links, setlinks] = useState("www.myshop.com");
  const [Images, setImages] = useState<{ public_id: string; url: string }[]>(
    shop?.images
  );

  const handleImgaePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      // Setting up form data
      const formData = new FormData();
      formData.append("file", {
        uri: result.assets[0].uri,
        type: "image/jpeg",
        name: "image.jpg",
      } as any);

      formData.append("upload_preset", "secret_app");
      setloading(true);
      console.log("upload started");
      fetch(`https://api.cloudinary.com/v1_1/dirdehr7r/upload`, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          setloading(false);
          console.log("Upload success");
          console.log("Upload successful:", data);
          const Avatar = {
            public_id: data.public_id,
            url: data.secure_url,
          };
          setImages((prev) => [Avatar]);
        })
        .catch((error: any) => {
          setloading(false);
          console.error("Upload error:", error);
        });
    } else {
      Alert.alert("Error", "No any images selected.");
      return setloading(false);
    }
  };

  const handleCreateShop = async () => {
    setloading(true);
    if (
      name === "" ||
      descrition === "" ||
      address === "" ||
      pincode === "" ||
      city === ""
    ) {
      setloading(false);
      return Alert.alert("Input error", "All fields are required.");
    } else {
      setloading(true);
      const query = gql`
        mutation UpdateShopFunction($shopData: ShopInput) {
          updateShop(data: $shopData) {
            message
            data {
              _id
              description
              name
              owner {
                name
              }
            }
          }
        }
      `;
      const variables = {
        shopData: {
          id: params.shopId,
          name: name,
          description: descrition,
          address: address,
          images: Images,
        },
      };
      setloading(true);

      console.log("payload is", variables.shopData);

      AsyncStorage.getItem("token").then(async (res: any) => {
        await gql_client
          .setHeader("token", res)
          .request(query, variables)
          .then((res: any) => {
            setloading(false);
            console.log(res);
            if (res.updateShop) {
              Alert.alert("Success", `${res.updateShop.message}`);
              return router.replace(`/(tabs)/Profile`);
            }
          })
          .catch((e: any) => {
            setloading(false);
            console.log(e);
            return Alert.alert("Error", "Something went wrong.");
          });
      }).catch((e:any)=>{
        console.log("error from edit shop page", e)
        return Alert.alert("Error", "Unable to perform this operation.")
      })
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Edit your shop",
    });
  }, []);

  console.log(Images);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Choose Shop Image  */}
        <View
          style={{
            width: "90%",
            alignSelf: "center",
            backgroundColor: Colors.LightBg,
            alignItems: "center",
            justifyContent: "center",
            height: 250,
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          {Images.length > 0 ? (
            <View style={{ width: "100%", height: 250 }}>
              <Image
                style={{
                  width: "100%",
                  height: "100%",
                  resizeMode: "center",
                }}
                source={{ uri: Images[0].url }}
              />

              <Ionicons
                size={28}
                color={"red"}
                style={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  backgroundColor: Colors.White,
                }}
                onPress={() => {
                  return Alert.alert(
                    "Warning",
                    "Do you want to update shop image.",
                    [
                      {
                        text: "NO",
                        style: "cancel",
                        onPress: () => {
                          return;
                        },
                      },
                      {
                        text: "Yes",
                        onPress: () => {
                          setImages([]);
                        },
                      },
                    ],
                    { cancelable: false }
                  );
                }}
                name="trash-outline"
              />
            </View>
          ) : (
            <View
              style={{
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: Colors.White,
                  gap: 10,
                  paddingVertical: 10,
                  paddingHorizontal: 10,
                  borderRadius: 8,
                }}
                onPress={handleImgaePick}
              >
                <Ionicons name="cloud-upload-outline" size={28} />
                <Text>Add Image</Text>
              </TouchableOpacity>

              {loading && (
                <ActivityIndicator size={"large"} color={Colors.Primary} />
              )}
            </View>
          )}
        </View>

        {/* Shop Details  */}

        <View
          style={{
            width: "90%",
            alignSelf: "center",
            marginTop: 15,
            backgroundColor: Colors.LightBg,
            paddingVertical: 5,
            paddingHorizontal: 2,
            overflow: "hidden",
            borderRadius: 6,
          }}
        >
          <TextInput
            style={{ padding: 5, fontSize: 20 }}
            placeholder="Shop name"
            value={name}
            onChangeText={setname}
          />
        </View>

        {/* Shop description  */}

        <View
          style={{
            width: "90%",
            alignSelf: "center",
            marginTop: 15,
            backgroundColor: Colors.LightBg,
            paddingVertical: 5,
            paddingHorizontal: 2,
            overflow: "hidden",
            borderRadius: 6,
          }}
        >
          <TextInput
            style={{ padding: 5, fontSize: 20 }}
            placeholder="Shop Description"
            multiline={true}
            autoCorrect={true}
            value={descrition}
            onChangeText={setdescrition}
          />
        </View>

        {/* Shop Full address  */}

        <View
          style={{
            width: "90%",
            alignSelf: "center",
            marginTop: 15,
            backgroundColor: Colors.LightBg,
            paddingVertical: 5,
            paddingHorizontal: 2,
            overflow: "hidden",
            borderRadius: 6,
          }}
        >
          <TextInput
            style={{ padding: 5, fontSize: 20 }}
            placeholder="Shop Address"
            value={address}
            onChangeText={setaddress}
          />
        </View>

        {/* Shop address  */}

        <View
          style={{
            flexDirection: "row",
            width: "90%",
            alignItems: "center",
            alignSelf: "center",
            justifyContent: "center",
            gap: 30,
          }}
        >
          <View
            style={{
              width: "45%",
              alignSelf: "center",
              marginTop: 15,
              backgroundColor: Colors.LightBg,
              paddingVertical: 5,
              paddingHorizontal: 2,
              overflow: "hidden",
              borderRadius: 6,
            }}
          >
            <TextInput
              style={{ padding: 5, fontSize: 20 }}
              placeholder="Pin code "
              value={pincode}
              onChangeText={setpincode}
            />
          </View>

          <View
            style={{
              width: "45%",
              alignSelf: "center",
              marginTop: 15,
              backgroundColor: Colors.LightBg,
              paddingVertical: 5,
              paddingHorizontal: 2,
              overflow: "hidden",
              borderRadius: 6,
            }}
          >
            <TextInput
              style={{ padding: 5, fontSize: 20 }}
              placeholder="City name"
              value={city}
              onChangeText={setcity}
            />
          </View>
        </View>

        {/* Link & Url  */}

        <View
          style={{
            width: "90%",
            alignSelf: "center",
            marginTop: 15,
            backgroundColor: Colors.LightBg,
            paddingVertical: 5,
            paddingHorizontal: 2,
            overflow: "hidden",
            borderRadius: 6,
          }}
        >
          <TextInput
            style={{ padding: 5, fontSize: 20 }}
            placeholder="Important link/url"
            value={links}
            onChangeText={setlinks}
          />
        </View>

        <View></View>

        <TouchableOpacity
          style={[
            {
              backgroundColor: Colors.Primary,
              paddingVertical: 15,
              borderRadius: 8,
              width: "90%",
              marginTop: 20,
              alignSelf: "center",
            },
            loading ? { backgroundColor: "#444" } : {},
          ]}
          disabled={loading}
          onPress={handleCreateShop}
        >
          <Text
            style={{ fontSize: 20, color: Colors.White, textAlign: "center" }}
          >
            {loading ? "Please wait" : " Update shop"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BecomeMerchant;

const styles = StyleSheet.create({});
