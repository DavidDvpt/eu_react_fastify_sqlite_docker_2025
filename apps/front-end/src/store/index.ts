import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducers";

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type ThunkSerializedError = import("@reduxjs/toolkit").SerializedError;

export * from "./reducers";
