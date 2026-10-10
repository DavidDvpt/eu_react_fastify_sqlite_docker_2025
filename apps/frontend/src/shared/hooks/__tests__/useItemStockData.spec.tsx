import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { StockLineResponse } from "@/api/generated/react-query/model";
import useItemStock from "../rqFetchHooks/useItemStockData";

const { itemStockMock, systemDatasMock } = vi.hoisted(() => ({
  itemStockMock: vi.fn(),
  systemDatasMock: vi.fn(),
}));

vi.mock("@/api/generated/react-query/entropiaManagerAPI", () => ({
  useGetItemStockApiV2ItemsIdStockGet: (
    id: string,
    options?: { query?: UseQueryOptions<StockLineResponse[]> },
  ) =>
    useQuery({
      queryKey: ["item-stock", id],
      queryFn: itemStockMock,
      staleTime: options?.query?.staleTime,
      enabled: options?.query?.enabled,
      initialData: options?.query?.initialData,
      initialDataUpdatedAt: options?.query?.initialDataUpdatedAt,
    }),
}));

vi.mock("@/shared/hooks/rqFetchHooks/useSystemDatas", () => ({
  default: (...args: unknown[]) => systemDatasMock(...args),
}));

function mockSystemDatas() {
  systemDatasMock.mockReturnValue({
    items: {
      itemDatas: [{ id: "sword", name: "Sword", value: 100 }],
      isLoading: false,
      isError: false,
    },
  });
}

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

function freshClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
}

describe("useItemStock", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSystemDatas();
    itemStockMock.mockResolvedValue([
      { itemId: "sword", quantity: 1, isStackable: false, lotId: "lot-1", tierLevel: 3 },
      { itemId: "sword", quantity: 1, isStackable: false, lotId: "lot-2", tierLevel: 5 },
    ]);
  });

  it("counts non-stackable instances and exposes their lot identifiers", async () => {
    const { result } = renderHook(() => useItemStock({ itemId: "sword" }), {
      wrapper: createWrapper(freshClient()),
    });

    await waitFor(() => {
      expect(result.current.itemWithStock).toEqual({
        id: "sword",
        name: "Sword",
        value: 100,
        stock: 2,
        lots: [
          { lotId: "lot-1", tierLevel: 3 },
          { lotId: "lot-2", tierLevel: 5 },
        ],
      });
    });
  });

  it("aggregates stackable lines into a single stock without lots", async () => {
    itemStockMock.mockResolvedValue([
      { itemId: "sword", quantity: 4, isStackable: true, lotId: null, tierLevel: null },
      { itemId: "sword", quantity: 6, isStackable: true, lotId: null, tierLevel: null },
    ]);

    const { result } = renderHook(() => useItemStock({ itemId: "sword" }), {
      wrapper: createWrapper(freshClient()),
    });

    await waitFor(() => {
      expect(result.current.itemWithStock).toEqual({
        id: "sword",
        name: "Sword",
        value: 100,
        stock: 10,
        lots: [],
      });
    });
  });

  it("returns zero stock when the item holds no line", async () => {
    itemStockMock.mockResolvedValue([]);

    const { result } = renderHook(() => useItemStock({ itemId: "sword" }), {
      wrapper: createWrapper(freshClient()),
    });

    await waitFor(() => {
      expect(result.current.itemWithStock).toEqual({
        id: "sword",
        name: "Sword",
        value: 100,
        stock: 0,
        lots: [],
      });
    });
  });

  it("returns null for an unknown item", async () => {
    const { result } = renderHook(() => useItemStock({ itemId: "unknown" }), {
      wrapper: createWrapper(freshClient()),
    });

    await waitFor(() => {
      expect(itemStockMock).toHaveBeenCalled();
      expect(result.current.itemWithStock).toBeNull();
    });
  });

  it("returns null without an item id", async () => {
    const { result } = renderHook(() => useItemStock({}), {
      wrapper: createWrapper(freshClient()),
    });

    await waitFor(() => {
      expect(result.current.itemWithStock).toBeNull();
    });
  });

  it("serves inventory-cached lines instantly without fetching", async () => {
    const queryClient = freshClient();
    queryClient.setQueryData(["stock", "items-stock"], [
      { itemId: "sword", quantity: 1, isStackable: false, lotId: "lot-9", tierLevel: 7 },
    ]);

    const { result } = renderHook(() => useItemStock({ itemId: "sword" }), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.itemWithStock).toEqual({
        id: "sword",
        name: "Sword",
        value: 100,
        stock: 1,
        lots: [{ lotId: "lot-9", tierLevel: 7 }],
      });
    });
    expect(itemStockMock).not.toHaveBeenCalled();
  });

  it("fetches normally on a deep link with an empty list cache", async () => {
    const { result } = renderHook(() => useItemStock({ itemId: "sword" }), {
      wrapper: createWrapper(freshClient()),
    });

    await waitFor(() => {
      expect(itemStockMock).toHaveBeenCalled();
      expect(result.current.itemWithStock?.stock).toBe(2);
    });
  });
});
