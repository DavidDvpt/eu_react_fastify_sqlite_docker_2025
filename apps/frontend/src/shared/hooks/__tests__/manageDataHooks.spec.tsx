import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import useSystemDatas from "../rqFetchHooks/useSystemDatas";

const { categoriesGetMock, typesGetMock, itemsGetMock } = vi.hoisted(() => ({
  categoriesGetMock: vi.fn(),
  typesGetMock: vi.fn(),
  itemsGetMock: vi.fn(),
}));

vi.mock("@/store/hooks", () => ({
  useAppSelector: () => true,
}));

vi.mock("@/shared/services", async () => {
  const actual =
    await vi.importActual<typeof import("@/shared/services")>(
      "@/shared/services",
    );

  return {
    ...actual,
    CategoriesApi: class {
      get = categoriesGetMock;
    },
    TypesApi: class {
      get = typesGetMock;
    },
    ItemsApi: class {
      get = itemsGetMock;
    },
  };
});

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe("manage data hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    categoriesGetMock.mockResolvedValue([]);
    typesGetMock.mockResolvedValue([]);
    itemsGetMock.mockResolvedValue([]);
  });

  it("fetches categories", async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    categoriesGetMock.mockResolvedValue([{ id: "cat-1", name: "Material" }]);

    const { result } = renderHook(() => useSystemDatas(), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.categories.data).toEqual([
        { id: "cat-1", name: "Material" },
      ]);
    });
  });

  it("fetches types enriched with their category", async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    categoriesGetMock.mockResolvedValue([{ id: "cat-1", name: "Material" }]);
    typesGetMock.mockResolvedValue([
      { id: "type-1", name: "Ore", categoryId: "cat-1" },
    ]);

    const { result } = renderHook(() => useSystemDatas(), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.types.typeDatas).toEqual([
        {
          id: "type-1",
          name: "Ore",
          categoryId: "cat-1",
          category: { id: "cat-1", name: "Material" },
        },
      ]);
    });
  });

  it("fetches items enriched with their type", async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    categoriesGetMock.mockResolvedValue([{ id: "cat-1", name: "Material" }]);
    typesGetMock.mockResolvedValue([
      { id: "type-1", name: "Ore", categoryId: "cat-1" },
    ]);
    itemsGetMock.mockResolvedValue([
      { id: "item-1", name: "Belkar", typeId: "type-1", value: 12.5 },
    ]);

    const { result } = renderHook(() => useSystemDatas(), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.items.itemDatas).toEqual([
        {
          id: "item-1",
          name: "Belkar",
          typeId: "type-1",
          value: 12.5,
          type: {
            id: "type-1",
            name: "Ore",
            categoryId: "cat-1",
            category: { id: "cat-1", name: "Material" },
          },
        },
      ]);
    });
  });
});
