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
    getCategories: vi.fn().mockResolvedValue([
      { id: "cat-1", name: "Material", userId: null },
      { id: "cat-2", name: "Custom Cat", userId: "user-1" },
    ]),
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
  it("renders list mode for a tab", () => {
    renderAt("/manage/type");

    expect(screen.getByRole("heading", { name: "Types" })).toBeInTheDocument();
    expect(screen.getByText('Mode liste pour "type" (table + lignes cliquables).')).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Creer" })).toHaveAttribute("href", "/manage/type/create");
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

  it("renders edit mode from route segment", () => {
    renderAt("/manage/item/42/edit");

    expect(screen.getByRole("heading", { name: "Items" })).toBeInTheDocument();
    expect(screen.getByText('Mode edition pour "item" (id: 42).')).toBeInTheDocument();
  });
});
