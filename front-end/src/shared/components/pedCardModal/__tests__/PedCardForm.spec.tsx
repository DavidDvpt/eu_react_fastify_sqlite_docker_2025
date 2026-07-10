import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import PedCardForm from "../PedCardForm";

const { mockCreatePedCardEntry } = vi.hoisted(() => ({
  mockCreatePedCardEntry: vi.fn(),
}));

vi.mock("@/lib/services", async () => {
  const actual = await vi.importActual<typeof import("@/lib/services")>(
    "@/lib/services",
  );

  return {
    ...actual,
    createPedCardEntry: mockCreatePedCardEntry,
  };
});

vi.mock("../form/Genericform", () => ({
  GenericForm: ({
    children,
    onSubmit,
  }: {
    children: ReactNode;
    onSubmit: (data: { updatedValue: number }) => void | Promise<void>;
  }) => (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const input = event.currentTarget.querySelector<HTMLInputElement>(
          'input[name="updatedValue"]',
        );
        void onSubmit({ updatedValue: Number(input?.value ?? 0) });
      }}
    >
      {children}
    </form>
  ),
}));

vi.mock("../form/Input/InputRHF", () => ({
  default: () => <input aria-label="updatedValue" />,
}));

describe("PedCardForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initializes the pedcard when it is not initialized yet", async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    render(
      <QueryClientProvider client={queryClient}>
        <PedCardForm initialized={false} balance={null} />
      </QueryClientProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Initialiser" }));

    await waitFor(() => {
      expect(mockCreatePedCardEntry).toHaveBeenCalledOnce();
      expect(mockCreatePedCardEntry).toHaveBeenCalledWith({
        type: "INITIAL_BALANCE",
        value: 0,
      });
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ["pedCard"],
      });
    });
  });

  it("creates an adjustment entry when the pedcard is already initialized", async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <PedCardForm initialized={true} balance={100} />
      </QueryClientProvider>,
    );

    const input = container.querySelector<HTMLInputElement>(
      'input[name="updatedValue"]',
    );

    expect(input).not.toBeNull();
    await user.clear(input as HTMLInputElement);
    await user.type(input as HTMLInputElement, "130");
    await user.click(screen.getByRole("button", { name: "Ajuster" }));

    await waitFor(() => {
      expect(mockCreatePedCardEntry).toHaveBeenCalledOnce();
      expect(mockCreatePedCardEntry).toHaveBeenCalledWith({
        type: "ADJUSTMENT",
        value: 30,
      });
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ["pedCard"],
      });
    });
  });
});
