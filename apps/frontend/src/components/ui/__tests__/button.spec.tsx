import { render, screen } from "@testing-library/react";
import { Pencil } from "lucide-react";
import { describe, expect, it } from "vitest";

import { Button } from "../button";
import { baseClasses } from "../buttons.variants";

describe("Button content layout", () => {
  it("centers content with flex in the base classes", () => {
    for (const cls of ["inline-flex", "items-center", "justify-center"]) {
      expect(baseClasses).toContain(cls);
    }
  });

  it("applies the flex centering to the rendered button", () => {
    render(
      <Button variant="primary" size="icon" aria-label="Save" icon={Pencil} />,
    );
    const button = screen.getByRole("button", { name: "Save" });

    expect(button.className).toContain("inline-flex");
    expect(button.className).toContain("items-center");
    expect(button.className).toContain("justify-center");
  });
});

describe("Button variants", () => {
  it("applies primary variant classes", () => {
    render(<Button variant="primary">Primary</Button>);
    const button = screen.getByRole("button", { name: "Primary" });

    expect(button.className).toContain("bg-primary-700");
    expect(button.className).toContain("text-white");
    expect(button.className).toContain("border-primary-700");
    expect(button.className).toContain("hover:not-active:bg-primary-900");
    expect(button.className).toContain("active:bg-primary-700");
  });

  it("applies warning variant classes", () => {
    render(<Button variant="warning">Warning</Button>);
    const button = screen.getByRole("button", { name: "Warning" });

    expect(button.className).toContain("bg-button-warning-bg");
    expect(button.className).toContain("text-button-warning-text");
    expect(button.className).toContain("border-button-warning-border");
    expect(button.className).toContain("hover:bg-button-warning-hover-bg");
    expect(button.className).toContain("active:bg-button-warning-active-bg");
  });

  it("applies success variant classes", () => {
    render(<Button variant="success">Success</Button>);
    const button = screen.getByRole("button", { name: "Success" });

    expect(button.className).toContain("bg-button-success-bg");
    expect(button.className).toContain("text-button-success-text");
    expect(button.className).toContain("border-button-success-border");
    expect(button.className).toContain("hover:bg-button-success-hover-bg");
    expect(button.className).toContain("active:bg-button-success-active-bg");
  });

  it("applies destructive variant classes", () => {
    render(<Button variant="destructive">Destructive</Button>);
    const button = screen.getByRole("button", { name: "Destructive" });

    expect(button.className).toContain("bg-button-destructive-bg");
    expect(button.className).toContain("text-button-destructive-text");
    expect(button.className).toContain("border-button-destructive-border");
    expect(button.className).toContain("hover:bg-button-destructive-hover-bg");
    expect(button.className).toContain("active:bg-button-destructive-active-bg");
  });
});

describe("Button icon", () => {
  it("renders the icon before the children with default colors", () => {
    render(
      <Button variant="primary" icon={Pencil}>
        Edit
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Edit" });

    const svg = button.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute("width")).toBe("16");
    // Icon first, label second.
    expect(button.textContent).toBe("Edit");
    expect(button.firstElementChild?.tagName.toLowerCase()).toBe("svg");
  });

  it("renders an icon-only square button", () => {
    render(
      <Button
        variant="primary"
        size="icon"
        aria-label="Save"
        icon={Pencil}
      />,
    );
    const button = screen.getByRole("button", { name: "Save" });

    expect(button.querySelector("svg")).not.toBeNull();
    expect(button.textContent).toBe("");
  });

  it("applies a custom icon size", () => {
    render(<Button icon={Pencil} iconSize={24} aria-label="Edit" />);
    const button = screen.getByRole("button", { name: "Edit" });

    expect(button.querySelector("svg")?.getAttribute("width")).toBe("24");
  });

  it("renders nothing extra without an icon", () => {
    render(<Button>Plain</Button>);

    expect(
      screen.getByRole("button", { name: "Plain" }).querySelector("svg"),
    ).toBeNull();
  });

  it("keeps a single child with asChild so Slot keeps working", () => {
    render(
      <Button asChild icon={Pencil}>
        <a href="/manage">Manage</a>
      </Button>,
    );

    const link = screen.getByRole("link", { name: "Manage" });
    expect(link).toHaveAttribute("href", "/manage");
    expect(link.querySelector("svg")).toBeNull();
  });

  it("uses a tight gap-1 between icon and label content", () => {
    render(
      <Button variant="primary" icon={Pencil}>
        Edit
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Edit" });

    expect(button.className).toContain("gap-1");
    expect(button.className).not.toContain("gap-2");
  });

  it("uses no gap for icon-only buttons", () => {
    render(
      <Button variant="primary" size="icon" aria-label="Save" icon={Pencil} />,
    );
    const button = screen.getByRole("button", { name: "Save" });

    expect(button.className).toContain("gap-0");
    expect(button.className).not.toContain("gap-2");
  });
});
