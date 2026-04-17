import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useGenericObjectFilter } from "../hooks/useGenericObjectFilter";
import type { GenericFilterModel } from "@/types";

type ItemLike = {
  id: string;
  categoryId: string;
  typeId: string;
};

const items: ItemLike[] = [
  { id: "item-1", categoryId: "cat-a", typeId: "type-1" },
  { id: "item-2", categoryId: "cat-a", typeId: "type-2" },
  { id: "item-3", categoryId: "cat-b", typeId: "type-3" },
];

const model: GenericFilterModel<ItemLike> = {
  fields: [
    {
      key: "category",
      label: "Categorie",
      kind: "select",
      dependsOn: [],
      getValue: (item) => item.categoryId,
      getLabel: (item) => item.categoryId,
    },
    {
      key: "type",
      label: "Type",
      kind: "select",
      dependsOn: ["category"],
      getValue: (item) => item.typeId,
      getLabel: (item) => item.typeId,
    },
  ],
};

describe("useGenericObjectFilter", () => {
  it("filters options using other selected fields (exclude self)", async () => {
    const { result } = renderHook(() =>
      useGenericObjectFilter({
        items,
        model,
      }),
    );

    act(() => {
      result.current.setFilterValue("category", "cat-a");
    });

    await waitFor(() => {
      expect(
        result.current.selectOptions.type.map((option) => option.value),
      ).toEqual(["type-1", "type-2"]);
    });
  });

  it("resets invalid select value when parent filter changes", async () => {
    const { result } = renderHook(() =>
      useGenericObjectFilter({
        items,
        model,
      }),
    );

    act(() => {
      result.current.setFilterValue("type", "type-1");
      result.current.setFilterValue("category", "cat-b");
    });

    await waitFor(() => {
      expect(result.current.filterState.type).toBeNull();
    });
    expect(result.current.filteredItems).toEqual([
      { id: "item-3", categoryId: "cat-b", typeId: "type-3" },
    ]);
  });
});
