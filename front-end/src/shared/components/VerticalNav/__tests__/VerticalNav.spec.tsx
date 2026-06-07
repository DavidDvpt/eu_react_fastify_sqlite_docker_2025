import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { VerticalNav } from "../VerticalNav";

describe("VerticalNav", () => {
  it("marks the route item as active and bold", () => {
    render(
      <MemoryRouter initialEntries={["/manage/item/42/edit"]}>
        <VerticalNav
          items={[
            {
              key: "cat",
              content: "Categorie",
              route: "/manage/category",
              variant: "navVertical",
            },
            {
              key: "item",
              content: "Item",
              route: "/manage/item",
              variant: "navVertical",
            },
          ]}
        />
      </MemoryRouter>
    );

    const itemLink = screen.getByRole("link", { name: "Item" });
    const categoryLink = screen.getByRole("link", { name: "Categorie" });

    expect(itemLink).toHaveAttribute("data-active", "true");
    expect(categoryLink).toHaveAttribute("data-active", "false");
  });

  it("renders route items as links", () => {
    render(
      <MemoryRouter>
        <VerticalNav
          items={[
            {
              key: "refresh",
              content: "Refresh",
              route: "/manage/refresh",
              variant: "navVertical",
            },
          ]}
        />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: "Refresh" })).toHaveAttribute(
      "href",
      "/manage/refresh"
    );
  });
});
