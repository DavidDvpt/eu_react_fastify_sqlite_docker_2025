import { selectIsLoggued } from "./authSelectors";
import authReducer, { authActions, getauthState } from "./authSlice";
import { authMeThunk } from "./authThunks";
import { userParser } from "./authParser";

export {
  authActions,
  authMeThunk,
  authReducer,
  getauthState,
  selectIsLoggued,
  userParser,
};
