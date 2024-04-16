import { RootState, store } from "@/redux/Store";
import { setAllCategory, setProducts } from "@/redux/reducers/product.reducer";
import { setShops } from "@/redux/reducers/shop.reducers";
import { setAllUsers } from "@/redux/reducers/user.reducer";
import { IProduct, IUser } from "@/types";
import {
  FetchAllUsers,
  fetchAllProducts,
  fetchAllShops,
  getAllCategory,
} from "@/utils/actions";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useCallback, useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";

import * as SplashScreen from "expo-splash-screen";

//Hidind splash screen from auto hide
SplashScreen.preventAutoHideAsync();

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  initialRouteName: "(auth)/",
};

// Root Layout Navigations

const RootLayoutNav = () => {
  const dispatch = useDispatch();
  const user: any = useSelector((state: RootState) => state.user.details);
  const setAllData = async () => {
    fetchAllProducts((p: IProduct[]) => {
      console.log("Adding All products data.");
      dispatch(setProducts(p));
    });
    fetchAllShops((s) => {
      console.log("Adding all shops data");
      dispatch(setShops(s));
    });

    getAllCategory((category) => {
      console.log("setting all categories");
      dispatch(setAllCategory(category));
    });
    FetchAllUsers((users: IUser[]) => {
      console.log("setting all  user data");
      dispatch(setAllUsers(users));
    });
  };
  useEffect(() => {
    setAllData();
  }, []);
  return (
    <Stack initialRouteName="(auth)/" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(screens)" />
    </Stack>
  );
};

// Main Layout Function
const RootLayout = () => {
  const [fontsLoaded, fontError] = useFonts({
    default: require("../assets/fonts/Aldrich.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <Provider store={store}>
      <RootLayoutNav />
    </Provider>
  );
};

export default RootLayout;
