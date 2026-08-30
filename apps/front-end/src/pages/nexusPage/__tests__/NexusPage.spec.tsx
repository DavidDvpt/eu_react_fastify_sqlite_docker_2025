import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import NexusPage from "../NexusPage";

vi.mock("@/shared/hooks", () => ({
  useNexusData: () => ({
    nexusRows: [
      {
        id: "1",
        name: "Finders",
        itemCount: 12,
        imageMissingCount: 2,
        changeCount: 3,
        detailMissing: true,
        createdAt: "2026-08-30T10:00:00.000Z",
        insertedAt: null,
        updatedAt: "2026-08-30T11:00:00.000Z",
      },
    ],
    isNexusLoading: false,
    isNexusError: false,
  }),
  useNexusMutation: () => ({
    initMutation: {
      isPending: false,
      mutate: vi.fn(),
    },
  }),
}));

describe("NexusPage", () => {
  it("renders the page content", () => {
    render(<NexusPage />);

    expect(screen.getByText("Type")).toBeInTheDocument();
    expect(screen.getByText("Finders")).toBeInTheDocument();
    expect(screen.getByText("Images KO")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Init" })).toBeDisabled();
  });
});
