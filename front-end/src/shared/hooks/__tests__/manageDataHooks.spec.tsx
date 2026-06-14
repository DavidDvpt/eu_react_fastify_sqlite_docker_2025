import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import useCategories from "../useCategories";
import useTypes from "../useTypes";
import useItems from "../useItems";

const { getCategoriesMock, getTypesMock, getItemsMock } = vi.hoisted(() => ({
  getCategoriesMock: vi.fn(),
  getTypesMock: vi.fn(),
  getItemsMock: vi.fn(),
}));

vi.mock("@/pages/managePage/manage", async () => {
  const actual = await vi.importActual<typeof import("@/pages/managePage")>(
    "@/pages/managePage/manage",
  );
  return {
    ...actual,
    getCategories: getCategoriesMock,
    getTypes: getTypesMock,
    getItems: getItemsMock,
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
  });

  it("fetches categories and exposes invalidateCategories", async () => {
    getCategoriesMock.mockResolvedValue([{ id: "cat-1", name: "Material" }]);

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useCategories(), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.data).toEqual([{ id: "cat-1", name: "Material" }]);
    });

    await result.current.invalidateCategories();
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["categories"] });
  });

  it("fetches types and exposes invalidateTypes", async () => {
    getTypesMock.mockResolvedValue([{ id: "type-1", name: "Ore" }]);

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useTypes({}), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.types).toEqual([
        { id: "type-1", name: "Ore", categoryName: "Unknown" },
      ]);
    });

    await result.current.invalidateTypes();
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["types"] });
  });

  it("does not fetch items when disabled", () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    renderHook(() => useItems({ enabled: false }), {
      wrapper: createWrapper(queryClient),
    });

    expect(getItemsMock).not.toHaveBeenCalled();
  });
});
