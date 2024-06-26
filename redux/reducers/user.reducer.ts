import { IProduct, IUser } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

export interface IInitialstate {
  authState: boolean;
  details: Object;
  wishlist: IProduct[] | undefined;
  users: IUser[] | undefined;
}
const initialState: IInitialstate = {
  authState: false,
  details: {},
  wishlist: [],
  users: [],
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.details = action.payload;
    },
    setAuthState: (state, action) => {
      state.authState = action.payload;
    },
    addToWishlist: (state, action) => {
      const alreadyExists = state.wishlist?.findIndex(
        (p) => p._id,
        toString() === action.payload._id.toString()
      );
      if (alreadyExists === -1) {
        console.log("adding product to wishlist.");
        state.wishlist?.push(action.payload);
      } else {
        return;
      }
    },
    removeToWishlist: (state, action) => {
      const alreadyExists: any = state.wishlist?.findIndex(
        (p) => p._id,
        toString() === action.payload._id.toString()
      );
      if (alreadyExists === -1) {
        return;
      } else {
        console.log("removing product from wishlist.");
        state.wishlist?.splice(alreadyExists, 1);
      }
    },
    bulkAddWishlist: (state, action) => {
      state.wishlist = action.payload;
    },
    setAllUsers: (state, action) => {
      if (state.users === action.payload) {
        return;
      }
      state.users = action.payload;
    },
  },
});

export const {
  setAuthState,
  setUserData,
  addToWishlist,
  removeToWishlist,
  setAllUsers,
  bulkAddWishlist,
} = userSlice.actions;

export default userSlice.reducer;
