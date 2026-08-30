import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import NexusPage from "../NexusPage";

vi.mock("@/shared/hooks", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/shared/hooks")>();

  return {
    ...actual,
    useNexusData: () => ({
      nexusRows: [
        {
          id: "1",
          name: "Finders",
          nexusName: "Finder Alpha",
          nexusRequestType: "finders",
          itemCount: 12,
          imageMissingCount: 2,
          changeCount: 3,
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
      updateMutation: {
        isPending: false,
        mutate: vi.fn(),
      },
    }),
  };
});

function renderPage(initialEntries: string[] = ["/nexus"]) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <NexusPage />
    </MemoryRouter>,
  );
}

describe("NexusPage", () => {
  it("renders the page content", () => {
    renderPage();

    expect(screen.getAllByText("Type")).toHaveLength(2);
    expect(screen.getByText("Finders")).toBeInTheDocument();
    expect(screen.getByText("Images KO")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Init" })).toBeDisabled();
  });

  it("opens the edit modal when clicking an editable nexus cell", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByText("Finders"));

    expect(screen.getByText("Edition")).toBeInTheDocument();
    expect(screen.getByLabelText("Nom")).toHaveValue("Finders");
    expect(screen.getByLabelText("Nexus name")).toHaveValue("Finder Alpha");
    expect(screen.getByLabelText("Nexus request type")).toHaveValue("finders");
  });
});
