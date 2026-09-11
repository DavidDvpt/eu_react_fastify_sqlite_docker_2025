import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

import { cn } from "@/lib/utils";
import type { ButtonProps } from "./buttons.type";

const baseClasses =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";

const buttonVariants: Record<string | number | symbol, string> = {
  default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
  destructive:
    "border border-button-destructive-border bg-button-destructive-bg text-button-destructive-text shadow hover:border-button-destructive-hover-border hover:bg-button-destructive-hover-bg hover:text-button-destructive-hover-text active:border-button-destructive-active-border active:bg-button-destructive-active-bg active:text-button-destructive-active-text disabled:border-button-destructive-disabled-border disabled:bg-button-destructive-disabled-bg disabled:opacity-100",
  outline:
    "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
  outlinePrimary: "",
  outlineSuccess: "",
  outlineWarning: "",
  outlineDestructive: "",
  outlineSecondary: "",
  link: "text-primary underline-offset-4 hover:underline",
  primary:
    "border border-primary-700 bg-primary-700 text-white shadow hover:not-active:border-primary-900 hover:not-active:bg-primary-900 active:border-primary-700 active:bg-primary-700 disabled:border-primary-300 disabled:bg-primary-300 disabled:opacity-100",
  secondary:
    "border border-button-secondary-border bg-button-secondary-bg text-button-secondary-text hover:bg-button-secondary-hover-bg hover:border-button-secondary-hover-border active:bg-button-secondary-active-bg active:border-button-secondary-active-border disabled:opacity-100",
  ternary:
    "bg-ternary-500 text-white border border-ternary-500 hover:not-active:border-ternary-700 hover:not-active:bg-ternary-700 active:text-white active: bg-ternary-500 disabled:opacity-100",
  success:
    "border border-button-success-border bg-button-success-bg text-button-success-text shadow hover:border-button-success-hover-border hover:bg-button-success-hover-bg hover:text-button-success-hover-text active:border-button-success-active-border active:bg-button-success-active-bg active:text-button-success-active-text disabled:border-button-success-disabled-border disabled:bg-button-success-disabled-bg disabled:opacity-100",
  warning:
    "border border-button-warning-border bg-button-warning-bg text-button-warning-text shadow hover:border-button-warning-hover-border hover:bg-button-warning-hover-bg hover:text-button-warning-hover-text active:border-button-warning-active-border active:bg-button-warning-active-bg active:text-button-warning-active-text disabled:border-button-warning-disabled-border disabled:bg-button-warning-disabled-bg disabled:opacity-100",
  navVertical:
    "w-full justify-center border border-ternary-500 text-center text-sm text-text no-underline hover:bg-ternary-100 hover:borderternary-500 data-[active=true]:font-bold data-[active=true]:shadow-ambient-md",
  navHorizontal:
    "inline-flex min-w-0 flex-1 items-center justify-center text-m font-medium text-text no-underline transition-colors hover:text-text hover:bg-ternary-100 data-[active=true]:font-bold",
} as const;

const buttonSizeClasses: Record<string | number | symbol, string> = {
  default: "h-10 px-6 w-28",
  sm: "h-8 rounded-md px-3 text-sm",
  lg: "h-10 rounded-md px-8",
  icon: "h-9 w-9",
  nav: "h-[100%] px-2 text-lg",
} as const;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          baseClasses,
          buttonVariants[variant],
          buttonSizeClasses[size],
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
