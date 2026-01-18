import { createSelector } from "@reduxjs/toolkit";
import { getauthState } from "./authSlice";

const selectIsLoggued = createSelector(
  [getauthState],
  (auth) => auth.isLoggued
);

export { selectIsLoggued };
