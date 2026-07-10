import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import useUpdateRunningTransactionsStatus from "../useUpdateRunningTransactionsStatus";

const { updateRunningTransactionLineStatusMock } = vi.hoisted(() => ({
  updateRunningTransactionLineStatusMock: vi.fn(),
}));

vi.mock("@/lib/services/transaction.api", () => ({
  updateRunningTransactionLineStatus: updateRunningTransactionLineStatusMock,
}));

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe("useUpdateRunningTransactionsStatus", () => {
  it("invalidates pedCard after a successful status update", async () => {
    updateRunningTransactionLineStatusMock.mockResolvedValue(undefined);

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useUpdateRunningTransactionsStatus(), {
      wrapper: createWrapper(queryClient),
    });

    result.current.mutate({
      transactionLotIds: ["line-1", "line-2"],
      status: "SOLDED",
    });

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["pedCard"] });
    });
  });
});
