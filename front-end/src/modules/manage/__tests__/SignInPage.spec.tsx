import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import SignInPage from "../../../pages/SignInPage";

const mockDispatch = vi.fn();
const mockSigninApi = vi.fn();
const mockAuthMeThunk = vi.fn();

vi.mock("@/store/hooks", () => ({
  useAppDispatch: () => mockDispatch,
}));

vi.mock("@/modules/auth/services/network/signinApi", () => ({
  default: (...args: unknown[]) => mockSigninApi(...args),
}));

vi.mock("@/modules/auth", () => ({
  authMeThunk: () => mockAuthMeThunk(),
}));

vi.mock("../components/SignInForm", () => ({
  default: ({ onSubmit }: { onSubmit: (values: unknown) => Promise<void> }) => (
    <button
      type="button"
      onClick={() =>
        onSubmit({ pseudo: "fredericFrancois", password: "password123" })
      }
    >
      mock-submit-signin
    </button>
  ),
}));

describe("SignInPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders title and signup link", () => {
    render(
      <MemoryRouter>
        <SignInPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Connexion")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "S'inscrire" }),
    ).toBeInTheDocument();
  });

  it("dispatches authMeThunk after successful signin", async () => {
    mockSigninApi.mockResolvedValueOnce({ message: "Success" });
    mockAuthMeThunk.mockReturnValueOnce({ type: "auth/me" });

    render(
      <MemoryRouter>
        <SignInPage />
      </MemoryRouter>,
    );

    await userEvent.click(
      screen.getByRole("button", { name: "mock-submit-signin" }),
    );

    await waitFor(() => {
      expect(mockSigninApi).toHaveBeenCalledWith({
        pseudo: "fredericFrancois",
        password: "password123",
      });
      expect(mockDispatch).toHaveBeenCalledWith({ type: "auth/me" });
    });
  });
});
