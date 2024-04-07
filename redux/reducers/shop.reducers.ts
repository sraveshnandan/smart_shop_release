import { Ishop } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

export interface IInitialstate {
  shops: Ishop[] | undefined;
}

let initialState: IInitialstate = {
  shops: [],
};
const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    setShops: (state, action) => {
      if (state.shops === action.payload) {
        return;
      }
      state.shops = action.payload;
    },
  },
});

export const { setShops } = shopSlice.actions;
export default shopSlice.reducer;
