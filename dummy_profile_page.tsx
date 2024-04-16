import {
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { LoginAlert } from "@/components";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import { Entypo } from '@expo/vector-icons';
import {
  Colors,
  ProfileButtons,
  ownersButtons,
  screenWidth,
} from "@/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { IProduct, Ishop } from "@/types";
import { fetchAllShops } from "@/utils/actions";
import { setShops } from "@/redux/reducers/shop.reducers";

const Profile = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const authState = useSelector((state: RootState) => state.user.authState);
  const details: any = useSelector((state: RootState) => state.user.details);
  const allShops = useSelector((state: RootState) => state.shop.shops);
  const [shopOwner, setshopOwner] = useState(details.isShopOwner);
  const [shop, setshop] = useState<Ishop | undefined>(
    allShops?.find(
      (s: Ishop) => s.owner?.email?.toString() === details.email.toString()
    )
  );
  const [authType, setauthType] = useState(authState);

  const [toggle, settoggle] = useState(false);

  const [refreshing, setrefreshing] = useState(false);


  

  // handle logout function
  const handlelogout = () => {
  };

  // handle Link Press

  const handleLinkPress = (link: string) => {
  };

  if (shopOwner) {
    useLayoutEffect(() => {
      const userShop = allShops?.find(
        (s: Ishop) => s.owner?.email?.toString() === details.email.toString()
      );
      setshop(userShop);

      navigation.setOptions({
        headerTitle: `${shop?.name}`,
        headerLeft: () => (
          <View
            style={{
              marginLeft: "10%",
              backgroundColor: Colors.LightBg,
              padding: 4,
              borderRadius: 6,
            }}
          >
            <Ionicons name="storefront-sharp" size={25} />
          </View>
        ),
      });
    }, [allShops, details]);
  }

  if (!shopOwner && authState) {
    useEffect(() => {
      navigation.setOptions({
        headerTitle: `${details.name}`,
      });
    }, []);
  }

  const refetchAllshop = async () => {
    await fetchAllShops((shops: Ishop[]) => {
      dispatch(setShops(shops));
    });
  };
  // handle on refress

  const onRefresh = useCallback(() => {
    setrefreshing(true);
    refetchAllshop().then(() => setrefreshing(false));
  }, []);





  const handleSettingIconPressed =()=>{
    router.push(`/(screens)/Settings?shopId=${shop?._id}` as any)
  }
  return authType ? (
    <>
      {shopOwner === true ? (
        <SafeAreaView style={{ flex: 1 , marginTop: -25,}}>
          <ScrollView
            contentContainerStyle={{ alignItems: "center" }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#9Bd35A", "red", "blue"]}
                // Android offset for RefreshControl
                progressViewOffset={10}
              />
            }
          >
            <RefreshControl
              title="Refreshing..."
              titleColor={Colors.Primary}
              refreshing={refreshing}
              tintColor={Colors.Primary}
              onRefresh={onRefresh}
            />
            {/* SHop Profile Card  */}
            <View
              style={{
                width: "95%",
                alignItems: "center",
                backgroundColor: Colors.White,
                borderRadius: 8,
               
              }}
            >
              {shop?.images ? (
                <View
                  style={{
                   
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <Image
                    style={{
                      width: "100%",
                      height: 250,
                      resizeMode: "cover",
                    }}
                    source={{ uri: shop?.images![0].url }}
                  />
                </View>
              ) : (
                <View
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    name="storefront-outline"
                    size={250}
                    color={Colors.Primary}
                  />
                </View>
              )}

              {/* shop owner details  */}

              <Image
                style={{
                  width: 100,
                  height: 100,
                  borderWidth: 2,
                  borderColor: Colors.Primary,
                  borderRadius: 55,
                  position: "absolute",
                  left: 15,
                  top: "45%",
                }}
                source={{ uri: shop?.owner?.avatar.url }}
              />
             {/* follower and product number*/}
             <View
              style={{

                width: "70%",
                alignSelf: "center",
                borderRadius: 8,
              marginLeft: "34%",
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              {/* Shops Products  */}

              <TouchableOpacity
                style={{
                 
                  width: "40%",
                 
                  alignItems: "center",
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{ fontSize: 16, fontWeight: "600",marginBottom: 10 }}
                >
                  Products
                </Text>

                <Text style={{ color: Colors.Bg, fontSize: 20 }}>
                  {shop?.products?.length}
                </Text>
              </TouchableOpacity>

              {/* Shops Followers  */}

              <TouchableOpacity
                style={{
                 width: "40%",
                  alignItems: "center",
                  borderRadius: 8,
                }}
                onPress={() =>
                  router.push(
                    `/(screens)/ShopFollowersList?data=${JSON.stringify(
                      shop?.followers
                    )}` as any
                  )
                }
              >
                <Text
                  style={{ fontSize: 16, fontWeight: "600", marginBottom: 10 }}
                >
                  Followers
                </Text>

                <Text style={{ color: Colors.Bg, fontSize: 20 }}>
                  {shop?.followers?.length}
                </Text>
              </TouchableOpacity>
            </View>
              {/* Other Details  */}

              <View
                style={{
                  width: "100%",
                  marginTop: 10,
                  paddingHorizontal: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 25,
                    fontWeight: "500",
                    color: Colors.Primary,
                  }}
                >
                  {shop?.name}
                </Text>

                {/* Shop address  */}

                <Text style={{ fontWeight: "600", color: "#444" }}>
                <Entypo name="location" size={24} color="black" /> {shop?.address}
                </Text>

                {/* Shop Descriton  */}
                <Text
                  style={{
                    color: Colors.Primary,
                    fontWeight: "600",
                    fontSize: 18,
                    marginTop: 15,
                    marginBottom: 10,
                  }}
                >
                  About the shop
                </Text>
                <Text style={{ fontWeight: "600", marginBottom: 10 }}>
                  {shop?.description}
                </Text>
              </View>
            </View>
            {/* Shop Profile Card  */}
            {toggle && (
              <View
                style={{
                  backgroundColor: Colors.White,
                  width: screenWidth * 0.35,
                  borderRadius: 6,
                  position: "absolute",
                  right: 2,
                  zIndex: 100,
                  padding: 8,
                }}
              >
                {/* Edit Shop button  */}

                <TouchableOpacity
                  style={{
                    width: "100%",
                    backgroundColor: Colors.LightBg,
                    marginVertical: 10,
                    paddingVertical: 8,
                    alignItems: "center",
                    borderRadius: 6,
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 8,
                  }}
                  onPress={() => {
                    settoggle((prev) => !prev);
                    router.push(
                      `/(screens)/EditShop?shopId=${shop?._id}` as any
                    );
                  }}
                >
                  <AntDesign name="edit" color={Colors.Link} size={20} />
                  <Text style={{ fontWeight: "600", color: Colors.Link }}>
                    Edit shop
                  </Text>
                </TouchableOpacity>

                {/* Logout Button  */}
                <TouchableOpacity
                  style={{
                    width: "100%",
                    backgroundColor: Colors.LightBg,
                    marginVertical: 10,
                    paddingVertical: 8,
                    alignItems: "center",
                    borderRadius: 6,
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                  onPress={handlelogout}
                >
                  <Ionicons name="log-out-sharp" color={"red"} size={20} />
                  <Text style={{ fontWeight: "600", color: "red" }}>
                    Logout
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            {/* Shop stats  */}
        

            {/* IMP CTA  */}

            <View
              style={{
                padding: 15,
                marginTop: 25,
                width: "96%",
                alignSelf: "center",
                borderRadius: 8,
                backgroundColor: Colors.White,
              }}
            >
              
              <Text
                style={{
                  fontSize: 25,
                  fontWeight: "600",
                  marginVertical: 15,
                  textAlign: "center",
                }}
              >
                Your Products
              </Text>
              {/* Product section  */}
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  flexWrap: "wrap",
                  alignSelf: "center",
                  justifyContent: "center",
                  backgroundColor: Colors.LightBg,
                  paddingVertical: 15,
                  borderRadius: 8,
                }}
              >
                {shop?.products?.length! > 0 ? (
                  shop?.products?.map((p: IProduct, index) => (
                    <TouchableOpacity
                      style={{
                        width: "46%",
                        alignItems: "center",

                        backgroundColor: Colors.White,
                        borderRadius: 6,
                        padding: 4,
                        alignSelf: "center",
                      }}
                      key={index}
                      onPress={() =>
                        router.push(
                          `/(screens)/ProductsDetails?id=${p._id}` as any
                        )
                      }
                    >
                      {/* Product Image  */}
                      <Image
                        style={{
                          width: "100%",
                          height: 150,
                          resizeMode: "contain",
                        }}
                        source={{ uri: p.images[0].url }}
                      />

                      {/* Product Details  */}
                      <Text style={{ fontWeight: "600", fontSize: 20 }}>
                        {p.title?.substring(0, 15)}
                      </Text>
                      <Text style={{ color: "green", fontSize: 18 }}>
                        ₹{p.discount_price}
                      </Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <View style={{ alignItems: "center" }}>
                    <Text style={{ fontSize: 25, color: "red" }}>
                      No Products yet.
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      ) : (
        // NORMAL USER PROFILE PAGE
        <ScrollView style={{ flex: 1, backgroundColor: Colors.White }}>
          {/* Profile Card  */}
          <View
            style={{
              backgroundColor: Colors.LightBg,
              width: "95%",
              paddingVertical: 10,
              paddingHorizontal: 10,
              alignSelf: "center",
              marginVertical: 10,
              borderRadius: 8,
              shadowColor: "#000",
              shadowOffset: { width: 10, height: 10 },
              shadowOpacity: 1,
              elevation: 10,
            }}
          >
            {/* User Profile Picture  */}

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {/* Profile picture  */}
              <View
                style={{
                  borderWidth: 2,
                  borderColor: Colors.Primary,
                  borderRadius: 55,
                  overflow: "hidden",
                  padding: 4,
                  width: 100,
                  height: 100,
                }}
              >
                <Image
                  style={{ width: "100%", height: "100%", borderRadius: 55 }}
                  source={{ uri: details.avatar?.url }}
                />
              </View>

              {/* User Details  */}
              <View
                style={{
                  alignItems: "flex-start",
                  width: "100%",
                  height: "100%",
                  paddingVertical: 20,
                  paddingHorizontal: 10,
                }}
              >
                <Text style={{ fontSize: 22, fontWeight: "600" }}>
                  {details.name}
                </Text>
                <Text style={{ color: "#444" }}>{details.email}</Text>
              </View>
            </View>
          </View>

          {/* Action Button  */}

          {ProfileButtons.slice(0, ProfileButtons.length - 1).map(
            (item, index: number) => (
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.LightBg,
                  width: "95%",
                  paddingVertical: 20,
                  paddingHorizontal: 10,
                  alignSelf: "center",
                  marginVertical: 10,
                  borderRadius: 8,
                  shadowColor: "#000",
                  shadowOffset: { width: 5, height: 5 },
                  shadowOpacity: 1,
                  elevation: 10,
                  flexDirection: "row",
                  alignItems: "center",
                }}
                key={index}
                onPress={() => handleLinkPress(item.link)}
              >
                <Text style={{ fontSize: 18, fontWeight: "400" }}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            )
          )}

          {/* Log out button  */}

          <TouchableOpacity
            style={{
              backgroundColor: Colors.LightBg,
              width: "95%",
              paddingVertical: 10,
              paddingHorizontal: 10,
              alignSelf: "center",
              marginVertical: 10,
              borderRadius: 8,
              shadowColor: "#000",
              shadowOffset: { width: 10, height: 10 },
              shadowOpacity: 1,
              elevation: 10,
              flexDirection: "row",
              alignItems: "center",
            }}
            onPress={handlelogout}
          >
            <Text style={{ fontSize: 18, fontWeight: "400" }}>Log out</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </>
  ) : (
    <LoginAlert />
  );
};

export default Profile;

const styles = StyleSheet.create({
  headsub: {
    borderRadius: 55,
    resizeMode: "cover",
    height: 50,
    width: 50,
    borderWidth: 2,
    borderColor: Colors.Primary,
    marginLeft: 10,
  },
  headsubs: {
    borderRadius: 55,
    resizeMode: "cover",
    height: 110,
    width: 110,
    borderWidth: 2,
    borderColor: Colors.Primary,
    marginLeft: 10,
  },
  number: {
    color: Colors.Bg,
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  follow: {
    color: Colors.Bg,
    fontSize: 15,
    textAlign: "center",
    fontWeight: "400",
  },

  add: {
    backgroundColor: "#fc03a5",
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  textadd: { textAlign: "center", color: "#fff", fontSize: 15 },
  preview: {
    backgroundColor: Colors.Primary,
    paddingHorizontal: 15,
    paddingVertical: 5,
    flexDirection: "row",
    borderRadius: 10,
  },

  text: { textAlign: "center", color: "#fff", fontSize: 18 },
});