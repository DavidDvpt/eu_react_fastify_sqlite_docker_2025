import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { configureStore } from "@reduxjs/toolkit";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ApiStatus } from "@/lib/axios/ApiStatus";
import authReducer from "@/store/reducers/auth/authSlice";
import Profile from "../Profile";

const { mockLogoutApi, mockAuthMeThunk } = vi.hoisted(() => ({
  mockLogoutApi: vi.fn(),
  mockAuthMeThunk: vi.fn(),
}));

vi.mock("@/modules/auth/services/network/logoutApi", () => ({
  default: () => mockLogoutApi(),
}));

vi.mock("@/store", async () => {
  const actual = await vi.importActual<typeof import("@/store")>(
    "@/store",
  );

  return {
    ...actual,
    authMeThunk: () => mockAuthMeThunk(),
  };
});

function renderProfile(preloadedAuth?: Partial<AuthType>) {
  const baseAuthState: AuthType = {
    isLoggued: true,
    role: "USER",
    user: {
      status: ApiStatus.FULFILLED,
      result: {
        id: "1",
        pseudo: "David",
        role: "USER",
        isActive: true,
      },
      error: null,
    },
  };

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: {
        ...baseAuthState,
        ...preloadedAuth,
      } satisfies AuthType,
    },
  });

  render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Profile />
        </MemoryRouter>
      </QueryClientProvider>
    </Provider>
  );

  return store;
}

describe("Profile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls logout api then refreshes auth state", async () => {
    const user = userEvent.setup();
    renderProfile();
    mockLogoutApi.mockResolvedValueOnce({ message: "Logged out" });
    mockAuthMeThunk.mockReturnValueOnce(vi.fn());

    await user.click(screen.getByRole("button", { name: /open profile menu/i }));
    await user.click(screen.getByRole("button", { name: "Logout" }));

    await waitFor(() => {
      expect(mockLogoutApi).toHaveBeenCalledOnce();
      expect(mockAuthMeThunk).toHaveBeenCalledOnce();
    });
  });

});
