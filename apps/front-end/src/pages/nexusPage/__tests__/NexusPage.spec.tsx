import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import NexusPage from "../NexusPage";

const importMutate = vi.fn();

vi.mock("@/shared/hooks", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/shared/hooks")>();

  return {
    ...actual,
    useNexusData: () => ({
      nexusRows: [
        {
          id: "1",
          appTypeName: "Finders",
          nexusName: "Finder Alpha",
          nexusRequestType: "Finders",
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
      importMutation: {
        isPending: false,
        mutate: importMutate,
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
  beforeEach(() => {
    importMutate.mockClear();
  });

  it("renders the page content", () => {
    renderPage();

    expect(screen.getAllByText("Type")).toHaveLength(2);
    expect(screen.getAllByText("Finders")).toHaveLength(2);
    expect(screen.getByText("Images KO")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Init" })).toBeDisabled();
  });

  it("opens the edit modal when clicking an editable nexus cell", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getAllByText("Finders")[0]);

    expect(screen.getByText("Edition")).toBeInTheDocument();
    expect(screen.getByLabelText("Nom")).toHaveValue("Finders");
    expect(screen.getByLabelText("Nexus name")).toHaveValue("Finder Alpha");
    expect(screen.getByLabelText("Nexus request type")).toHaveValue("Finders");
  });

  it("imports the selected Nexus request type", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole("button", { name: "Import" }));

    expect(importMutate).toHaveBeenCalledWith({ type: "Finders" });
  });
});
