import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SignUpPage from "../SignUpPage";

const mockSignupApi = vi.fn();
const mockNavigate = vi.fn();

vi.mock("@/modules/auth/services/network/signupApi", () => ({
  default: (...args: unknown[]) => mockSignupApi(...args),
}));

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../components/SignUpForm", () => ({
  default: ({ onSubmit }: { onSubmit: (values: unknown) => Promise<void> }) => (
    <button
      type="button"
      onClick={() =>
        onSubmit({
          pseudo: "frederic",
          firstname: "Frederic",
          lastname: "Francois",
          email: "frederic@test.com",
          password: "password123",
        })
      }
    >
      mock-submit-signup
    </button>
  ),
}));

describe("SignUpPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders title and signin link", () => {
    render(
      <MemoryRouter>
        <SignUpPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Inscription")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Deja inscrit ? Connexion" }),
    ).toBeInTheDocument();
  });

  it("calls signup api and redirects to signin on success", async () => {
    mockSignupApi.mockResolvedValueOnce({
      user: { id: "1", email: "frederic@test.com", role: "USER" },
      token: "jwt",
    });

    render(
      <MemoryRouter>
        <SignUpPage />
      </MemoryRouter>,
    );

    await userEvent.click(
      screen.getByRole("button", { name: "mock-submit-signup" }),
    );

    await waitFor(() => {
      expect(mockSignupApi).toHaveBeenCalledWith({
        pseudo: "frederic",
        firstname: "Frederic",
        lastname: "Francois",
        email: "frederic@test.com",
        password: "password123",
      });
      expect(mockNavigate).toHaveBeenCalledWith("/auth/signin", {
        replace: true,
      });
    });
  });
});
