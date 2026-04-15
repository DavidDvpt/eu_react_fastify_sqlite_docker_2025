import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
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
      />,
    );

    expect(
      screen.getByRole("columnheader", { name: "Nom" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Qty" }),
    ).toBeInTheDocument();
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
      />,
    );
    expect(screen.getByText("Loading rows...")).toBeInTheDocument();

    rerender(
      <GenericTable<Row>
        columns={columns}
        rows={[]}
        getRowKey={(row) => row.id}
        isError
        errorMessage="Oops"
      />,
    );
    expect(screen.getByText("Oops")).toBeInTheDocument();

    rerender(
      <GenericTable<Row>
        columns={columns}
        rows={[]}
        getRowKey={(row) => row.id}
        emptyMessage="No rows"
      />,
    );
    expect(screen.getByText("No rows")).toBeInTheDocument();
  });

  it("calls onRowClick only when a row is clicked", () => {
    const onRowClick = vi.fn();

    render(
      <GenericTable<Row>
        columns={columns}
        rows={[{ id: "1", name: "Item 1", qty: 3 }]}
        getRowKey={(row) => row.id}
        onRowClick={onRowClick}
      />,
    );

    expect(onRowClick).not.toHaveBeenCalled();

    fireEvent.click(screen.getByText("Item 1"));
    expect(onRowClick).toHaveBeenCalledTimes(1);
    expect(onRowClick).toHaveBeenCalledWith({
      id: "1",
      name: "Item 1",
      qty: 3,
    });
  });

  it("applies a fixed width on image columns", () => {
    render(
      <GenericTable<Row>
        columns={[
          { key: "image", header: "Image", render: () => <span>img</span> },
          ...columns,
        ]}
        rows={[{ id: "1", name: "Item 1", qty: 3 }]}
        getRowKey={(row) => row.id}
      />,
    );

    expect(
      screen.queryByRole("columnheader", { name: "Image" }),
    ).not.toBeInTheDocument();

    const imageHeader = screen.getAllByRole("columnheader")[0];
    expect(imageHeader.className).toContain("w-[32px]");
    expect(imageHeader.className).toContain("min-w-[32px]");
    expect(imageHeader.className).toContain("max-w-[32px]");

    const imageCell = screen.getByText("img").closest("td");
    expect(imageCell?.className).toContain("w-[32px]");
    expect(imageCell?.className).toContain("min-w-[32px]");
    expect(imageCell?.className).toContain("max-w-[32px]");
  });

  it("renders footer when provided", () => {
    render(
      <GenericTable<Row>
        columns={columns}
        rows={[{ id: "1", name: "Item 1", qty: 3 }]}
        getRowKey={(row) => row.id}
        footer="Total: 3"
      />,
    );

    expect(screen.getByText("Total: 3")).toBeInTheDocument();
  });
});
