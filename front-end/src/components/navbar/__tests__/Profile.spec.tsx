import { configureStore } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ApiStatus } from "@/lib/axios/ApiStatus";
import authReducer from "@/modules/auth/authSlice";
import Profile from "../Profile";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderProfile(preloadedAuth?: Partial<AuthType>) {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: {
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
        ...preloadedAuth,
      },
    },
  });

  render(
    <Provider store={store}>
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    </Provider>
  );

  return store;
}

describe("Profile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("logs out the user and redirects to signin", async () => {
    const user = userEvent.setup();
    const store = renderProfile();

    await user.click(screen.getByRole("button", { name: "D" }));
    await user.click(screen.getByRole("button", { name: "Logout" }));

    expect(store.getState().auth).toEqual({
      isLoggued: false,
      role: null,
      user: {
        status: ApiStatus.IDLE,
        result: null,
        error: null,
      },
    });
    expect(mockNavigate).toHaveBeenCalledWith("/auth/signin", { replace: true });
  });
});
