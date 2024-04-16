import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { router, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, screenHeight } from "@/constants";
import { gql } from "graphql-request";
import { gql_client, token } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";

type Props = {};

const UpdatePassword = (props: Props) => {
  const navigation = useNavigation();
  const [oldPassword, setoldPassword] = useState("");
  const [newPassword, setnewPassword] = useState("");
  const [loading, setloading] = useState(false);

  const [hide, sethide] = useState(false);
  // handle password update function
  const handlePasswordUpdate = async () => {
    if (oldPassword === "" || newPassword === "") {
      return Alert.alert("Warning", "Please fill all fields.");
    }
    setloading(true);
    const query = gql`
      mutation UpdatePassword($passInput: PasswordInput) {
        updatePassword(data: $passInput)
      }
    `;
    const variables = {
      passInput: {
        oldPassword: oldPassword,
        newPassword: newPassword,
      },
    };

    AsyncStorage.getItem("token")
      .then((res: any) => {
        gql_client
          .setHeader("token", res)
          .request(query, variables)
          .then((resp: any) => {
            setloading(false);
            console.log("responce from update Password.");
            if (resp.updatePassword) {
              Alert.alert("Success", `Password updated successfully.`);
              return router.push(`/(tabs)/Profile`);
            }
            console.log(resp);
          })
          .catch((err: any) => {
            setloading(false);
            console.log("password update function", err);
            const errmsg = err;
            return Alert.alert("Error", `${errmsg}`);
          });
      })
      .catch((err: any) => {
        console.log("responce if token is undefined.");
        return Alert.alert("Error", "Something went wrong.");
      });
  };

  // Side Effects
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Update your password.",
    });
  }, []);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        height: screenHeight,
      }}
    >
      {loading && (
        <View
          style={{
            backgroundColor: Colors.White,
            padding: 20,
            position: "absolute",
            zIndex: 100,
            borderRadius: 8,
          }}
        >
          <ActivityIndicator size={"large"} color={Colors.Primary} />
        </View>
      )}
      <StatusBar style="inverted" />
      <KeyboardAvoidingView style={{ width: "100%", alignItems: "center" }}>
        {/* OLD password field  */}
        <View
          style={{
            width: "80%",
            padding: 5,
            backgroundColor: Colors.LightBg,
            overflow: "hidden",
            borderRadius: 8,
            borderWidth: 2,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TextInput
            style={{
              padding: 8,
              fontSize: 20,
              fontWeight: "600",
              flexGrow: 1,
            }}
            placeholder="Old Password"
            placeholderTextColor={"#666"}
            value={oldPassword}
            onChangeText={setoldPassword}
            secureTextEntry={hide}
          />
          <Ionicons
            onPress={() => sethide((prev) => !prev)}
            name={hide ? "eye-off-sharp" : "eye-sharp"}
            size={25}
          />
        </View>
        {/* NEW password field  */}
        <View
          style={{
            width: "80%",
            padding: 5,
            backgroundColor: Colors.LightBg,
            overflow: "hidden",
            borderRadius: 8,
            marginTop: 20,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TextInput
            style={{
              padding: 8,
              fontSize: 20,
              fontWeight: "600",
              flexGrow: 1,
            }}
            placeholder="New Password"
            placeholderTextColor={"#666"}
            value={newPassword}
            onChangeText={setnewPassword}
            secureTextEntry={hide}
          />
          <Ionicons
            onPress={() => sethide((prev) => !prev)}
            name={hide ? "eye-off-sharp" : "eye-sharp"}
            size={25}
          />
        </View>
        {/* Submit Button  */}
        <TouchableOpacity
          disabled={loading}
          style={[
            {
              marginVertical: 20,
              width: "80%",
              paddingVertical: 18,
              backgroundColor: Colors.Primary,
              borderRadius: 8,
            },
            loading ? { backgroundColor: "#444" } : {},
          ]}
          onPress={handlePasswordUpdate}
        >
          <Text
            style={{ textAlign: "center", fontSize: 22, color: Colors.White }}
          >
            {loading ? "Please wait..." : "Update Password"}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default UpdatePassword;
