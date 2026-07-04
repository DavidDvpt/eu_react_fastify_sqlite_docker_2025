import { Section } from "@/shared/components/Containers";
import { FormatTools } from "@/shared/tools/formatTools";

interface ItemSectionInfoProps {
  itemImageUrl: string | null;
  transactionItem: {
    name: string;
    unitPrice: number;
    quantity: number;
  };
}

function ItemSectionInfo({
  itemImageUrl,
  transactionItem,
}: ItemSectionInfoProps) {
  return (
    <Section variant="modal" className="flex flex-row items-center py-2">
      {itemImageUrl ? (
        <img
          src={itemImageUrl}
          alt={transactionItem.name}
          className="h-10 w-10 rounded object-contain"
        />
      ) : null}
      <div className="min-w-0">
        <p className="m-0 truncate font-semibold">{transactionItem.name}</p>
        <p className="m-0 text-sm">
          Coût unitaire:{" "}
          {FormatTools.pedFormat().format(transactionItem.unitPrice)} Ped ·
          Stock: {transactionItem.quantity}
        </p>
      </div>
    </Section>
  );
}

export default ItemSectionInfo;
