import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { router, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { gql } from "graphql-request";
import { gql_client } from "@/utils";

type Props = {};

const ForgotPassword = (props: Props) => {
  const navigation = useNavigation();
  const [email, setemail] = useState("");
  const [serverData, setserverData] = useState<any>({});
  const [userOtp, setuserOtp] = useState("");
  const [newPassword, setnewPassword] = useState("");
  const [confNewPassword, setconfNewPassword] = useState("");
  const [otpstate, setotpstate] = useState(false);
  const [modeOpen, setmodeOpen] = useState(false);
  const [hide, sethide] = useState(false);
  const [loading, setloading] = useState(false);

  const handleSendOtp = async () => {
    if (email === "") {
      return Alert.alert("warning", "Email is required.");
    }
    setloading(true);
    const query = gql`
      mutation ForgotPassword($em: String!) {
        forgotPassword(email: $em) {
          otp
          token
        }
      }
    `;
    const variables = {
      em: email,
    };

    gql_client
      .request(query, variables)
      .then((resp: any) => {
        setloading(false);
        if (resp.forgotPassword) {
          setserverData(resp.forgotPassword);
          setmodeOpen((prev) => !prev);
          return Alert.alert("Success", `OTP sent to : ${email}`);
        }
      })
      .catch((err: any) => {
        setloading(false);
        return Alert.alert("Error", "Something went wrong.");
      });
  };

  const handleverifyOTP = async () => {
    if (userOtp.length < 6) {
      return Alert.alert("Error", "Invalid OTP.");
    }
    if (userOtp.toString() === serverData.otp.toString()) {
      setotpstate(prev=> !prev)
      return Alert.alert("Success", "OTP matched");
    } else {
      return Alert.alert("Error", "Incorrect OTP.");
    }
  };

  const handleChangePassword = async () => {

    if (newPassword !== confNewPassword) {
      return Alert.alert("Error", "Password not matched, try again.")
    }
    setloading(true);
    const query = gql`
      mutation ResetPassword($resetPasswordData: resetPasswordInput) {
        resetPassword(data: $resetPasswordData)
      }
    `;

    const variables = {
      resetPasswordData: {
        email,
        token: serverData.token,
        newPassword,
      },
    };

    gql_client
      .request(query, variables)
      .then((resp: any) => {
        setloading(false);
        if (resp.resetPassword) {
          setmodeOpen((prev) => !prev);
          return Alert.alert("Success", `${resp.resetPassword}`);
        }
      })
      .catch((err: any) => {
        setloading(false);
        console.log(err)
        return Alert.alert("Error", "Something went wrong.");
      });
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle:"Reset your password",
      headerBackButtonVisible:true
    })
  }, []);

  console.log(serverData);
  return modeOpen ? (
    <Modal
      style={{ paddingVertical: 20 }}
      hardwareAccelerated={true}
      animationType="slide"
    >
      <SafeAreaView
        style={{
          flex: 1,
          borderWidth: 2,
          alignItems: "center",
          paddingHorizontal: 5,
        }}
      >
        {loading && (
          <View
            style={{
              position: "absolute",
              top: "50%",
              zIndex: 100,
              backgroundColor: Colors.White,
              padding: 20,
              borderRadius: 6,
              shadowColor: "#888",
              shadowOffset: { width: 10, height: 10 },
              shadowOpacity: 0.5,
            }}
          >
            <ActivityIndicator size={"large"} color={Colors.Primary} />
          </View>
        )}
        {/* header  */}
        <View
          style={{
            width: "100%",
            backgroundColor: "#e0e0e0",
            marginTop: 22,
            paddingHorizontal: 15,
            paddingVertical: 10,
            flexDirection: "row",
            alignItems: "center",
            borderRadius: 6,
          }}
        >
          <Ionicons
            name="backspace-outline"
            size={25}
            color={"red"}
            onPress={() => setmodeOpen((prev) => !prev)}
          />
          <Text style={{ textAlign: "center", flexGrow: 1, fontSize: 18 }}>
            Change your password
          </Text>
        </View>

        {otpstate ? (
          <View
            style={{
              width: "90%",
              borderWidth: 1,
              marginTop: 50,
              borderRadius: 8,
              borderColor: Colors.Primary,
            }}
          >
            <Text
              style={{
                fontSize: 25,
                color: Colors.Primary,
                textAlign: "center",
                marginVertical: 20,
              }}
            >
              Reset your password
            </Text>
            {/* Password input box  */}
            <View
              style={{
                width: "90%",
                alignSelf: "center",
                marginTop: 20,
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: Colors.LightBg,
                borderRadius: 6,
                paddingRight: 5,
              }}
            >
              <TextInput
                style={{
                  width: "90%",
                  padding: 15,
                  backgroundColor: Colors.LightBg,
                  borderRadius: 6,
                  alignSelf: "center",
                  fontSize: 18,
                  fontWeight: "600",
                }}
                placeholder="Enter new password"
                placeholderTextColor={"#888"}
                value={newPassword}
                onChangeText={setnewPassword}
                secureTextEntry={hide}
              />
              <Ionicons
                onPress={() => sethide((prev) => !prev)}
                name={hide ? "eye-off-outline" : "eye-outline"}
                size={25}
              />
            </View>

            {/* Conferm password input box  */}

            <View
              style={{
                width: "90%",
                alignSelf: "center",
                marginTop: 20,
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: Colors.LightBg,
                borderRadius: 6,
                paddingRight: 5,
              }}
            >
              <TextInput
                style={{
                  width: "90%",
                  padding: 15,
                  backgroundColor: Colors.LightBg,
                  borderRadius: 6,
                  alignSelf: "center",
                  fontSize: 18,
                  fontWeight: "600",
                }}
                placeholder="Conferm new password"
                placeholderTextColor={"#888"}
                value={confNewPassword}
                onChangeText={setconfNewPassword}
                secureTextEntry={hide}
              />
              <Ionicons
                onPress={() => sethide((prev) => !prev)}
                name={hide ? "eye-off-outline" : "eye-outline"}
                size={25}
              />
            </View>

            {/* Final Password Change Button  */}

            <TouchableOpacity
              style={[
                {
                  backgroundColor: Colors.Primary,
                  width: "90%",
                  alignSelf: "center",
                  marginVertical: 25,
                  paddingVertical: 15,
                  borderRadius: 6,
                },
                loading ? { backgroundColor: "#888" } : {},
              ]}
              disabled={loading}
              onPress={handleChangePassword}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "600",
                  color: Colors.White,
                  textAlign: "center",
                }}
              >
                {loading ? "Please wait..." : "Change Password"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{
              width: "90%",
              alignSelf: "center",
              marginTop: 30,
              alignItems: "center",
            }}
          >
            <Text
              style={{ fontSize: 25, fontWeight: "600", color: Colors.Primary }}
            >
              Enter OTP
            </Text>

            <TextInput
              style={{
                width: "60%",
                padding: 15,
                fontSize: 22,
                backgroundColor: Colors.LightBg,
                textAlign: "center",
                borderRadius: 6,
                marginVertical: 20,
                fontWeight: "600",
              }}
              keyboardType="number-pad"
              maxLength={6}
              placeholder="OTP"
              placeholderTextColor={"#888"}
              value={userOtp}
              onChangeText={setuserOtp}
            />

            <TouchableOpacity
              style={[
                {
                  width: "60%",
                  backgroundColor: Colors.Primary,
                  borderRadius: 6,
                  paddingVertical: 15,
                },
                loading ? { backgroundColor: "#888" } : {},
              ]}
              disabled={loading}
              onPress={handleverifyOTP}
            >
              <Text
                style={{
                  fontSize: 20,
                  textAlign: "center",
                  color: Colors.White,
                  fontWeight: "600",
                }}
              >
                {loading ? "Please wait..." : " Verify OTP"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  ) : (
    <SafeAreaView
      style={{
        flex: 1,

        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.LightBg,
      }}
    >
      {loading && (
        <View
          style={{
            position: "absolute",
            top: "50%",
            zIndex: 100,
            backgroundColor: Colors.White,
            padding: 20,
            borderRadius: 6,
            shadowColor: "#888",
            shadowOffset: { width: 10, height: 10 },
            shadowOpacity: 0.5,
          }}
        >
          <ActivityIndicator size={"large"} color={Colors.Primary} />
        </View>
      )}
      <View
        style={{
          borderWidth: 1,
          width: "90%",
          backgroundColor: Colors.White,
          paddingVertical: 10,
          borderRadius: 8,
          paddingHorizontal: 10,
          borderColor: Colors.Primary,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: 25,
            fontWeight: "600",
            marginVertical: 25,
          }}
        >
          Reset your password
        </Text>
        <TextInput
          value={email}
          onChangeText={setemail}
          placeholder="Email address"
          placeholderTextColor={"#888"}
          keyboardType="email-address"
          style={{
            width: "96%",
            alignSelf: "center",
            backgroundColor: Colors.LightBg,
            padding: 15,
            borderRadius: 6,
            fontSize: 18,
            fontWeight: "600",
          }}
        />

        {/* Otp send Button  */}

        <TouchableOpacity
          style={[
            {
              marginVertical: 15,
              width: "96%",
              alignSelf: "center",
              backgroundColor: Colors.Primary,
              paddingVertical: 15,
              borderRadius: 6,
            },
            loading ? { backgroundColor: "#444" } : {},
          ]}
          disabled={loading}
          onPress={handleSendOtp}
        >
          <Text
            style={{
              fontSize: 20,
              textAlign: "center",
              fontWeight: "600",
              color: Colors.White,
            }}
          >
            {loading ? "Please wait..." : " Send OTP"}
          </Text>
        </TouchableOpacity>

        {/* Login Button  */}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "96%",
            alignSelf: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "500" }}>Back to</Text>
          <TouchableOpacity onPress={() => router.push(`/(auth)/`)}>
            <Text
              style={{ color: Colors.Primary, fontSize: 20, fontWeight: "600" }}
            >
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPassword;
