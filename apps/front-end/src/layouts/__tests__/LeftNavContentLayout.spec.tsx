import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LeftNavContentLayout from "../LeftNavContentLayout";

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

function renderManageRoute(tab: "category" | "type" | "item") {
  return render(
    <MemoryRouter initialEntries={[`/manage/${tab}?categoryId=category-1`]}>
      <Routes>
        <Route
          path="/manage/:tab/*"
          element={
            <LeftNavContentLayout>
              <>
                <div>Manage content</div>
                <LocationProbe />
              </>
            </LeftNavContentLayout>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

function LocationProbe() {
  const location = useLocation();
  return (
    <output data-testid="location">
      {location.pathname}
      {location.search}
    </output>
  );
}

describe("LeftNavContentLayout", () => {
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

  it.each([
    ["category", "Créer categorie", "/manage/category/create?categoryId=category-1"],
    ["type", "Créer type", "/manage/type/create?categoryId=category-1"],
    ["item", "Créer item", "/manage/item/create?categoryId=category-1"],
  ] as const)(
    "navigates to the %s create route and keeps the query",
    async (tab, createLabel, expectedLocation) => {
      const user = userEvent.setup();
      renderManageRoute(tab);

      await user.click(screen.getByRole("button", { name: createLabel }));

      expect(screen.getByTestId("location")).toHaveTextContent(expectedLocation);
    },
  );
});
