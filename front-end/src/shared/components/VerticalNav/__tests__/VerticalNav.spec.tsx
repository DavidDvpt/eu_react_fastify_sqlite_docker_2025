import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { VerticalNav } from "../VerticalNav";

describe("VerticalNav", () => {
  it("marks the route item as active and bold", () => {
    render(
      <MemoryRouter initialEntries={["/manage/item/42/edit"]}>
        <VerticalNav
          items={[
            { key: "cat", content: "Categorie", to: "/manage/category" },
            { key: "item", content: "Item", to: "/manage/item" },
          ]}
        />
      </MemoryRouter>
    );

    const itemLink = screen.getByRole("link", { name: "Item" });
    const categoryLink = screen.getByRole("link", { name: "Categorie" });

    expect(itemLink).toHaveAttribute("data-active", "true");
    expect(categoryLink).toHaveAttribute("data-active", "false");
  });

  it("supports action-only items", () => {
    const onClick = vi.fn();

    render(
      <MemoryRouter>
        <VerticalNav items={[{ key: "refresh", content: "Refresh", onClick }]} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: "Refresh" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
