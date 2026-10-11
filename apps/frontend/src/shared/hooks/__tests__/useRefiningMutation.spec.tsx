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
  useCreateRefinageSessionApiV2RefinageCreatePost: () => ({
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
  it("posts a refining session with result, clickCount, origin and provenance", async () => {
    const { result } = renderMutationHook();

    await result.current.refineMutation.mutateAsync({
      itemId: "ore-a",
      result: "gold-bars",
      clickCount: 6,
      origin: [
        { origin: "ore-a", quantity: 3 },
        { origin: "ore-b", quantity: 2 },
      ],
      provenance: ["TRADE", "MINING"],
    });

    await waitFor(() => {
      expect(createMutateMock).toHaveBeenCalledWith({
        data: {
          result: "gold-bars",
          clickCount: 6,
          origin: [
            { origin: "ore-a", quantity: 3 },
            { origin: "ore-b", quantity: 2 },
          ],
          provenance: ["TRADE", "MINING"],
        },
      });
    });
  });

  it("invalidates the stock of the clicked item on success", async () => {
    const { result } = renderMutationHook();

    await result.current.refineMutation.mutateAsync({
      itemId: "ore-a",
      result: "gold-bars",
      clickCount: 6,
      origin: [{ origin: "ore-a", quantity: 3 }],
      provenance: [],
    });

    await waitFor(() => {
      expect(invalidationMock).toHaveBeenCalledWith({ itemId: "ore-a" });
    });
  });
});