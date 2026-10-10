import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import StockLotsSection from "../StockLotsSection";

const LOTS = [
  {
    id: "lot-1",
    itemId: "sword",
    isActive: true,
    tierLevel: 3,
    createdAt: "2024-01-01T00:00:00Z",
    initialQuantity: 1,
    quantityRemaining: 1,
  },
  {
    id: "lot-2",
    itemId: "sword",
    isActive: true,
    tierLevel: 5,
    createdAt: "2024-02-01T00:00:00Z",
    initialQuantity: 1,
    quantityRemaining: 1,
  },
];

describe("StockLotsSection", () => {
  it("shows a tier column for tierable items", () => {
    render(<StockLotsSection lots={LOTS as never} isTierable />);

    expect(screen.getByText("Tier")).toBeInTheDocument();
    expect(screen.getByText("T3")).toBeInTheDocument();
    expect(screen.getByText("T5")).toBeInTheDocument();
  });

  it("hides the tier column otherwise", () => {
    render(<StockLotsSection lots={LOTS as never} />);

    expect(screen.queryByText("Tier")).toBeNull();
    expect(screen.queryByText("T3")).toBeNull();
  });

  it("returns null without lots", () => {
    const { container } = render(<StockLotsSection lots={null} />);

    expect(container).toBeEmptyDOMElement();
  });
});
