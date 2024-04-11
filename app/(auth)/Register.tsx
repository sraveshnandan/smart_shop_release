import { Colors, screenHeight } from "@/constants";
import { useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { gql } from "graphql-request";
import { gql_client } from "@/utils";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { uploaImg } from "@/utils/actions";

export default function Register() {
  const navigation = useNavigation();
  const [hide, sethide] = useState<boolean>(true);
  const [name, setname] = useState<string>("");
  const [email, setemail] = useState<string>("");
  const [phone, setphone] = useState<string>("");
  const [password, setpassword] = useState<string>("");
  const [confPassword, setconfPassword] = useState<string>("");
  const [img, setimg] = useState<string | null>(null);
  const [avatar, setavatar] = useState<
    { public_id: string; url: string } | undefined
  >(undefined);
  const [loading, setloading] = useState(false);
  const [emailVerified, setemailVerified] = useState(false);
  const [emailModelState, setemailModelState] = useState(false);
  const [userOtp, setuserOtp] = useState<string>("");
  const [serverOtp, setserverOtp] = useState("");

  const requestOTP = async () => {
    setloading(true);
    const query = gql`
      query SendOtpEmail($email: String) {
        sendOtp(email: $email)
      }
    `;
    const variables = {
      email: email,
    };

    await gql_client
      .request(query, variables)
      .then((res: any) => {
        setloading(false);
        console.log(res);
        setserverOtp(res.sendOtp);
        return Alert.alert("Success", `Otp sent to:${email}`);
      })
      .catch((e: any) => {
        setloading(false);
        setemailModelState(false);
        return Alert.alert("Errror", "Unable to send  OTP.");
      });
  };

  // handle registration function
  const handleRegister = async () => {
    if (
      name === "" ||
      phone === "" ||
      email === "" ||
      password === "" ||
      confPassword === ""
    ) {
      return Alert.alert("Alert", "all fields are required.");
    } else {
      if (!emailVerified && !serverOtp) {
        await requestOTP();
        setemailModelState(true);
      }
      // Proceeding registration after email is verified
      if (emailVerified) {
        setemailModelState(false);
        console.log("uri", img);
        if (img !== "") {
          setloading(true);
          uploaImg(img!)
            .then(async (uploadResult: any) => {
              setloading(false);
              // Set the avatar state with the result of the image upload
              setavatar(uploadResult);

              const data = {
                name,
                email,
                phone,
                password,
                avatar: uploadResult, // Use the uploaded image result here
              };

              console.log("registration payload", data);

              const query = gql`
                mutation Register($data: UserInput) {
                  createUser(data: $data) {
                    message
                    user {
                      _id
                    }
                    token
                  }
                }
              `;

              const variables = {
                data: {
                  name: name,
                  email: email,
                  password: password,
                  phone_no: phone,
                  avatar: uploadResult, // Use the uploaded image result here as well
                },
              };

              // Sending Registration request
              try {
                setloading(true);
                const res: any = await gql_client.request(query, variables);

                // Handle the response

                if (res.createUser) {
                  setloading(false);
                  Alert.alert("Success", "Account created successfully.");
                  router.replace(`/(auth)/`);
                } else {
                  setloading(false);
                  Alert.alert("Error", "Something went wrong.");
                }
              } catch (error: any) {
                setloading(false);
                const errmsg = error.message.split(".:")[0];
                Alert.alert("Error", errmsg);
              }
            })
            .catch((error) => {
              console.log("upload error", error);
            });
        } else if (img === "") {
          setavatar(undefined);
          setloading(true);
          const data = {
            name,
            email,
            phone,
            password,
            avatar,
          };
          console.log("registration payload", data);
          const query = gql`
            mutation Register($data: UserInput) {
              createUser(data: $data) {
                message
                user {
                  _id
                }
                token
              }
            }
          `;
          const variables = {
            data: {
              name: name,
              email: email,
              password: password,
              phone_no: phone,
              avatar: avatar,
            },
          };
          // Sending REgistration request
          gql_client
            .request(query, variables)
            .then((res: any) => {
              setloading(false);
              console.log(res);
              if (res.createUser) {
                setloading(false);
                Alert.alert("Success", "Account created successfully.");
                console.log(res);
                router.replace(`/(auth)/`);
              } else {
                setloading(false);
                return Alert.alert("Error", "Something went wrong.");
              }
            })
            .catch((e: any) => {
              setloading(false);
              const errmsg = e.message.split(".:")[0];
              return Alert.alert("Error", `${errmsg}`);
            });
        } else {
          return;
        }
      } else {
        return;
      }
    }
  };

  // image selection handling
  const handleImgaePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setimg(result.assets[0].uri);
      return Alert.alert("Success", "Image selected successfully.");
    } else {
      Alert.alert("Error", "No any images selected.");
    }
  };

  // Final useLayout effect
  useLayoutEffect(() => {
    // Setting some navigation data
    navigation.setOptions({
      headerShown: true,
      headerStyle: {
        backgroundColor: Colors.Primary,
      },
      headerTitleStyle: {
        textAlign: "center",
      },
      headerTitle: "Register Your Account",
    });

    return () => {};
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* upper section  */}
      {loading ? (
        <View
          style={{
            position: "absolute",
            top: "40%",
            zIndex: 100,
            width: "80%",
            alignItems: "center",
            backgroundColor: "#f5f6f7",
            alignSelf: "center",
            borderRadius: 6,
            justifyContent: "center",
            height: screenHeight * 0.25,
          }}
        >
          <ActivityIndicator size={55} />
        </View>
      ) : null}

      {emailModelState && (
        <Modal
          hardwareAccelerated={true}
          onDismiss={() => setemailModelState(false)}
          animationType="slide"
          role="alertdialog"
        >
          {/* Model Header  */}
          <View
            style={{
              width: "100%",
              backgroundColor: Colors.LightBg,
              paddingHorizontal: 10,
              gap: 25,
              flexDirection: "row",
              paddingVertical: 15,
            }}
          >
            <Ionicons
              name="close-sharp"
              size={25}
              onPress={() => setemailModelState((prev) => !prev)}
            />
            <Text style={{ fontSize: 20, color: Colors.Primary }}>
              Verify Email Address
            </Text>
          </View>

          {/* model Body  */}

          <View
            style={{
              width: "100%",
              flex: 1,
              alignItems: "center",
              justifyContent: "flex-start",
              paddingTop: screenHeight * 0.2,
            }}
          >
            <Text style={{ fontSize: 28, fontWeight: "600" }}>
              OTP Verification{" "}
            </Text>

            <View
              style={{
                marginVertical: 20,
                backgroundColor: Colors.LightBg,
                width: "80%",
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              <TextInput
                style={{
                  width: "100%",
                  backgroundColor: Colors.LightBg,
                  textAlign: "center",
                  fontSize: 30,
                  fontWeight: "600",
                  color: Colors.Primary,
                  paddingVertical: 8,
                }}
                keyboardType="numeric"
                placeholder="Enter OTP"
                value={userOtp}
                onChangeText={setuserOtp}
              />
            </View>
            <TouchableOpacity
              style={{
                width: "80%",
                backgroundColor: Colors.Primary,
                paddingVertical: 15,
                borderRadius: 6,
              }}
              onPress={() => {
                if (userOtp.toString() === serverOtp.toString()) {
                  setemailModelState(false);
                  setemailVerified(true);
                  return Alert.alert("Success ", "Email verified successfully");
                } else {
                  setuserOtp("");
                  return Alert.alert("Error", "OTP not matched.");
                }
              }}
            >
              <Text
                style={{
                  fontSize: 24,
                  color: Colors.White,
                  textAlign: "center",
                }}
              >
                Verify
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
      <View style={styles.formContainer}>
        <Text style={styles.heading}>Register here</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Avatar Box  */}
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

          <KeyboardAvoidingView style={{ marginVertical: 20 }}>
            {/* Name Input  */}
            <TextInput
              style={styles.input}
              onChangeText={setname}
              placeholder="Full name"
            />
            {/* Number Input  */}
            <TextInput
              style={{ ...styles.input, marginTop: 10 }}
              onChangeText={setphone}
              keyboardType="numeric"
              placeholder="+91 91261 26***"
            />
            {/* Email Input  */}
            <TextInput
              style={{ ...styles.input, marginTop: 10 }}
              onChangeText={setemail}
              placeholder="Email address"
            />
            {/* Password Input  */}
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: Colors.LightBg,
                borderRadius: 8,
                marginTop: 10,
              }}
            >
              <TextInput
                style={{ ...styles.input, width: "90%" }}
                secureTextEntry={hide}
                placeholder="Password"
                onChangeText={setpassword}
              />
              <Entypo
                onPress={() => sethide(!hide)}
                name={hide ? "eye-with-line" : "eye"}
                size={20}
              />
            </View>
            {/* Password Input  */}
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: Colors.LightBg,
                marginTop: 10,
                borderRadius: 8,
              }}
            >
              <TextInput
                style={{ ...styles.input, width: "90%" }}
                secureTextEntry={hide}
                placeholder=" Conferm Password"
                onChangeText={setconfPassword}
              />
              <Entypo
                onPress={() => sethide(!hide)}
                name={hide ? "eye-with-line" : "eye"}
                size={20}
              />
            </View>
            {/* Forgot password Field  */}
            <TouchableOpacity
              onPress={() => router.push(`/(auth)/forgotPassword`)}
            >
              <Text style={styles.link}>Forgot Password</Text>
            </TouchableOpacity>
            {/* Sign In button  */}

            <TouchableOpacity
              disabled={loading}
              onPress={handleRegister}
              style={[
                styles.button,
                loading ? { backgroundColor: Colors.DarkBg } : null,
              ]}
            >
              <Text style={styles.btnText}>
                {loading
                  ? "Please wait..."
                  : emailVerified
                  ? "Register"
                  : "Send OTP"}
              </Text>
            </TouchableOpacity>
            {/* seperator  */}
            <View style={styles.seperator}>
              <View style={styles.hr}></View>
              <View>
                <Text style={{ fontSize: 16 }}>OR</Text>
              </View>
              <View style={styles.hr}></View>
            </View>

            <View style={styles.linkbtnBox}>
              <Text style={styles.text}>Already have an account? </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("index" as never)}
              >
                <Text style={{ ...styles.text, color: Colors.Link }}>
                  Login
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LightBg,
    position: "relative",
  },
  heading: {
    fontSize: 34,
    fontWeight: "600",
    marginTop: 10,
    color: Colors.Primary,
  },
  icon: {
    width: 150,
    height: 150,
    borderRadius: 99,
    shadowColor: Colors.Primary,
    resizeMode: "contain",
    backgroundColor: "#fff",
    marginHorizontal: "auto",
  },
  section: {
    backgroundColor: Colors.LightBg,
    padding: 0,
  },
  formContainer: {
    backgroundColor: Colors.White,
    marginTop: -12,
    paddingHorizontal: 20,
    borderRadius: 22,
    flex: 1,
  },
  input: {
    width: "100%",
    paddingHorizontal: 8,
    paddingVertical: 12,
    fontSize: 18,
    fontWeight: "700",
    color: Colors.DarkBg,
    backgroundColor: Colors.LightBg,
    borderRadius: 8,
    alignItems: "center",
  },
  button: {
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 15,
    alignItems: "center",
    backgroundColor: Colors.Primary,
    borderRadius: 8,
  },
  btnText: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.White,
  },
  link: {
    color: Colors.Link,
    fontSize: 18,
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  seperator: {
    alignItems: "center",
    marginVertical: 10,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  hr: {
    width: "40%",
    alignItems: "center",
    backgroundColor: Colors.LightBg,
    height: 2,
  },
  text: {
    fontSize: 20,
  },
  linkbtnBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
