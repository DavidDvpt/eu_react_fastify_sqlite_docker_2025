type ImageCellProps = {
  imageUrl: string | null;
  alt: string;
};

function ImageCell({ imageUrl, alt }: ImageCellProps) {
  if (!imageUrl) {
    return (
      <div className="grid h-8 w-8 place-items-center rounded-lg border border-dashed border-table-border bg-muted text-xs font-semibold text-muted-foreground">
        -
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className="h-8 w-8 rounded-lg border border-table-border bg-muted object-contain"
      loading="lazy"
    />
  );
}

export { ImageCell };
