import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import ManagePage from "../ManagePage";

vi.mock("@/modules/manage", async () => {
  const actual = await vi.importActual<typeof import("@/modules/manage")>(
    "@/modules/manage"
  );

  return {
    ...actual,
    CATEGORIES_ROUTE: "http://api.test/categories",
    TYPES_ROUTE: "http://api.test/types",
    ITEMS_ROUTE: "http://api.test/items",
    useCategories: vi.fn(() => ({
      data: [
        { id: "cat-1", name: "Material", userId: null },
        { id: "cat-2", name: "Custom Cat", userId: "user-1" },
      ],
      isPending: false,
      isError: false,
    })),
    useTypes: vi.fn(() => ({
      data: [
        { id: "type-1", name: "Ore", categoryId: "cat-1", userId: null },
      ],
      isPending: false,
      isError: false,
    })),
    useItems: vi.fn(() => ({
      data: [
        { id: "item-1", name: "Oil", itemTypeId: "type-1", value: 10, isLimited: false, userId: null },
      ],
      isPending: false,
      isError: false,
    })),
  };
});

function renderAt(path: string) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/manage/:tab" element={<ManagePage />} />
          <Route path="/manage/:tab/create" element={<ManagePage />} />
          <Route path="/manage/:tab/:id/edit" element={<ManagePage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("ManagePage", () => {
  it("renders types table for type tab", async () => {
    renderAt("/manage/type");

    expect(screen.getByRole("heading", { name: "Types" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Creer" })).toHaveAttribute("href", "/manage/type/create");
    expect(await screen.findByRole("link", { name: "Ore" })).toHaveAttribute(
      "href",
      "/manage/type/type-1/edit"
    );
  });

  it("renders categories table for category tab", async () => {
    renderAt("/manage/category/create");

    expect(screen.getByRole("heading", { name: "Categories" })).toBeInTheDocument();
    expect(await screen.findByRole("link", { name: "Material" })).toHaveAttribute(
      "href",
      "/manage/category/cat-1/edit"
    );
    expect(screen.getByText("Global")).toBeInTheDocument();
    expect(screen.getByText("Custom")).toBeInTheDocument();
  });

  it("renders items table for item tab", async () => {
    renderAt("/manage/item/42/edit");

    expect(screen.getByRole("heading", { name: "Items" })).toBeInTheDocument();
    expect(await screen.findByRole("link", { name: "Oil" })).toHaveAttribute(
      "href",
      "/manage/item/item-1/edit"
    );
  });
});
