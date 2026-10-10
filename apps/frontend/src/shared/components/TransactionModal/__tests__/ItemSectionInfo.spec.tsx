import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ItemWithStock } from "@/shared/types";
import ItemSectionInfo from "../ItemSectionInfo";

const { useItemAverageBuyMarkupMock } = vi.hoisted(() => ({
  useItemAverageBuyMarkupMock: vi.fn(),
}));

vi.mock("@/shared/hooks/rqFetchHooks/useItemAverageBuyMarkupData", () => ({
  default: useItemAverageBuyMarkupMock,
}));

const item: ItemWithStock = {
  id: "item-1",
  name: "Belkar",
  typeId: "type-1",
  imageUrlId: "belkar",
  value: 12.5,
  description: null,
  weight: null,
  decay: null,
  isLimited: false,
  isActive: true,
  isUntradeable: false,
  isRare: false,
  userId: "user-1",
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: null,
  type: null,
  stock: 4,
};

describe("ItemSectionInfo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useItemAverageBuyMarkupMock.mockReturnValue({
      averageBuyMarkup: {
        global: { brut: 45.2, net: 43.87 },
        current: { brut: 12, net: null },
      },
    });
  });

  it("shows the item unit cost, the stock and the average buy markup", () => {
    render(<ItemSectionInfo itemWithStock={item} />);

    expect(screen.getByText("Belkar")).toBeInTheDocument();
    expect(screen.getByText("Stock:")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("45.20% / 43.87%")).toBeInTheDocument();
    expect(screen.getByText("12.00% / -")).toBeInTheDocument();
  });

  it("queries the average buy markup of the displayed item", () => {
    render(<ItemSectionInfo itemWithStock={item} />);

    expect(useItemAverageBuyMarkupMock).toHaveBeenCalledWith({
      itemId: "item-1",
    });
  });

  it("hides the markup block when the average is unavailable", () => {
    useItemAverageBuyMarkupMock.mockReturnValue({
      averageBuyMarkup: null,
    });

    render(<ItemSectionInfo itemWithStock={item} />);

    expect(screen.queryByText("Global %")).not.toBeInTheDocument();
  });
});
