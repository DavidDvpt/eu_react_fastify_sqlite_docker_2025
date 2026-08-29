import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import NexusPage from "../NexusPage";

describe("NexusPage", () => {
  it("renders the page content", () => {
    render(<NexusPage />);

    expect(screen.getByText("NexusPage")).toBeInTheDocument();
  });
});
