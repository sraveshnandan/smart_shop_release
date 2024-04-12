import { View, Text, TextInput } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {};

const forgotPassword = (props: Props) => {
  const navigation = useNavigation();
  const [email, setemail] = useState("");
  const [serverOtp, setserverOtp] = useState("");
  const [userOtp, setuserOtp] = useState("");
  const [newPassword, setnewPassword] = useState("");
  const [confNewPassword, setconfNewPassword] = useState("");
  const [otpstate, setotpstate] = useState(false)



  useLayoutEffect(() => {
    navigation.setOptions({
      headershown: true,
      headerTitle: "Reset your password",
    });
  }, []);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        borderWidth: 2,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View>
        <TextInput value={email} onChangeText={setemail} placeholder="Email address" placeholderTextColor={"#888"} />
      </View>
    </SafeAreaView>
  );
};

export default forgotPassword;
