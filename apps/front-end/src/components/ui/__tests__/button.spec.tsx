import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "../button";

describe("Button variants", () => {
  it("applies primary variant classes", () => {
    render(<Button variant="primary">Primary</Button>);
    const button = screen.getByRole("button", { name: "Primary" });

    expect(button.className).toContain("bg-primary-500");
    expect(button.className).toContain("text-white");
    expect(button.className).toContain("border-primary-500");
    expect(button.className).toContain("hover:not-active:bg-primary-700");
    expect(button.className).toContain("active:bg-primary-500");
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
