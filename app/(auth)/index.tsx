import { Colors, screenHeight, screenWidth } from "@/constants";
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
  ToastAndroid,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { gql } from "graphql-request";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { gql_client } from "@/utils";
import { router, useNavigation } from "expo-router";
import { useDispatch } from "react-redux";
import {
  setAllUsers,
  setAuthState,
  setUserData,
} from "@/redux/reducers/user.reducer";
import {
  FetchAllUsers,
  fetchAllProducts,
  fetchAllShops,
} from "@/utils/actions";
import { IProduct, IUser, Ishop } from "@/types";
import { setShops } from "@/redux/reducers/shop.reducers";
import { setProducts } from "@/redux/reducers/product.reducer";
import { StatusBar } from "expo-status-bar";

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
          query ProfileFunction {
            profile {
              message
              user {
                _id
                name
                email
                isShopOwner
                isAdmin
                shops {
                  _id
                  name
                  images {
                    url
                  }
                  address
                  followers {
                    _id
                  }
                  products {
                    _id
                  }
                  createdAt
                }
              }
            }
          }
        `;
        await gql_client
          .setHeader("token", res)
          .request(query)
          .then(async (res: any) => {
            if (res.profile.user) {
              await fetchAllShops((shops: Ishop[]) => {
                dispatch(setShops(shops));
              });
              await fetchAllProducts((products: IProduct[]) => {
                dispatch(setProducts(products));
              });
              FetchAllUsers((users: IUser[]) => {
                console.log("setting all  user data");
                dispatch(setAllUsers(users));
              });
              dispatch(setAuthState(true));
              dispatch(setUserData({ ...res.profile.user }));
              setloading(false);
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
  const handleSkip = async () => {
    setloading(true);
    console.log("Skip button is pressed.");
    setTimeout(() => {
      setloading(false);
      router.replace("/(tabs)/");
    }, 5000);
  };
  useEffect(() => {
    AsyncStorage.getItem("token").then((res: any) => {
      if (res) {
        fetchProfile();
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
      source={require("../../assets/images/splash.png")}
      resizeMode="cover"
      height={screenHeight}
      width={screenWidth}
    >
      <ActivityIndicator size={65} />
      <Text
        style={{
          color: Colors.Primary,
          fontSize: 28,
          marginTop: 25,
          fontWeight: "500",
        }}
      >
        Loading...
      </Text>
    </ImageBackground>
  ) : (
    <SafeAreaView style={styles.container}>
      {/* upper section  */}
      <StatusBar style="inverted" />
      <View style={styles.section}>
        <View
          style={{ alignItems: "flex-end", marginRight: -5, marginTop: -15 }}
        >
          <TouchableOpacity onPress={handleSkip} style={{ marginVertical: 10 }}>
            <Text style={{ fontSize: 20, fontFamily: "default" }}>Skip</Text>
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: "center" }}>
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
            placeholderTextColor={"#888"}
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
              placeholderTextColor={"#888"}
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
            onPress={() => router.push(`/(auth)/forgotPassword`)}
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
            <Text style={styles.text}>Don't have an account</Text>
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
    fontFamily: "default",
  },
  icon: {
    width: 150,
    height: 150,
    padding: 0,
    resizeMode: "stretch",
    marginHorizontal: "auto",
    shadowColor: "#4579",
    shadowOffset: { width: -10, height: -10 },
    shadowOpacity: 0.6,
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
    fontFamily: "default",
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
    fontFamily: "default",
  },
  link: {
    color: Colors.Link,
    fontSize: 18,
    alignSelf: "flex-end",
    marginBottom: 10,
    fontFamily: "default",
    textAlign: "center",
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
    fontFamily: "default",
  },
  linkbtnBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    gap: 15,
    textAlign: "center",
  },
});
