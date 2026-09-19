import { render, screen } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ItemImage from "../ItemImage";

describe("ItemImage", () => {
  it("shows a fallback when the image cannot be loaded", async () => {
    render(<ItemImage url="/missing.jpg" alt="Oil" size="small" />);

    fireEvent.error(screen.getByRole("img", { name: "Oil" }));

    expect(screen.getByLabelText("Oil indisponible")).toHaveTextContent("-");
  });
});
