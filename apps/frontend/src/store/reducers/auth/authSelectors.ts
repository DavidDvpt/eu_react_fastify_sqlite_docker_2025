import { createSelector } from "@reduxjs/toolkit";
import { ApiStatus } from "@/lib/axios/ApiStatus";
import { getauthState } from "@/store/reducers/auth/authSlice";

const selectIsLoggued = createSelector(
  [getauthState],
  (auth) => auth.isLoggued,
);

const selectAuthStatus = createSelector(
  [getauthState],
  (auth) => auth.user.status,
);

const selectIsAuthResolving = createSelector(
  [selectAuthStatus],
  (status) => status === ApiStatus.IDLE || status === ApiStatus.PENDING,
);
const selectIsAdmin = createSelector([getauthState], (auth) => auth.role);

export {
  selectAuthStatus,
  selectIsAuthResolving,
  selectIsLoggued,
  selectIsAdmin,
};
