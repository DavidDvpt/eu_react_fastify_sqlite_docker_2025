import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import useRefiningMutation from "../useRefiningMutation";

const { createMutateMock, invalidationMock } = vi.hoisted(() => ({
  createMutateMock: vi.fn(),
  invalidationMock: vi.fn(),
}));

vi.mock("@/api/generated/react-query/entropiaManagerAPI", () => ({
  useCreateRefiningSessionApiV2SessionsRefinagePost: () => ({
    mutateAsync: createMutateMock,
  }),
}));

vi.mock("@/lib/react-query/InvalidateQueryAndKeys", () => ({
  InvalidateQueryAndKeys: {
    refiningMutation: invalidationMock,
  },
}));

function renderMutationHook() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return renderHook(() => useRefiningMutation(), { wrapper });
}

describe("useRefiningMutation", () => {
  it("posts a refining session with its result and lot costs", async () => {
    const { result } = renderMutationHook();

    await result.current.refineMutation.mutateAsync({
      itemId: "ore-a",
      resultItemId: "gold-bars",
      clickCount: 6,
      resultQuantity: 6,
      costs: [
        { lotId: "lot-a", quantity: 18 },
        { lotId: "lot-b", quantity: 12 },
      ],
    });

    await waitFor(() => {
      expect(createMutateMock).toHaveBeenCalledWith({
        data: {
          resultItemId: "gold-bars",
          clickCount: 6,
          resultQuantity: 6,
          costs: [
            { lotId: "lot-a", quantity: 18 },
            { lotId: "lot-b", quantity: 12 },
          ],
        },
      });
    });
  });

  it("invalidates the stock of the clicked item on success", async () => {
    const { result } = renderMutationHook();

    await result.current.refineMutation.mutateAsync({
      itemId: "ore-a",
      resultItemId: "gold-bars",
      clickCount: 6,
      resultQuantity: 6,
      costs: [{ lotId: "lot-a", quantity: 18 }],
    });

    await waitFor(() => {
      expect(invalidationMock).toHaveBeenCalledWith({ itemId: "ore-a" });
    });
  });
});
