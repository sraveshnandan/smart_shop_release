import {
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
import { router, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { gql } from "graphql-request";
import { gql_client } from "@/utils";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import { setShops } from "@/redux/reducers/shop.reducers";

const BecomeMerchant = () => {
  const dispatch = useDispatch();
  const AllShops: any = useSelector((state: RootState) => state.shop.shops);
  const user: any = useSelector((state: RootState) => state.user.details);
  const navigation = useNavigation();
  const [name, setname] = useState("");
  const [descrition, setdescrition] = useState("");
  const [loading, setloading] = useState(false);
  const [address, setaddress] = useState("");
  const [pincode, setpincode] = useState("");
  const [city, setcity] = useState("");
  const [links, setlinks] = useState("");
  const [img, setimg] = useState("");
  const [Images, setImages] = useState([{ public_id: "", url: "" }]);

  const handleImgaePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setimg(result.assets[0].uri);
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
          setimg(data.secure_url);
          const Avatar = {
            public_id: data.public_id,
            url: data.secure_url,
          };
          setImages((prev) => [...prev, Avatar]);
        })
        .catch((error: any) => {
          setloading(false);
          console.error("Upload error:", error);
        });
    } else {
      Alert.alert("Error", "No any images selected.");
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
      return Alert.alert("Input error", "All fields are required.");
    } else {
      const query = gql`
        mutation CreateShop($shopData: ShopInput) {
          createShop(data: $shopData) {
            _id
            name
            description
          }
        }
      `;
      const variables = {
        shopData: {
          name: name,
          description: descrition,
          address: address,
          images: Images,
        },
      };
      setloading(true);
      await gql_client
        .request(query, variables)
        .then((res: any) => {
          setloading(false);
          console.log(res);
          if (res.createShop) {
            const newShop = res.createShop;
            const data = AllShops.push(newShop);
            dispatch(setShops(data));
            Alert.alert("Success", "Shop created successfully.");
            return router.replace(`/(tabs)/Profile`);
          }
        })
        .catch((e: any) => {
          setloading(false);

            return "An unknown duplicate key error occurred.";
          
        });
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Register your shop",
    });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{}} showsVerticalScrollIndicator={false}>
        {/* Choose Shop Image  */}
        <View
          style={{
            width: "90%",
            alignSelf: "center",
            backgroundColor: Colors.LightBg,
            alignItems: "center",
            justifyContent: "center",
            height: 200,
            paddingVertical: 10,
          }}
        >
          {img === "" ? (
            <>
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.White,
                  borderRadius: 8,
                  marginBottom: 10,
                }}
                onPress={handleImgaePick}
              >
                <Ionicons name="add-sharp" size={40} />
              </TouchableOpacity>
              <Text>Choose Shop Image</Text>
            </>
          ) : (
            <View
              style={{ width: "100%", height: "100%", position: "relative" }}
            >
              <Image
                style={{ width: "100%", height: "100%", resizeMode: "center" }}
                source={{ uri: img }}
              />
              <Ionicons
                onPress={() => setimg("")}
                style={{
                  position: "absolute",
                  right: 0,
                  backgroundColor: "#ffff",
                  padding: 4,
                  borderRadius: 100,
                }}
                name="trash-bin-outline"
                size={25}
                color={"red"}
              />
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
          style={{
            backgroundColor: Colors.Primary,
            paddingVertical: 15,
            borderRadius: 8,
            width: "90%",
            marginTop: 20,
            alignSelf: "center",
          }}
          onPress={handleCreateShop}
        >
          <Text
            style={{ fontSize: 20, color: Colors.White, textAlign: "center" }}
          >
            Create Shop
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BecomeMerchant;

const styles = StyleSheet.create({});
