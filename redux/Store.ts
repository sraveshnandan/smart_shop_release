import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/user.reducer";
import productReducer from "./reducers/product.reducer";
import shopReducers from "./reducers/shop.reducers";

const store = configureStore({
  reducer: {
    user: userReducer,
    product: productReducer,
    shop: shopReducers,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export { store };
