import type { LucideIcon } from "lucide-react";
import { Check, CornerDownLeft, EllipsisVertical, Pencil, Save, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ButtonProps } from "@/components/ui/buttons.type";

export const IconButtonIcon = {
  Edit: "Edit",
  Enter: "Enter",
  Delete: "Delete",
  Close: "Close",
  Save: "Save",
  Confirm: "Confirm",
  More: "More",
} as const;

export type IconButtonIcon = (typeof IconButtonIcon)[keyof typeof IconButtonIcon];

const icons: Record<IconButtonIcon, LucideIcon> = {
  [IconButtonIcon.Edit]: Pencil,
  [IconButtonIcon.Enter]: CornerDownLeft,
  [IconButtonIcon.Delete]: Trash2,
  [IconButtonIcon.Close]: X,
  [IconButtonIcon.Save]: Save,
  [IconButtonIcon.Confirm]: Check,
  [IconButtonIcon.More]: EllipsisVertical,
};

type IconButtonProps = Omit<ButtonProps, "icon"> & {
  icon: IconButtonIcon;
};

function IconButton({ icon, ...props }: IconButtonProps) {
  return <Button {...props} icon={icons[icon]} />;
}

export default IconButton;
