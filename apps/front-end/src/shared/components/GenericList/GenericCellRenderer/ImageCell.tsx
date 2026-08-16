import ItemImage, {
  type ItemImageProps,
} from "@/shared/components/itemImage/ItemImage";

type ImageCellProps = {
  imageUrl: string | null;
  alt: ItemImageProps["alt"];
  size?: ItemImageProps["size"];
};

function ImageCell({ imageUrl, alt, size = "small" }: ImageCellProps) {
  return <ItemImage url={imageUrl} alt={alt} size={size} />;
}

export { ImageCell };
