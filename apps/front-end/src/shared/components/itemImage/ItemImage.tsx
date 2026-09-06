import { cn } from "@/lib/utils";
import { useState } from "react";
import styles from "./itemImage.module.css";

export type ItemImageSize = "small" | "medium" | "large";

export type ItemImageProps = {
  url: string | null;
  alt: string;
  size?: ItemImageSize;
  classname?: string;
};

function ItemImage({ url, alt, size, classname }: ItemImageProps) {
  const imageSize = styles[size ?? "medium"];
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const hasError = failedUrl === url;

  return (
    <div className={cn(styles.imageContainer, imageSize, classname)}>
      {url && !hasError ? (
        <img
          src={url}
          alt={alt}
          className={styles.image}
          loading="lazy"
          onError={() => setFailedUrl(url)}
        />
      ) : (
        <span className="text-black" aria-label={`${alt} indisponible`}>
          -
        </span>
      )}
    </div>
  );
}

export default ItemImage;
