import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import NavButton from "../navbar/NavButton";

describe("NavButton", () => {
  it("is bold when the current route is active", () => {
    render(
      <MemoryRouter initialEntries={["/manage/type"]}>
        <NavButton
          label="Manage"
          route="/manage"
          selected={false}
          adminOnly={true}
        />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: "Manage" })).toHaveAttribute(
      "data-active",
      "true"
    );
  });

  it("is not bold when route is inactive", () => {
    render(
      <MemoryRouter initialEntries={["/home"]}>
        <NavButton
          label="Manage"
          route="/manage"
          selected={false}
          adminOnly={true}
        />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: "Manage" })).toHaveAttribute(
      "data-active",
      "false"
    );
  });
});
