import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { GenericFilter } from "../GenericFilter";
import type { GenericFilterModel, UseGenericObjectFilterResult } from "../types";

type ItemLike = {
  id: string;
  category?: string;
  name?: string;
  isLimited?: boolean;
};

function createFilterMock(
  filterState: Record<string, string | boolean | null>
): UseGenericObjectFilterResult<ItemLike> {
  return {
    filteredItems: [],
    filterState,
    setFilterValue: vi.fn(),
    resetFilters: vi.fn(),
    selectOptions: {
      category: [{ value: "cat-1", label: "Cat 1" }],
    },
    autocompleteOptions: {
      search: ["Oil", "Ore"],
    },
  };
}

describe("GenericFilter", () => {
  it("hides limited field when hasIsLimited is false and resets its state", async () => {
    const model: GenericFilterModel<ItemLike> = {
      fields: [
        {
          key: "category",
          label: "Categorie",
          kind: "select",
          getValue: (item) => item.category ?? null,
        },
        {
          key: "limited",
          label: "Limited",
          kind: "boolean",
          getValue: (item) => item.isLimited ?? false,
        },
      ],
    };

    const filter = createFilterMock({ category: null, limited: true });

    render(<GenericFilter model={model} filter={filter} hasIsLimited={false} />);

    expect(screen.queryByText("Limited")).not.toBeInTheDocument();

    await waitFor(() => {
      expect(filter.setFilterValue).toHaveBeenCalledWith("limited", null);
    });

    fireEvent.click(screen.getByRole("button", { name: "Reset" }));
    expect(filter.resetFilters).toHaveBeenCalledTimes(1);
  });

  it("renders autocomplete as select when hasInput is false", () => {
    const model: GenericFilterModel<ItemLike> = {
      fields: [
        {
          key: "search",
          label: "Nom",
          kind: "autocomplete",
          getValue: (item) => item.name ?? "",
        },
      ],
    };
    const filter = createFilterMock({ search: "" });

    render(<GenericFilter model={model} filter={filter} hasInput={false} />);

    expect(screen.queryByRole("textbox", { name: "Nom" })).not.toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Nom" })).toBeInTheDocument();
  });
});
