import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import NavButton from "../NavButton";

describe("NavButton", () => {
  it("is bold when the current route is active", () => {
    render(
      <MemoryRouter initialEntries={["/manage/type"]}>
        <NavButton
          content="Manage"
          route="/manage"
          variant="navVertical"
        />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: "Manage" })).toHaveAttribute(
      "data-active",
      "true",
    );
  });

  it("is not bold when route is inactive", () => {
    render(
      <MemoryRouter initialEntries={["/home"]}>
        <NavButton
          content="Manage"
          route="/manage"
          variant="navVertical"
        />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: "Manage" })).toHaveAttribute(
      "data-active",
      "false",
    );
  });
});
