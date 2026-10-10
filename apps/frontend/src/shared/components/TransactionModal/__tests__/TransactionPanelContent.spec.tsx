import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import TransactionPanelContent from "../TransactionPanelContent";

const { mutateMock } = vi.hoisted(() => ({
  mutateMock: vi.fn(),
}));

vi.mock("@/shared/hooks/useTransactionMutation", () => ({
  default: () => ({
    createMutation: {
      mutate: mutateMock,
      isPending: false,
      isError: false,
      error: null,
    },
  }),
}));

const ITEM = {
  id: "sword",
  name: "Sword",
  value: 100,
  stock: 5,
  type: { hasTierOption: true, isStackable: false },
};

describe("TransactionPanelContent instance sell", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("locks the quantity to 1 for a single-instance sale", () => {
    render(
      <TransactionPanelContent
        item={ITEM as never}
        onBack={() => {}}
        modalParams={{
          action: "sell",
          itemId: "sword",
          quantity: 1,
          ttc: 100,
          lotId: "lot-1",
        }}
      />,
    );

    expect(screen.getByLabelText("Quantite")).toHaveAttribute("readonly");
  });

  it("forwards the lot id to the sale mutation", async () => {
    const user = userEvent.setup();
    render(
      <TransactionPanelContent
        item={ITEM as never}
        onBack={() => {}}
        modalParams={{
          action: "sell",
          itemId: "sword",
          quantity: 1,
          ttc: 100,
          lotId: "lot-1",
        }}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Vendre" }));

    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalledWith(
        expect.objectContaining({ action: "sell", lotId: "lot-1" }),
        expect.anything(),
      );
    });
  });

  it("keeps an editable quantity for regular sales", () => {
    render(
      <TransactionPanelContent
        item={ITEM as never}
        onBack={() => {}}
        modalParams={{ action: "sell", itemId: "sword", quantity: 2, ttc: 200 }}
      />,
    );

    expect(screen.getByLabelText("Quantite")).not.toHaveAttribute("readonly");
  });
});

describe("TransactionPanelContent free mode", () => {
  const BUY_PARAMS = {
    action: "buy" as const,
    itemId: "sword",
    quantity: 1,
    ttc: 100,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  async function switchToFreeMode(user: ReturnType<typeof userEvent.setup>) {
    render(
      <TransactionPanelContent
        item={ITEM as never}
        onBack={() => {}}
        modalParams={BUY_PARAMS}
      />,
    );
    await user.click(screen.getByRole("checkbox", { name: "Auction" }));
  }

  it("accepts a decimal TTC once auction is unchecked", async () => {
    const user = userEvent.setup();
    await switchToFreeMode(user);

    const ttcInput = screen.getByLabelText("Achat");
    await user.clear(ttcInput);
    await user.type(ttcInput, "124.2");
    await user.click(screen.getByRole("button", { name: "Acheter" }));

    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalledWith(
        expect.objectContaining({
          values: expect.objectContaining({ ttc: 124.2, isAuction: false }),
        }),
        expect.anything(),
      );
    });
  });

  it("nudges the TTC with the stepper buttons", async () => {
    const user = userEvent.setup();
    await switchToFreeMode(user);

    const incrementButtons = screen.getAllByRole("button", {
      name: "Augmenter",
    });
    // Fee stepper first, TTC stepper second.
    await user.click(incrementButtons[2]);

    expect(screen.getByLabelText("Achat")).toHaveValue("101");
  });
});
