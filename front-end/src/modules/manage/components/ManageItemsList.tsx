import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { GenericList } from "@/shared/components";
import type { GenericListColumn, Item } from "@/shared/types";
import ItemCard from "@/shared/components/GenericList/ItemCard";

type ManageItemsListProps = {
  columns: GenericListColumn<Item>[];
  rows: Item[];
  isLoading: boolean;
  isError: boolean;
  loadingMessage: string;
  errorMessage: string;
  emptyMessage: string;
  onRowClick: (row: Item) => void;
};

function ManageItemsList({
  columns,
  rows,
  isLoading,
  isError,
  loadingMessage,
  errorMessage,
  emptyMessage,
  onRowClick,
}: ManageItemsListProps) {
  const [isCardView, setIsCardView] = useState(false);
  function handleViewModeChange(checked: boolean) {
    setIsCardView(checked);
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-2">
      <div className="flex items-center justify-start gap-2 py-1">
        <span className="text-sm text-muted-foreground">Ligne</span>
        <Switch
          checked={isCardView}
          onCheckedChange={handleViewModeChange}
          aria-label="Basculer entre affichage ligne et carte"
        />
        <span className="text-sm text-muted-foreground">Carte</span>
      </div>

      <GenericList<Item>
        columns={columns}
        rows={rows}
        getRowKey={(row) => row.id}
        isLoading={isLoading}
        isError={isError}
        onRowClick={onRowClick}
        viewMode={isCardView ? "card" : "list"}
        allowCardView
        loadingMessage={loadingMessage}
        errorMessage={errorMessage}
        emptyMessage={emptyMessage}
        renderCard={(item) => <ItemCard item={item} isManage={true} />}
      />
    </div>
  );
}

export { ManageItemsList };
