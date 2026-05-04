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
import { MODAL_GENERIC_VARIANTS } from "./ModalGeneric.variant";

import type { ModalGenericVariant } from "./ModalGeneric.variant";

interface IModalGenericProps extends PropsWithChildren {
  dialogType: "form" | "info" | "confirm";
  variant?: ModalGenericVariant;
  isDefaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  headerStyle?: string;
  contentStyle?: string;
  title?: { value: React.ReactNode; style?: string };
  description?: { value: React.ReactNode; style?: string };
  footer?: { value: React.ReactNode; style?: string };
  noClose: boolean;
}
function ModalGeneric({
  dialogType = "info",
  variant = "default",
  isDefaultOpen = true,
  open,
  onOpenChange,
  headerStyle,
  title,
  description,
  contentStyle,
  children,
  noClose = false,
}: IModalGenericProps) {
  const hasControlledOpen = typeof open === "boolean";
  const variantClassName = MODAL_GENERIC_VARIANTS[variant];

  return (
    <Dialog
      defaultOpen={!hasControlledOpen ? isDefaultOpen : undefined}
      open={hasControlledOpen ? open : undefined}
      onOpenChange={onOpenChange}
    >
      {!isDefaultOpen && <DialogTrigger></DialogTrigger>}
      <DialogContent
        className={[
          variantClassName,
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
