import { ICategories, IProduct } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

export interface IInitialstate {
  products: IProduct[] | undefined;
  category: ICategories[] | undefined;
}

let initialState: IInitialstate = {
  products: undefined,
  category: undefined,
};
const ProductSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      if (state.products === action.payload) {
        return;
      }
      state.products = action.payload;
    },
    setAllCategory: (state, action) => {
      if ((state.category = action.payload)) {
        return;
      }
      state.category = action.payload;
    },
  },
});

export const { setProducts, setAllCategory } = ProductSlice.actions;
export default ProductSlice.reducer;
