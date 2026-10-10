import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import useInventoryStockData from "../rqFetchHooks/useInventoryStockData";

const { inventoryStockMock, systemDatasMock } = vi.hoisted(() => ({
  inventoryStockMock: vi.fn(),
  systemDatasMock: vi.fn(),
}));

vi.mock("@/api/generated/react-query/entropiaManagerAPI", () => ({
  useListInventoryStockApiV2InventoryStockGet: () =>
    useQuery({
      queryKey: ["inventory-stock"],
      queryFn: inventoryStockMock,
    }),
}));

vi.mock("@/shared/hooks/rqFetchHooks/useSystemDatas", () => ({
  default: (...args: unknown[]) => systemDatasMock(...args),
}));

const ITEMS = [
  { id: "ore", name: "Ore", value: 2 },
  { id: "sword", name: "Sword", value: 100 },
];

function mockSystemDatas(itemDatas: unknown[] = ITEMS) {
  systemDatasMock.mockReturnValue({
    items: { itemDatas, isLoading: false, isError: false },
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

describe("useInventoryStockData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSystemDatas();
    inventoryStockMock.mockResolvedValue([
      { itemId: "ore", quantity: 10, isStackable: true, lotId: null, tierLevel: null },
      { itemId: "sword", quantity: 1, isStackable: false, lotId: "lot-1", tierLevel: 3 },
      { itemId: "sword", quantity: 1, isStackable: false, lotId: "lot-2", tierLevel: 5 },
    ]);
  });

  it("sums lines per item and exposes lot identifiers for non-stackables", async () => {
    const { result } = renderHook(() => useInventoryStockData(), {
      wrapper: createWrapper(freshClient()),
    });

    await waitFor(() => {
      expect(result.current.inventoryStock).toEqual([
        { id: "ore", name: "Ore", value: 2, stock: 10, lots: [] },
        {
          id: "sword",
          name: "Sword",
          value: 100,
          stock: 2,
          lots: [
            { lotId: "lot-1", tierLevel: 3 },
            { lotId: "lot-2", tierLevel: 5 },
          ],
        },
      ]);
    });
  });

  it("computes the total stock value from aggregated quantities", async () => {
    const { result } = renderHook(() => useInventoryStockData(), {
      wrapper: createWrapper(freshClient()),
    });

    await waitFor(() => {
      // 10 * 2 + 2 * 100
      expect(result.current.inventoryStockValue).toBe(220);
    });
  });

  it("defaults to zero stock without lines", async () => {
    inventoryStockMock.mockResolvedValue([]);

    const { result } = renderHook(() => useInventoryStockData(), {
      wrapper: createWrapper(freshClient()),
    });

    await waitFor(() => {
      expect(result.current.inventoryStock).toEqual([
        { id: "ore", name: "Ore", value: 2, stock: 0, lots: [] },
        { id: "sword", name: "Sword", value: 100, stock: 0, lots: [] },
      ]);
      expect(result.current.inventoryStockValue).toBe(0);
    });
  });

  it("returns no items without item datas", async () => {
    systemDatasMock.mockReturnValue({
      items: { itemDatas: undefined, isLoading: false, isError: false },
    });

    const { result } = renderHook(() => useInventoryStockData(), {
      wrapper: createWrapper(freshClient()),
    });

    await waitFor(() => {
      expect(result.current.inventoryStock).toEqual([]);
    });
  });

  it("surfaces stock query errors", async () => {
    inventoryStockMock.mockRejectedValue(new Error("boom"));

    const { result } = renderHook(() => useInventoryStockData(), {
      wrapper: createWrapper(freshClient()),
    });

    await waitFor(() => {
      expect(result.current.isInventoryStockError).toBeTruthy();
    });
  });
});
