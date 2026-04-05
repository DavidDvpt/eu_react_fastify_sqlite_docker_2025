import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";

import ManagePage from "../ManagePage";

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/manage/:tab" element={<ManagePage />} />
        <Route path="/manage/:tab/create" element={<ManagePage />} />
        <Route path="/manage/:tab/:id/edit" element={<ManagePage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("ManagePage", () => {
  it("renders list mode for a tab", () => {
    renderAt("/manage/type");

    expect(screen.getByRole("heading", { name: "Types" })).toBeInTheDocument();
    expect(screen.getByText('Mode liste pour "type" (table + lignes cliquables).')).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Creer" })).toHaveAttribute("href", "/manage/type/create");
  });

  it("renders create mode from route segment", () => {
    renderAt("/manage/category/create");

    expect(screen.getByRole("heading", { name: "Categories" })).toBeInTheDocument();
    expect(screen.getByText('Mode creation pour "category".')).toBeInTheDocument();
  });

  it("renders edit mode from route segment", () => {
    renderAt("/manage/item/42/edit");

    expect(screen.getByRole("heading", { name: "Items" })).toBeInTheDocument();
    expect(screen.getByText('Mode edition pour "item" (id: 42).')).toBeInTheDocument();
  });
});
