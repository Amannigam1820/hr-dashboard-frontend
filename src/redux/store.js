import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./reducer/userReducer.js";
import { userAPI } from "./api/Hr_api.js";

export const store = configureStore({
  reducer: {
    [userSlice.name]: userSlice.reducer,

    [userAPI.reducerPath]: userAPI.reducer,
  },
  middleware: (mid) => [...mid(), userAPI.middleware],
});
