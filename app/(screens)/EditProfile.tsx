import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { router, useNavigation } from "expo-router";
import { Colors } from "@/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import { gql } from "graphql-request";
import { gql_client } from "@/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setUserData } from "@/redux/reducers/user.reducer";

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const details: any = useSelector((state: RootState) => state.user.details);
  const [img, setimg] = useState<string>(details?.avatar?.url);
  const [loading, setloading] = useState<boolean>(false);
  const [avatar, setavatar] = useState(details.avatar);
  const [name, setname] = useState<string>(details.name);
  const [email, setemail] = useState<string>(details.email);
  const [phone_no, setphone_no] = useState<string>(details.phone_no.toString());

  // handle image picker
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
      fetch(`https://api.cloudinary.com/v1_1/${"dirdehr7r"}/upload`, {
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
          setavatar(Avatar);
        })
        .catch((error: any) => {
          setloading(false);
          console.error("Upload error:", error);
        });
    } else {
      Alert.alert("Error", "No any images selected.");
    }
  };

  // handle profile save

  const handleProfileUpdate = async () => {
    setloading(true);
    if (phone_no === null || phone_no === "" || phone_no.length < 10) {
      Alert.alert("Alert", "Invalid phone number");
      return setloading(false);
    }
    const data = {
      name,
      email,
      phone_no,
      avatar,
    };
    const query = gql`
      mutation UpdateProfile($UserData: ProfileUpdateInput) {
        updateProfile(data: $UserData)
      }
    `;

    const variables = {
      UserData: {
        name: name,
        email: email,
        phone_no: phone_no,
        avatar: avatar,
      },
    };
    AsyncStorage.getItem("token")
      .then(async (res) => {
        gql_client.setHeader("token", res!);
        await gql_client
          .request(query, variables)
          .then((res: any) => {
            setloading(false);
            console.log("update profile responce", res);
            const olddata = details;
            const newdata = {
              ...details,
              name: name,
              email: email,
              avatar: avatar,
            };
            dispatch(setUserData({ ...newdata }));
            Alert.alert("Success", `${res.updateProfile}`);
            router.replace("/(tabs)/Profile");
          })
          .catch((e: any) => {
            setloading(false);
            Alert.alert(
              "Error",
              `Unable to update your profile at this time , please try again later.`
            );
          });
      })
      .catch((e) => {
        setloading(false);
        Alert.alert("Alert", "Something went wrong.");
      });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Edit your profile",
      headerStyle: {
        backgroundColor: Colors.LightBg,
      },
    });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, position: "relative" }}>
      {loading ? (
        <View
          style={{
            borderWidth: 1,
            position: "absolute",
            top: "40%",
            zIndex: 100,
            width: "80%",
            alignItems: "center",
            backgroundColor: "#232234",
            alignSelf: "center",
            paddingVertical: 40,
            borderRadius: 6,
          }}
        >
          <ActivityIndicator size={55} />
          <Text
            style={{ color: Colors.White, fontSize: 25, textAlign: "center" }}
          >
            {loading ? "Uploading image, plaese wait..." : null}
          </Text>
        </View>
      ) : null}
      {/* User Avatar  */}
      <View
        style={{
          alignSelf: "center",
          position: "relative",
        }}
      >
        <View
          style={{
            width: 150,
            height: 150,
            borderWidth: 2,
            borderRadius: 100,
            marginTop: 20,
            overflow: "hidden",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={
              !img ? require("../../assets/images/user.png") : { uri: img }
            }
            style={{
              width: "100%",
              height: "100%",
              resizeMode: "contain",
              borderRadius: 100,
            }}
          />
        </View>
        <View
          style={{
            backgroundColor: Colors.CardBg,
            width: 40,
            height: 40,
            position: "absolute",
            bottom: 0,
            right: 0,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 55,
            zIndex: 100,
          }}
        >
          <Ionicons
            onPress={handleImgaePick}
            size={32}
            name="cloud-upload-outline"
            color={Colors.Bg}
          />
        </View>
      </View>

      {/* User Details  */}

      {/* User full name  */}
      <View style={styles.inputContainer}>
        <TextInput
          value={name}
          onChangeText={setname}
          style={styles.input}
          placeholder={details.name}
        />
      </View>

      {/* User Email address  */}
      <View style={styles.inputContainer}>
        <TextInput
          value={email}
          onChangeText={setemail}
          style={styles.input}
          placeholder={details.email}
        />
      </View>

      {/* User Phone Number  */}
      <View style={styles.inputContainer}>
        <TextInput
          keyboardType="numbers-and-punctuation"
          style={styles.input}
          value={phone_no}
          onChangeText={setphone_no}
          placeholder={
            details.phone_no !== null
              ? details.phone_no.toString()
              : "+91 91261 26***"
          }
        />
      </View>

      <TouchableOpacity
        style={[
          {
            backgroundColor: Colors.Primary,
            width: "85%",
            alignSelf: "center",
            marginVertical: 25,
            paddingVertical: 10,
            borderRadius: 6,
          },
          loading ? { backgroundColor: Colors.DarkBg } : null,
        ]}
        disabled={loading}
        onPress={handleProfileUpdate}
      >
        <Text
          style={{ textAlign: "center", color: Colors.White, fontSize: 25 }}
        >
          {loading ? "Please wait..." : "Save Details"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: Colors.White,
    width: "85%",
    alignSelf: "center",
    marginTop: 15,
    borderRadius: 6,
    paddingVertical: 5,
  },
  input: {
    fontSize: 19,
    padding: 8,
  },
});
