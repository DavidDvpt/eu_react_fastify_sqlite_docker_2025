import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SignInPage from "../SignInPage";

const mockDispatch = vi.fn();
const mockSigninApi = vi.fn();
const mockThunkAction = vi.fn();
const mockAuthMeThunk = vi.fn(() => mockThunkAction);

vi.mock("@/store/hooks", () => ({
  useAppDispatch: () => mockDispatch,
}));

vi.mock("@/modules/auth/services/network/signinApi", () => ({
  default: (...args: unknown[]) => mockSigninApi(...args),
}));

vi.mock("@/store", async () => {
  const actual = await vi.importActual<typeof import("@/store")>("@/store");

  return {
    ...actual,
    authMeThunk: () => mockAuthMeThunk(),
  };
});

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
      expect(mockAuthMeThunk).toHaveBeenCalledOnce();
      expect(mockDispatch).toHaveBeenCalledWith(mockThunkAction);
    });
  });
});
