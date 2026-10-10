import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import useTransactionsMutation from "../useTransactionMutation";

const { createMutateMock } = vi.hoisted(() => ({
  createMutateMock: vi.fn(),
}));

vi.mock("@/api/generated/react-query/entropiaManagerAPI", () => ({
  useCreateTransactionApiV2TransactionsPost: () => ({
    mutateAsync: createMutateMock,
  }),
  usePatchStatusApiV2TransactionsIdStatusPatch: () => ({
    mutateAsync: vi.fn(),
  }),
}));

const ITEM = {
  id: "sword",
  name: "Sword",
  value: 100,
  stock: 2,
  type: { hasTierOption: true, isStackable: false },
};

const VALUES = {
  action: "sell",
  autoCalculation: true,
  quantity: 1,
  fee: 0,
  ttc: 100,
  status: "RUNNING",
} as const;

function renderMutationHook() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return renderHook(() => useTransactionsMutation(), { wrapper });
}

describe("useTransactionsMutation create", () => {
  it("sends the lot id when selling a single instance", async () => {
    const { result } = renderMutationHook();

    await result.current.createMutation.mutateAsync({
      values: { ...VALUES },
      item: ITEM as never,
      action: "sell",
      lotId: "lot-1",
    });

    await waitFor(() => {
      expect(createMutateMock).toHaveBeenCalledWith({
        data: expect.objectContaining({
          transactionType: "SELL",
          itemId: "sword",
          quantity: 1,
          lotId: "lot-1",
        }),
      });
    });
  });

  it("omits the lot id for regular sales", async () => {
    const { result } = renderMutationHook();

    await result.current.createMutation.mutateAsync({
      values: { ...VALUES },
      item: ITEM as never,
      action: "sell",
    });

    await waitFor(() => {
      expect(createMutateMock).toHaveBeenCalledWith({
        data: expect.not.objectContaining({ lotId: expect.anything() }),
      });
    });
  });
});
