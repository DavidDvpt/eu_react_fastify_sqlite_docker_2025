import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import useItemAverageBuyMarkup from "../rqFetchHooks/useItemAverageBuyMarkupData";

const { averageBuyMarkupGetMock } = vi.hoisted(() => ({
  averageBuyMarkupGetMock: vi.fn(),
}));

vi.mock("@/api/generated/react-query/entropiaManagerAPI", () => ({
  useGetItemAverageBuyMarkupApiV2ItemsIdAverageBuyMarkupGet: () =>
    useQuery({
      queryKey: ["item-average-buy-markup"],
      queryFn: averageBuyMarkupGetMock,
    }),
}));

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe("useItemAverageBuyMarkup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    averageBuyMarkupGetMock.mockResolvedValue({
      global: { brut: 45.2, net: 43.87 },
      current: { brut: null, net: null },
    });
  });

  it("exposes the average buy markup of an item", async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const { result } = renderHook(
      () => useItemAverageBuyMarkup({ itemId: "item-1" }),
      { wrapper: createWrapper(queryClient) },
    );

    await waitFor(() => {
      expect(result.current.averageBuyMarkup).toEqual({
        global: { brut: 45.2, net: 43.87 },
        current: { brut: null, net: null },
      });
    });
  });

  it("returns nothing without an item id", async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const { result } = renderHook(() => useItemAverageBuyMarkup({}), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.averageBuyMarkup).toBeNull();
    });
  });
});
