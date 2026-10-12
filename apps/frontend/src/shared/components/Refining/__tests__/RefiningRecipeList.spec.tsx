import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import RefiningRecipeList from "../RefiningRecipeList";
import type { RefiningRecipeOptionData } from "../refiningTypes";

const OPTIONS: RefiningRecipeOptionData[] = [
  {
    resultId: "gold",
    name: "Lingot d'or",
    imageUrl: null,
    maxClickCount: 6,
    refinable: true,
  },
  {
    resultId: "iron",
    name: "Lingot de fer",
    imageUrl: null,
    maxClickCount: 0,
    refinable: false,
  },
];

const BASE_PROPS = {
  options: OPTIONS,
  isPending: false,
  isLinesPending: false,
  hasError: false,
  selectedResultId: null,
};

describe("RefiningRecipeList", () => {
  it("renders one option per available recipe", () => {
    render(
      <RefiningRecipeList {...BASE_PROPS} onSelect={vi.fn()} />,
    );

    expect(
      screen.getByRole("button", { name: /Lingot d'or/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Lingot de fer/i }),
    ).toBeInTheDocument();
  });

  it("disables recipes that are not refinable", () => {
    render(
      <RefiningRecipeList {...BASE_PROPS} onSelect={vi.fn()} />,
    );

    expect(
      screen.getByRole("button", { name: /Lingot de fer/i }),
    ).toBeDisabled();
  });

  it("shows the maximum result count for refinable recipes", () => {
    render(
      <RefiningRecipeList {...BASE_PROPS} onSelect={vi.fn()} />,
    );

    expect(screen.getByText("max 6")).toBeInTheDocument();
  });

  it("selects the recipe on click", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<RefiningRecipeList {...BASE_PROPS} onSelect={onSelect} />);

    await user.click(
      screen.getByRole("button", { name: /Lingot d'or/i }),
    );

    expect(onSelect).toHaveBeenCalledWith("gold");
  });

  it("reports the absence of recipes", () => {
    render(
      <RefiningRecipeList
        {...BASE_PROPS}
        options={[]}
        onSelect={vi.fn()}
      />,
    );

    expect(
      screen.getByText("Aucune recette disponible pour cet item."),
    ).toBeInTheDocument();
  });
});
