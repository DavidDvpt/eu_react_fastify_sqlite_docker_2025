import ItemImage from "@/shared/components/itemImage/ItemImage";

type ImageCellProps = {
  imageUrl: string | null;
  alt: string;
};

function ImageCell({ imageUrl, alt }: ImageCellProps) {
  return <ItemImage url={imageUrl} alt={alt} size="small" />;
}

export { ImageCell };
