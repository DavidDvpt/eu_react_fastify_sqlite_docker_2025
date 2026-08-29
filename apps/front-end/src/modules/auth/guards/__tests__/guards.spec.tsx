/* eslint-disable @typescript-eslint/no-explicit-any */
import { configureStore } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import routes from "@/router/routes";
import { ApiStatus } from "@/lib/axios/ApiStatus";

import authReducer from "@/store/reducers/auth/authSlice";

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
vi.mock("@/pages/nexusPage/NexusPage", () => ({
  default: () => <div>NEXUS_PAGE</div>,
}));

// 👉 Outlet utilisé dans les mocks de layout
import { Outlet } from "react-router-dom";

function makeStore(preloadedAuth: any) {
  return configureStore({
    reducer: { auth: authReducer },
    preloadedState: { auth: preloadedAuth },
  });
}

function makeAuthState(
  isLoggued: boolean,
  status: ApiStatus,
  role: "USER" | "ADMIN" | null = isLoggued ? "USER" : null,
) {
  return {
    isLoggued,
    role,
    user: {
      result: isLoggued
        ? { id: "1", pseudo: "demo", role: role ?? "USER", isActive: true }
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

  it("GET /nexus-dashboard -> redirects non-admin users to /home", async () => {
    const store = makeStore(
      makeAuthState(true, ApiStatus.FULFILLED, "USER"),
    );

    const router = createMemoryRouter(routes as any, {
      initialEntries: ["/nexus-dashboard"],
    });

    render(
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    );

    expect(await screen.findByText("HOME")).toBeInTheDocument();
  });

  it("GET /nexus-dashboard -> shows NexusPage for admins", async () => {
    const store = makeStore(
      makeAuthState(true, ApiStatus.FULFILLED, "ADMIN"),
    );

    const router = createMemoryRouter(routes as any, {
      initialEntries: ["/nexus-dashboard"],
    });

    render(
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    );

    expect(await screen.findByText("NEXUS_PAGE")).toBeInTheDocument();
  });
});
