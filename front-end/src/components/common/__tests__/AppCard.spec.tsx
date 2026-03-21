import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import AppCard from "../AppCard";

describe("AppCard", () => {
  it("renders title and content", () => {
    render(<AppCard title="Card title" content={<p>Card content</p>} />);

    expect(screen.getByText("Card title")).toBeInTheDocument();
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("does not render description when not provided", () => {
    render(<AppCard title="Card title" content={<p>Card content</p>} />);

    expect(screen.queryByText("Optional description")).not.toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(
      <AppCard
        title="Card title"
        description="Optional description"
        content={<p>Card content</p>}
      />,
    );

    expect(screen.getByText("Optional description")).toBeInTheDocument();
  });

  it("uses default card variant when no variant is provided", () => {
    const { container } = render(
      <AppCard title="Card title" content={<p>Card content</p>} />,
    );

    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveClass("border-0");
    expect(root).toHaveClass("shadow-ambient-lg");
  });

  it("applies danger variant classes", () => {
    const { container } = render(
      <AppCard
        title="Card title"
        variant="warning"
        content={<p>Card content</p>}
      />,
    );

    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveClass("border-[3px]");
    expect(root).toHaveClass("border-warning-500");
    expect(root).toHaveClass("shadow-ambient-lg");
  });
});
