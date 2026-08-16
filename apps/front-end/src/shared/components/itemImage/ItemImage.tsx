import { cn } from "@/lib/utils";
import styles from "./itemImage.module.css";

export type ItemImageSize = "small" | "medium" | "large";

export type ItemImageProps = {
  url?: string | null;
  alt: string;
  size?: ItemImageSize;
  classname?: string;
};

function ItemImage({ url, alt, size, classname }: ItemImageProps) {
  const imageSize = styles[size ?? "medium"];

  return (
    <div className={cn(styles.imageContainer, imageSize, classname)}>
      {url ? (
        <img src={url} alt={alt} className={styles.image} loading="lazy" />
      ) : (
        "-"
      )}
    </div>
  );
}

export default ItemImage;
