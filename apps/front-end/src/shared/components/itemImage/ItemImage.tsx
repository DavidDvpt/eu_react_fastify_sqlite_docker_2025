import { cn } from "@/lib/utils";
import styles from "./itemImage.module.css";

type ItemImageProps = {
  url?: string | null;
  alt: string;
  size?: "small" | "medium" | "large";
};

function ItemImage({ url, alt, size }: ItemImageProps) {
  const imageSize = styles[size ?? "medium"];

  if (!url) {
    return <div className={cn(styles.imageContainer, imageSize)}>-</div>;
  }

  return (
    <div className={cn(styles.imageContainer, imageSize)}>
      <img src={url} alt={alt} className={styles.image} loading="lazy" />
    </div>
  );
}

export default ItemImage;
