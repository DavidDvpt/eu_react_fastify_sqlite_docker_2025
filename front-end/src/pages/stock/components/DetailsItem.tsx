import type { StockDetails } from "@/modules/stock";
import { ImageService } from "@/shared/services/imageService";
import { FormatTools } from "@/shared/tools/formatTools";

interface DetailsItemProps {
  details: StockDetails | null;
}

function DetailsItem({ details }: DetailsItemProps) {
  if (!details) return null;

  const image = ImageService.getItemImageUrl(details.imageUrlId, "normal");
  const price = FormatTools.pedFormat().format(details.unitPrice);
  return (
    <section className="shadow-card-inner rounded-md border border-card-inner-border bg-card-inner rounded-md flex flex-row p-3">
      <div className="w-[40%]">
        {image ? (
          <img
            src={image}
            alt={details.name}
            className="h-[120px] w-auto rounded object-contain"
          />
        ) : null}
      </div>
      <div className="w-[59%] flex flex-col">
        <h3 className="text-base font-semibold text-card-inner-title mt-0">
          {details.name}
        </h3>

        <dl className="grid grid-cols-2 gap-2 text-smtext-card-inner-title ">
          <dt>Prix unitaire</dt>
          <dd>{price} PED</dd>
          <dt>Stock restant</dt>
          <dd>{details.quantity}</dd>
        </dl>
      </div>
    </section>
  );
}

export default DetailsItem;
