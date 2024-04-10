import { Colors } from "@/constants";
import { useEffect, useState } from "react";
import { Entypo } from "@expo/vector-icons";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Alert,
  ToastAndroid,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { gql } from "graphql-request";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { gql_client } from "@/utils";
import { router, useNavigation } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { setAuthState, setUserData } from "@/redux/reducers/user.reducer";
import { RootState } from "@/redux/Store";

export default function Login() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [passwordState, setpasswordState] = useState(false);
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setloading] = useState<boolean>(false);
  const handleLogin = async () => {
    setloading(true);
    console.log("LOgin function started.");
    const query = gql`
      query Login($data: UserInput) {
        login(data: $data) {
          message
          token
          user {
            _id
            email
            name
            avatar {
              public_id
              url
            }
            phone_no
            isAdmin
            isShopOwner
            createdAt
            shops {
              _id
            }
            updatedAt
          }
        }
      }
    `;

    const variables = {
      data: {
        email: email,
        password: password,
      },
    };

    await gql_client
      .request(query, variables)
      .then((responce: any) => {
        setloading(false);
        const token = responce.login.token;
        AsyncStorage.setItem("token", token);
        dispatch(setUserData({ ...responce.login.user }));
        dispatch(setAuthState(true));
        router.replace(`/(tabs)/`);
      })
      .catch((e: any) => {
        setloading(false);
        console.log("Login function error", e);
        ToastAndroid.show(`${"Invalid Email or Password."}`, 2500);
      });
  };

  const fetchProfile = () => {
    setloading(true);
    AsyncStorage.getItem("token").then(async (res) => {
      if (res !== null) {
        setloading(true);
        const query = gql`
          query FetchProfile {
            profile {
              message
              user {
                _id
                email
                name
                avatar {
                  public_id
                  url
                }
                phone_no
                isAdmin
                isShopOwner
                createdAt
                shops {
                  _id
                }
                updatedAt
              }
            }
          }
        `;
        await gql_client
          .setHeader("token", res)
          .request(query)
          .then((res: any) => {
            setloading(false);
            if (res.profile.user) {
              setloading(false);
              dispatch(setAuthState(true));
              dispatch(setUserData({ ...res.profile.user }));
              console.log("navigating to home page.");
              router.replace("/(tabs)/");
            }
          })
          .catch((e) => {
            setloading(false);
            console.table("FetchProfile error", e);
          });
      }
    });
  };

  // handle skip button function

  const handleSkip = () => {
    console.log("Skip button is pressed.");
    dispatch(setAuthState(false));
    router.replace(`/(tabs)/`);
  };
  useEffect(() => {
    AsyncStorage.getItem("token").then((res: any) => {
      if (res) {
        fetchProfile();
      } else {
        return;
      }
    });
    return () => {};
  }, []);
  return loading ? (
    <ImageBackground
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
      }}
      source={require("../../assets/images/icon.png")}
      blurRadius={4}
    >
      <ActivityIndicator size={65} />
      <Text
        style={{
          color: Colors.Primary,
          fontSize: 28,
          marginTop: 25,
          fontWeight: "600",
        }}
      >
        Loading...
      </Text>
    </ImageBackground>
  ) : (
    <SafeAreaView style={styles.container}>
      {/* upper section  */}

      <View style={styles.section}>
        <View
          style={{ alignItems: "flex-end", marginRight: -5, marginTop: -15 }}
        >
          <TouchableOpacity onPress={handleSkip} style={{ marginVertical: 10 }}>
            <Text style={{ fontSize: 20 }}>Skip</Text>
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: "center", paddingVertical: 10 }}>
          <Image
            style={styles.icon}
            source={require("../../assets/images/icon.png")} // aur is image path ko bhi
          />
        </View>
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.heading}>Welcome</Text>
        <KeyboardAvoidingView style={{ marginVertical: 20 }}>
          {/* Email Input  */}
          <TextInput
            onChangeText={setemail}
            style={styles.input}
            placeholder="Email address"
          />
          {/* Password Input  */}
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
              backgroundColor: Colors.LightBg,
              borderRadius: 8,
              marginBottom: 15,
              paddingVertical: 8,
              alignItems: "center",
            }}
          >
            <TextInput
              style={{
                width: "80%",
                padding: 8,
                fontSize: 18,
                fontWeight: "700",
                borderRadius: 8,
              }}
              onChangeText={setPassword}
              secureTextEntry={passwordState}
              placeholder="Password"
            />
            <View
              style={{
                width: 40,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
                paddingRight: 10,
              }}
            >
              <Entypo
                onPress={() => setpasswordState(!passwordState)}
                name={passwordState ? "eye-with-line" : "eye"}
                size={28}
                color="black"
              />
            </View>
          </View>
          {/* Forgot password Field  */}
          <TouchableOpacity
            onPress={() =>
              Alert.alert("Info", "We are currentlly working on this feature")
            }
          >
            <Text style={styles.link}>Forgot Password</Text>
          </TouchableOpacity>
          {/* Sign In button  */}

          <TouchableOpacity onPress={handleLogin} style={styles.button}>
            <Text style={styles.btnText}>Sign In</Text>
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
            <Text style={styles.text}>Don't have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Register" as never)}
            >
              <Text style={{ ...styles.text, color: Colors.Link }}>
                Create Account
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    borderRadius: 39,
    borderColor: "#de28c9",
    borderWidth: 4,

    shadowColor: Colors.Primary,
    resizeMode: "contain",
    backgroundColor: "#53edaa",
    marginHorizontal: "auto",
  },
  section: {
    padding: 20,
    backgroundColor: Colors.LightBg,
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
    padding: 8,
    fontSize: 18,
    fontWeight: "700",
    backgroundColor: Colors.LightBg,
    borderRadius: 8,
    marginBottom: 15,
    paddingVertical: 15,
  },
  button: {
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 16,
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
