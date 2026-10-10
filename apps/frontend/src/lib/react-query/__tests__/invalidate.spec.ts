import { beforeEach, describe, expect, it, vi } from "vitest";

import { InvalidateQueryAndKeys } from "../InvalidateQueryAndKeys";

const { invalidateQueriesMock } = vi.hoisted(() => ({
  invalidateQueriesMock: vi.fn(),
}));

vi.mock("@/lib/react-query/queryClient", () => ({
  queryClient: { invalidateQueries: invalidateQueriesMock },
}));

describe("lotTierMutation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    invalidateQueriesMock.mockResolvedValue(undefined);
  });

  it("refreshes lots and stock lines so tiers never display stale", async () => {
    await InvalidateQueryAndKeys.lotTierMutation("item-1");

    const keys = invalidateQueriesMock.mock.calls.map(
      (call) => (call[0] as { queryKey: unknown }).queryKey,
    );
    expect(keys).toContainEqual(["item-lots", "item-1"]);
    expect(keys).toContainEqual(["inventory", "lots"]);
    expect(keys).toContainEqual(["stock", "items-stock"]);
    expect(keys).toContainEqual(["stock", "item-stock", "item-1"]);
  });
});
