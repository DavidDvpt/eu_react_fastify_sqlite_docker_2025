import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import useInventoryRefresh from "../useInventoryRefresh";

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe("useInventoryRefresh", () => {
  it("invalidates pedCard when refreshing inventory after a transaction mutation", async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    const onBack = vi.fn();

    const { result } = renderHook(
      () => useInventoryRefresh("item-1", onBack),
      {
        wrapper: createWrapper(queryClient),
      },
    );

    await result.current();

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["pedCard"] });
      expect(onBack).toHaveBeenCalledOnce();
    });
  });
});
