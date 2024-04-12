import { RootState, store } from "@/redux/Store";
import { setAllCategory, setProducts } from "@/redux/reducers/product.reducer";
import { setShops } from "@/redux/reducers/shop.reducers";
import {
  setAllUsers
} from "@/redux/reducers/user.reducer";
import { IProduct, IUser } from "@/types";
import {
  FetchAllUsers,
  fetchAllProducts,
  fetchAllShops,
  getAllCategory,
} from "@/utils/actions";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// export const unstable_settings = {
//   initialRouteName: "(auth)/",
// };

// Root Layout Navigations

const RootLayoutNav = () => {
  const dispatch = useDispatch();
  const user: any = useSelector((state: RootState) => state.user.details);
  const authState: any = useSelector(
    (state: RootState) => state.user.authState
  );
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
