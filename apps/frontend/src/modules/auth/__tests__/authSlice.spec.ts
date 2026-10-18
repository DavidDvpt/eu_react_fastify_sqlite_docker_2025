import { describe, expect, it } from "vitest";

import { ApiStatus } from "@/lib/axios/ApiStatus";
import authReducer, { authActions } from "@/store/reducers/auth/authSlice";

describe("authSlice", () => {
  it("updates the in-game username without reloading the authenticated user", () => {
    const previousState: AuthType = {
      isLoggued: true,
      role: "USER",
      user: {
        status: ApiStatus.FULFILLED,
        result: {
          id: "1",
          pseudo: "david",
          role: "USER",
          isActive: true,
        },
        error: null,
      },
    };

    const state = authReducer(previousState, authActions.setInGameUsername("EntropiaName"));

    expect(state.user.result?.inGameUsername).toBe("EntropiaName");
  });

  it("logout resets auth state to its initial values", () => {
    const previousState: AuthType = {
      isLoggued: true,
      role: "ADMIN",
      user: {
        status: ApiStatus.FULFILLED,
        result: {
          id: "1",
          pseudo: "david",
          role: "ADMIN",
          isActive: true,
        },
        error: { message: "stale error", name: "Error" },
      },
    };

    const state = authReducer(previousState, authActions.logout());

    expect(state).toEqual({
      isLoggued: false,
      role: null,
      user: {
        status: ApiStatus.IDLE,
        result: null,
        error: null,
      },
    });
  });
});
