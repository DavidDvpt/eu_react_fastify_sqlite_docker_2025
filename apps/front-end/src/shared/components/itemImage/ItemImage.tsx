import { cn } from "@/lib/utils";
import styles from "./itemImage.module.css";

type ItemImageProps = {
  url?: string | null;
  alt: string;
  size?: "small" | "medium" | "large";
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
