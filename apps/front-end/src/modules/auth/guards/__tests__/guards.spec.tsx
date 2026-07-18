/* eslint-disable @typescript-eslint/no-explicit-any */
import { configureStore } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import routes from "@/router/routes";
import { ApiStatus } from "@/lib/axios/ApiStatus";

// ✅ adapte l'import du reducer auth
import authReducer from "@/modules/auth/authSlice";

// --- Mocks : layouts/pages ---
// Le but : tester le routing, pas le contenu des pages.
vi.mock("@/layouts/RootLayout", () => ({
  default: () => (
    <div>
      ROOT
      <Outlet />
    </div>
  ),
}));
vi.mock("@/layouts/AuthLayout", () => ({
  default: () => (
    <div>
      AUTH_LAYOUT
      <Outlet />
    </div>
  ),
}));
vi.mock("@/layouts/AppLayout", () => ({
  default: () => (
    <div>
      APP_LAYOUT
      <Outlet />
    </div>
  ),
}));
vi.mock("@/layouts/AdminLayout", () => ({
  default: () => <div>ADMIN</div>,
}));

vi.mock("@/pages/HomePage", () => ({
  default: () => <div>HOME</div>,
}));
vi.mock("@/pages/authPages/SignInPage", () => ({
  default: () => <div>SIGNIN</div>,
}));
vi.mock("@/pages/authPages/SignUpPage", () => ({
  default: () => <div>SIGNUP</div>,
}));

// 👉 Outlet utilisé dans les mocks de layout
import { Outlet } from "react-router-dom";

function makeStore(preloadedAuth: any) {
  return configureStore({
    reducer: { auth: authReducer },
    preloadedState: { auth: preloadedAuth },
  });
}

function makeAuthState(isLoggued: boolean, status: ApiStatus) {
  return {
    isLoggued,
    role: isLoggued ? "USER" : null,
    user: {
      result: isLoggued
        ? { id: "1", pseudo: "demo", role: "USER", isActive: true }
        : null,
      error: null,
      status,
    },
  };
}

describe("routes (real)", () => {
  it("GET / -> redirects to /auth/signin when NOT logged", async () => {
    const store = makeStore(makeAuthState(false, ApiStatus.REJECTED));

    const router = createMemoryRouter(routes as any, {
      initialEntries: ["/"],
    });

    render(
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    );

    expect(await screen.findByText("SIGNIN")).toBeInTheDocument();
  });

  it("GET / -> shows HOME when logged", async () => {
    const store = makeStore(makeAuthState(true, ApiStatus.FULFILLED));

    const router = createMemoryRouter(routes as any, {
      initialEntries: ["/"],
    });

    render(
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    );

    expect(await screen.findByText("HOME")).toBeInTheDocument();
  });

  it("GET /auth/signin -> redirects to /home when logged (GuestOnly)", async () => {
    const store = makeStore(makeAuthState(true, ApiStatus.FULFILLED));

    const router = createMemoryRouter(routes as any, {
      initialEntries: ["/auth/signin"],
    });

    render(
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    );

    expect(await screen.findByText("HOME")).toBeInTheDocument();
  });

  it("GET /auth/signin -> stays on SIGNIN when NOT logged", async () => {
    const store = makeStore(makeAuthState(false, ApiStatus.REJECTED));

    const router = createMemoryRouter(routes as any, {
      initialEntries: ["/auth/signin"],
    });

    render(
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    );

    expect(await screen.findByText("SIGNIN")).toBeInTheDocument();
  });

  it("GET / -> shows session loader while auth is resolving", async () => {
    const store = makeStore(makeAuthState(false, ApiStatus.PENDING));

    const router = createMemoryRouter(routes as any, {
      initialEntries: ["/"],
    });

    render(
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    );

    expect(
      await screen.findByRole("status", { name: "Verification de la session" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Reconnexion en cours avant affichage de l'application.")
    ).toBeInTheDocument();
  });

  it("GET /auth/signin -> shows session loader while auth is resolving", async () => {
    const store = makeStore(makeAuthState(false, ApiStatus.IDLE));

    const router = createMemoryRouter(routes as any, {
      initialEntries: ["/auth/signin"],
    });

    render(
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    );

    expect(
      await screen.findByRole("status", { name: "Verification de la session" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Reconnexion en cours avant affichage de l'application.")
    ).toBeInTheDocument();
  });
});
