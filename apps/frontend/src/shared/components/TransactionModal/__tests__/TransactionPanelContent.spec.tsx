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
