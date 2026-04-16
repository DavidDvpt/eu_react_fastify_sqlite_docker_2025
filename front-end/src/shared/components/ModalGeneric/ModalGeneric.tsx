import { type PropsWithChildren } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface IModalGenericProps extends PropsWithChildren {
  dialogType: "form" | "info" | "confirm";
  isDefaultOpen?: boolean;
  headerStyle?: string;
  contentStyle?: string;
  title?: { value: React.ReactNode; style?: string };
  description?: { value: React.ReactNode; style?: string };
  footer?: { value: React.ReactNode; style?: string };
  noClose: boolean;
}
function ModalGeneric({
  dialogType = "info",
  isDefaultOpen = true,
  headerStyle,
  title,
  description,
  contentStyle,
  children,
  noClose = false,
}: IModalGenericProps) {
  return (
    <Dialog defaultOpen={isDefaultOpen}>
      {!isDefaultOpen && <DialogTrigger></DialogTrigger>}
      <DialogContent
        className={[
          "w-auto",
          "flex",
          "flex-col",
          noClose && "[&>button]:hidden",
          contentStyle,
        ].join(" ")}
        onInteractOutside={(e) => e.preventDefault()}
      >
        {(title || description) && (
          <DialogHeader className={headerStyle}>
            {title && (
              <DialogTitle className={title.style}>{title.value}</DialogTitle>
            )}
            {description && (
              <DialogDescription className={description.style}>
                {description.value}
              </DialogDescription>
            )}
          </DialogHeader>
        )}

        {dialogType === "info" && (
          <>
            {children}

            <DialogFooter>
              <DialogClose asChild>
                <Button>Ok</Button>
              </DialogClose>
            </DialogFooter>
          </>
        )}

        {dialogType === "form" && children}
      </DialogContent>
    </Dialog>
  );
}

export default ModalGeneric;
