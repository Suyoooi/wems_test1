import { configureStore } from "@reduxjs/toolkit";
import loadingReducer from "./loadingSlice";
import modalReducer from "./modalSlice";
import langReducer from "./langSlice";

const store = configureStore({
  reducer: {
    loading: loadingReducer,
    modal: modalReducer,
    lang: langReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
