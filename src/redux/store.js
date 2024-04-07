import { configureStore } from "@reduxjs/toolkit";
import dataReducer from "./dataSlice";

const store = configureStore({
  reducer: {
    user: dataReducer,
  },
});
export default store;