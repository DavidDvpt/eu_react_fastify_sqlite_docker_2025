import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ItemDetail from "../ItemDetail";

const { averageBuyMarkupMock, updateTierMock } = vi.hoisted(() => ({
  averageBuyMarkupMock: vi.fn(),
  updateTierMock: vi.fn(),
}));

vi.mock("@/shared/hooks/rqFetchHooks/useItemAverageBuyMarkupData", () => ({
  default: (...args: unknown[]) => averageBuyMarkupMock(...args),
}));

vi.mock("@/api/generated/react-query/entropiaManagerAPI", () => ({
  useUpdateInventoryLotTierApiV2InventoryLotsLotIdTierPatch: () => ({
    mutateAsync: updateTierMock,
    isPending: false,
  }),
}));

function LocationProbe() {
  const location = useLocation();
  return <div data-testid="location">{`${location.pathname}${location.search}`}</div>;
}

function renderDetail(ui: ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <MemoryRouter initialEntries={["/inventory/sword"]}>
      <QueryClientProvider client={queryClient}>
        <LocationProbe />
        {ui}
      </QueryClientProvider>
    </MemoryRouter>,
  );
}

const ITEM = {
  id: "sword",
  name: "Sword",
  imageUrlId: "",
  value: 100,
  stock: 2,
  weight: null,
  isUntradeable: false,
  isRare: false,
  description: null,
  type: { hasTierOption: true, isStackable: false },
};

const LOTS = [
  {
    id: "lot-1",
    itemId: "sword",
    isActive: true,
    tierLevel: 3,
    createdAt: "2024-01-01T00:00:00Z",
    quantityRemaining: 1,
    initialQuantity: 1,
  },
  {
    id: "lot-2",
    itemId: "sword",
    isActive: true,
    tierLevel: 5,
    createdAt: "2024-02-01T00:00:00Z",
    quantityRemaining: 1,
    initialQuantity: 1,
  },
];

describe("ItemDetail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    averageBuyMarkupMock.mockReturnValue({ averageBuyMarkup: null });
  });

  it("shows the raw name and total stock in aggregated mode", () => {
    renderDetail(<ItemDetail item={ITEM as never} lots={LOTS as never} />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Sword");
    expect(screen.getByText("Quantité").nextElementSibling).toHaveTextContent("2");
  });

  it("shows MY instance with its tiered name and a quantity of 1", () => {
    renderDetail(
      <ItemDetail item={ITEM as never} lots={LOTS as never} focusedLot={LOTS[0] as never} />,
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Sword T3");
    expect(screen.getByText("Quantité").nextElementSibling).toHaveTextContent("1");

    // The tier editor stays closed until the pencil is clicked.
    expect(screen.queryByText("Modifier le tier")).toBeNull();
  });

    it("opens the editor on the focused lot only via the pencil", async () => {    const user = userEvent.setup();
    renderDetail(
      <ItemDetail item={ITEM as never} lots={LOTS as never} focusedLot={LOTS[0] as never} />,
    );

    await user.click(screen.getByRole("button", { name: "Modifier les tiers" }));

    await waitFor(() => {
      expect(screen.getByText("Modifier le tier")).toBeInTheDocument();
    });
    expect(screen.getByText("Tier actuel : T3")).toBeInTheDocument();
    expect(screen.queryByText("Tier actuel : T5")).toBeNull();
  });

  it("shows every active lot in the editor in aggregated mode", async () => {
    const user = userEvent.setup();
    renderDetail(<ItemDetail item={ITEM as never} lots={LOTS as never} />);

    await user.click(screen.getByRole("button", { name: "Modifier les tiers" }));

    expect(screen.getByText("Tier actuel : T3")).toBeInTheDocument();
    expect(screen.getByText("Tier actuel : T5")).toBeInTheDocument();
  });

  it("stays aggregated when the focused lot belongs to a stackable item", () => {
    renderDetail(
      <ItemDetail
        item={{ ...ITEM, stock: 10, type: { hasTierOption: false, isStackable: true } } as never}
        lots={[]}
        focusedLot={{ id: "lot-9", tierLevel: 4 } as never}
      />,
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Sword");
  });

  it("passes the focused lot to the sell transaction", async () => {
    const user = userEvent.setup();
    renderDetail(
      <ItemDetail item={ITEM as never} lots={LOTS as never} focusedLot={LOTS[1] as never} />,
    );

    await user.click(screen.getByRole("button", { name: "Vente" }));

    const search = screen.getByTestId("location").textContent ?? "";
    const params = new URLSearchParams(search.split("?")[1] ?? "");
    const modal = JSON.parse(params.get("transactionModal") ?? "{}");
    expect(modal.action).toBe("sell");
    expect(modal.itemId).toBe("sword");
    expect(modal.lotId).toBe("lot-2");
    expect(modal.quantity).toBe(1);
  });

  it("opens a lot-free sell transaction in aggregated mode", async () => {
    const user = userEvent.setup();
    renderDetail(<ItemDetail item={ITEM as never} lots={LOTS as never} />);

    await user.click(screen.getByRole("button", { name: "Vente" }));

    const search = screen.getByTestId("location").textContent ?? "";
    const params = new URLSearchParams(search.split("?")[1] ?? "");
    const modal = JSON.parse(params.get("transactionModal") ?? "{}");
    expect(modal.action).toBe("sell");
    expect(modal.lotId).toBeUndefined();
  });

  it("saves the tier typed in the number input without crashing", async () => {
    const user = userEvent.setup();
    updateTierMock.mockResolvedValue({ id: "lot-1", tierLevel: 4 });
    renderDetail(
      <ItemDetail item={ITEM as never} lots={LOTS as never} focusedLot={LOTS[0] as never} />,
    );

    await user.click(screen.getByRole("button", { name: "Modifier les tiers" }));
    const input = screen.getByLabelText("Nouveau tier du lot lot-1");
    await user.clear(input);
    await user.type(input, "4");
    await user.click(
      screen.getByRole("button", { name: "Enregistrer le tier du lot lot-1" }),
    );

    await waitFor(() => {
      expect(updateTierMock).toHaveBeenCalledWith({
        lotId: "lot-1",
        data: { tierLevel: 4 },
      });
    });
  });
});
