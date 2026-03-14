import { ApiStatus } from "@/lib/axios/ApiStatus";
import type { RootState } from "@/store";
import { createSlice } from "@reduxjs/toolkit";
import { authMeThunk } from "./authThunks";

const initialState: AuthType = {
  isLoggued: false,
  role: null,
  user: { result: null, error: null, status: ApiStatus.IDLE },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.isLoggued = false;
      state.role = null;
      state.user = { result: null, error: null, status: ApiStatus.IDLE };
    },
  },
  extraReducers(builder) {
    builder
      .addCase(authMeThunk.pending, (state) => {
        state.user.status = ApiStatus.PENDING;
        state.user.error = null;
      })
      .addCase(authMeThunk.fulfilled, (state, action) => {
        state.user.status = ApiStatus.FULFILLED;
        state.user.result = action.payload;
        state.user.error = null;
        state.isLoggued = true;
        state.role = action.payload.role;
      })
      .addCase(authMeThunk.rejected, (state, action) => {
        state.user.status = ApiStatus.REJECTED;
        state.user.result = null;
        state.user.error = action.error;
        state.isLoggued = false;
        state.role = null;
      });
  },
});

export default authSlice.reducer;
export const authActions = authSlice.actions;
export const getauthState = (state: RootState) => state.auth;
