import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ItemAverageBuyMarkup from "../ItemAverageBuyMarkup";

describe("ItemAverageBuyMarkup", () => {
  it("renders global and stock markups on two lines", () => {
    render(
      <ItemAverageBuyMarkup
        averageBuyMarkup={{
          global: { brut: 45.2, net: 43.87 },
          current: { brut: 12.004, net: 10.5 },
        }}
      />,
    );

    expect(screen.getByText("Global %")).toBeInTheDocument();
    expect(screen.getByText("45.20% / 43.87%")).toBeInTheDocument();
    expect(screen.getByText("Stock %")).toBeInTheDocument();
    expect(screen.getByText("12.00% / 10.50%")).toBeInTheDocument();
  });

  it("renders a dash for every null value", () => {
    render(
      <ItemAverageBuyMarkup
        averageBuyMarkup={{
          global: { brut: null, net: null },
          current: { brut: null, net: null },
        }}
      />,
    );

    expect(screen.getAllByText("- / -")).toHaveLength(2);
  });

  it("renders nothing when there is no markup", () => {
    const { container } = render(
      <ItemAverageBuyMarkup averageBuyMarkup={null} />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
