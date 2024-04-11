import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { router, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, screenHeight } from "@/constants";
import { gql } from "graphql-request";
import { gql_client, token } from "@/utils";
import { Ionicons } from "@expo/vector-icons";

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

    gql_client
      .setHeader("token", token)
      .request(query, variables)
      .then((resp: any) => {
        setloading(false);
        if (resp.updatePassword) {
          router.push(`/(tabs)/Profile`);
          return Alert.alert("Success", `${resp.UpdatePassword}`);
        }
        console.log(resp);
      })
      .catch((err: any) => {
        setloading(false);
        console.log("password update function", err);
        return Alert.alert("Error", `${err}`);
      });
  };

  // Side Effects
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Update your password.",
    });
  }, []);
  return loading ? (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator color={Colors.Primary} size={"large"} />
      <Text>Please wait....</Text>
    </View>
  ) : (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        paddingVertical: screenHeight * 0.2,
      }}
    >
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
          style={{ padding: 8, fontSize: 20, fontWeight: "600", flexGrow: 1 }}
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
          style={{ padding: 8, fontSize: 20, fontWeight: "600", flexGrow: 1 }}
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
    </SafeAreaView>
  );
};

export default UpdatePassword;
