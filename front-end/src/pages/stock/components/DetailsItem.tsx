import type { StockDetails } from "@/types";
import { Container } from "@/shared/components/Containers";
import type { ContainerType } from "@/types/containerTypes";
import { ImageService } from "@/shared/services/imageService";
import { FormatTools } from "@/shared/tools/formatTools";

interface DetailsItemProps {
  details: StockDetails | null;
  containerType: ContainerType;
}

function DetailsItem({ details, containerType }: DetailsItemProps) {
  if (!details) return null;

  const image = ImageService.getItemImageUrl(details.imageUrlId, "normal");
  const price = FormatTools.pedFormat().format(details.unitPrice);
  return (
    <Container type={containerType} className="flex flex-row">
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
    </Container>
  );
}

export default DetailsItem;
