import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GenericTable } from "../GenericTable";

type Row = {
  id: string;
  name?: string;
  qty: number;
};

const columns = [
  { key: "name", header: "Nom", accessor: "name" as const },
  { key: "qty", header: "Qty", render: (row: Row) => `${row.qty}u` },
];

describe("GenericTable", () => {
  it("renders rows and fallback value for empty cells", () => {
    render(
      <GenericTable<Row>
        columns={columns}
        rows={[{ id: "1", name: "", qty: 3 }]}
        getRowKey={(row) => row.id}
      />
    );

    expect(screen.getByRole("columnheader", { name: "Nom" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Qty" })).toBeInTheDocument();
    expect(screen.getByText("-")).toBeInTheDocument();
    expect(screen.getByText("3u")).toBeInTheDocument();
  });

  it("renders loading, error and empty states", () => {
    const { rerender } = render(
      <GenericTable<Row>
        columns={columns}
        rows={[]}
        getRowKey={(row) => row.id}
        isLoading
        loadingMessage="Loading rows..."
      />
    );
    expect(screen.getByText("Loading rows...")).toBeInTheDocument();

    rerender(
      <GenericTable<Row>
        columns={columns}
        rows={[]}
        getRowKey={(row) => row.id}
        isError
        errorMessage="Oops"
      />
    );
    expect(screen.getByText("Oops")).toBeInTheDocument();

    rerender(
      <GenericTable<Row>
        columns={columns}
        rows={[]}
        getRowKey={(row) => row.id}
        emptyMessage="No rows"
      />
    );
    expect(screen.getByText("No rows")).toBeInTheDocument();
  });
});
