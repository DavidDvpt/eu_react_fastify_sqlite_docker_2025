/* eslint-disable @typescript-eslint/no-explicit-any */
import { configureStore } from "@reduxjs/toolkit";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ApiStatus } from "@/lib/axios/ApiStatus";
import authReducer, { authActions } from "@/store/reducers/auth/authSlice";
import { authMeThunk } from "@/store/reducers/auth/authThunks";

vi.mock("@/modules/auth/services/network/meApi", () => ({
  default: vi.fn(),
}));

import meApi from "@/modules/auth/services/network/meApi";

function makeStore(preloadedAuth?: any) {
  return configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: {
        isLoggued: false,
        role: "USER",
        user: {
          status: ApiStatus.IDLE,
          result: null,
          error: null,
        },
        ...preloadedAuth,
      },
    },
  });
}

describe("authMeThunk", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("dispatching meThunk calls meApi and sets auth state (success)", async () => {
    const apiUser = {
      id: "1",
      email: "test@test.com",
      role: "ADMIN",
    };

    (meApi as any).mockResolvedValue(apiUser);

    const store = makeStore();

    const promise = store.dispatch(authMeThunk());
    expect(store.getState().auth.user.status).toBe(ApiStatus.PENDING);

    await promise;

    const state = store.getState().auth;

    expect(meApi).toHaveBeenCalledOnce();
    expect(state.user.status).toBe(ApiStatus.FULFILLED);
    expect(state.user.result).toEqual(apiUser);
    expect(state.user.error).toBeNull();
    expect(state.isLoggued).toBe(true);
    expect(state.role).toBe("ADMIN");
  });

  it("dispatching meThunk handles error (rejected)", async () => {
    (meApi as any).mockRejectedValue(new Error("Unauthorized"));

    const store = makeStore({
      isLoggued: true,
      role: "ADMIN",
      user: {
        status: ApiStatus.FULFILLED,
        result: { id: "1" },
        error: null,
      },
    });

    await store.dispatch(authMeThunk());

    const state = store.getState().auth;

    expect(meApi).toHaveBeenCalledOnce();
    expect(state.user.status).toBe(ApiStatus.REJECTED);
    expect(state.user.result).toBeNull();
    expect(state.user.error?.message).toBe("Unauthorized");
    expect(state.isLoggued).toBe(false);
  });

  it("dispatching logout resets auth state", () => {
    const store = makeStore({
      isLoggued: true,
      role: "ADMIN",
      user: {
        status: ApiStatus.FULFILLED,
        result: { id: "1", pseudo: "test", role: "ADMIN", isActive: true },
        error: null,
      },
    });

    store.dispatch(authActions.logout());

    const state = store.getState().auth;
    expect(state.isLoggued).toBe(false);
    expect(state.role).toBeNull();
    expect(state.user.status).toBe(ApiStatus.IDLE);
    expect(state.user.result).toBeNull();
    expect(state.user.error).toBeNull();
  });
});
