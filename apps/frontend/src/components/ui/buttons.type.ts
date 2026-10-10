import type { LucideIcon } from "lucide-react";
import type {
  buttonSizeClasses,
  buttonVariants,
} from "@/components/ui/buttons.variants";

export type ButtonVariant = keyof typeof buttonVariants;
export type ButtonSize = keyof typeof buttonSizeClasses;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Optional Lucide icon rendered before the children (or alone). */
  icon?: LucideIcon;
  /** Icon size in px. Defaults to the `size-4` applied by the base classes. */
  iconSize?: number;
  iconClassName?: string;
}
