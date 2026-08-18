import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { InvalidateQueryAndKeys } from "@/lib/react-query/InvalidateQueryAndKeys";
import useUpdateTransactionsStatus from "../useTransactionMutation";

const { updateStatusMock } = vi.hoisted(() => ({
  updateStatusMock: vi.fn(),
}));

vi.mock("@/shared/services/transactionsApi", () => ({
  default: class {
    updateStatus = updateStatusMock;
  },
}));

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe("useUpdateTransactionsStatus", () => {
  it("invalidates related queries after a successful status update", async () => {
    updateStatusMock.mockResolvedValue(undefined);
    const invalidateSpy = vi
      .spyOn(InvalidateQueryAndKeys, "transactionStatusMutation")
      .mockResolvedValue(undefined as never);

    const { result } = renderHook(() => useUpdateTransactionsStatus(), {
      wrapper: createWrapper(
        new QueryClient({
          defaultOptions: { queries: { retry: false } },
        }),
      ),
    });

    await act(async () => {
      await result.current.statusMutation.mutateAsync({
        row: { id: "transaction-1", item: { id: "item-1" } },
        status: "SOLDED",
      } as never);
    });

    await waitFor(() => {
      expect(updateStatusMock).toHaveBeenCalledWith({
        id: "transaction-1",
        status: "SOLDED",
      });
      expect(invalidateSpy).toHaveBeenCalledWith({ itemId: "item-1" });
    });
  });
});
