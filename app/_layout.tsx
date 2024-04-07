import { store } from "@/redux/Store";
import { setAllCategory, setProducts } from "@/redux/reducers/product.reducer";
import { setShops } from "@/redux/reducers/shop.reducers";
import {
  fetchAllProducts,
  fetchAllShops,
  getAllCategory,
} from "@/utils/actions";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";

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
  const setAllProducts = async () => {
    fetchAllProducts((p) => {
      dispatch(setProducts(p));
    });
    fetchAllShops((s) => {
      dispatch(setShops(s));
    });

    getAllCategory((category) => {
      dispatch(setAllCategory(category));
    });
    
  };
  useEffect(() => {
    setAllProducts();
  }, []);
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(screens)" />
    </Stack>
  );
};

// Main Layout Function
const RootLayout = () => {
  return (
    <Provider store={store}>
      <RootLayoutNav />
    </Provider>
  );
};

export default RootLayout;
