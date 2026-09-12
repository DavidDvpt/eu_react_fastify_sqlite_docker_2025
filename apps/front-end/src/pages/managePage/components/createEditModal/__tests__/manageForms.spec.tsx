import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CategoryForm from "../CategoryForm";
import CreateEditModal from "../CreateEditModal";
import TypeForm from "../TypeForm";
import ManageItemForm from "../ItemForm";

const mockUseSystemMutation = vi.fn();
const mockUseSystemDatas = vi.fn();

vi.mock("@/shared/hooks/useSystemMutation", () => ({
  default: () => mockUseSystemMutation(),
}));

vi.mock("@/shared/hooks", async () => {
  const actual = await vi.importActual<typeof import("@/shared/hooks")>(
    "@/shared/hooks",
  );

  return {
    ...actual,
    useSystemDatas: () => mockUseSystemDatas(),
  };
});

const createMutation = () => ({ mutate: vi.fn(), isPending: false });

describe("manage forms", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSystemMutation.mockReturnValue({
      categoryMutation: createMutation(),
      typeMutation: createMutation(),
      itemMutation: createMutation(),
    });
    mockUseSystemDatas.mockReturnValue({
      categories: {
        data: [{ id: "category-1", name: "Weapons" }],
      },
      types: {
        typeDatas: [{ id: "type-1", name: "Finder" }],
      },
    });
  });

  it("renders the category form from the category schema", () => {
    render(<CategoryForm onClose={vi.fn()} />);

    expect(screen.getByRole("textbox", { name: "Nom:" })).toBeInTheDocument();
    expect(screen.getByText("Actif")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Créer" })).toBeInTheDocument();
  });

  it("renders the type form with its category selector", () => {
    render(<TypeForm onClose={vi.fn()} />);

    expect(screen.getByRole("textbox", { name: "Nom:" })).toBeInTheDocument();
    expect(screen.getByText("Catégorie:")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByText("Stackable")).toBeInTheDocument();
  });

  it("renders the item form with its type selector and flags", () => {
    render(<ManageItemForm onClose={vi.fn()} />);

    expect(screen.getByRole("textbox", { name: "Nom:" })).toBeInTheDocument();
    expect(screen.getByText("Type:")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByRole("spinbutton", { name: "Valeur:" })).toBeInTheDocument();
    expect(screen.getByText("Non échangeable")).toBeInTheDocument();
    expect(screen.getByText("Rare")).toBeInTheDocument();
  });

  it.each([
    ["category", "Actif"],
    ["type", "Stackable"],
    ["item", "Non échangeable"],
  ] as const)("renders the %s form inside the edit modal", (tab, marker) => {
    render(
      <MemoryRouter initialEntries={[`/manage/${tab}/create`]}>
        <CreateEditModal tab={tab} />
      </MemoryRouter>,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(marker)).toBeInTheDocument();
  });
});
