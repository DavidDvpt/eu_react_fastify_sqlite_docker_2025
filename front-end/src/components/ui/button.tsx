import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "border border-button-destructive-border bg-button-destructive-bg text-button-destructive-text shadow hover:border-button-destructive-hover-border hover:bg-button-destructive-hover-bg hover:text-button-destructive-hover-text active:border-button-destructive-active-border active:bg-button-destructive-active-bg disabled:border-button-destructive-disabled-border disabled:bg-button-destructive-disabled-bg disabled:opacity-100",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        outlinePrimary:
          "border border-button-primary-outline-border bg-button-primary-outline-bg text-button-primary-outline-text shadow hover:border-button-primary-outline-hover-border hover:bg-button-primary-outline-hover-bg hover:text-button-primary-outline-hover-fg active:border-button-primary-outline-active-border active:bg-button-primary-outline-active-bg disabled:border-button-primary-outline-disabled-border disabled:text-button-primary-outline-disabled-text disabled:opacity-100",
        outlineSuccess:
          "border border-button-success-outline-border bg-button-success-outline-bg text-button-success-outline-text shadow hover:border-button-success-outline-hover-border hover:bg-button-success-outline-hover-bg hover:text-button-success-outline-hover-text active:border-button-success-outline-active-border active:bg-button-success-outline-active-bg disabled:border-button-success-outline-disabled-border disabled:text-button-success-outline-disabled-text disabled:opacity-100",
        outlineWarning:
          "border border-button-warning-outline-border bg-button-warning-outline-bg text-button-warning-outline-text shadow hover:border-button-warning-outline-hover-border hover:bg-button-warning-outline-hover-bg hover:text-button-warning-outline-hover-text active:border-button-warning-outline-active-border active:bg-button-warning-outline-active-bg disabled:border-button-warning-outline-disabled-border disabled:text-button-warning-outline-disabled-text disabled:opacity-100",
        outlineDestructive:
          "border border-button-destructive-outline-border bg-button-destructive-outline-bg text-button-destructive-outline-text shadow hover:border-button-destructive-outline-hover-border hover:bg-button-destructive-outline-hover-bg hover:text-button-destructive-outline-hover-text active:border-button-destructive-outline-active-border active:bg-button-destructive-outline-active-bg disabled:border-button-destructive-outline-disabled-border disabled:text-button-destructive-outline-disabled-text disabled:opacity-100",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        primary:
          "border border-button-primary-border bg-button-primary-bg text-button-primary-text shadow hover:border-button-primary-hover-border hover:bg-button-primary-hover-bg hover:text-button-primary-hover-text active:border-button-primary-active-border active:bg-button-primary-active-bg disabled:border-button-primary-disabled-border disabled:bg-button-primary-disabled-bg disabled:opacity-100",
        success:
          "border border-button-success-border bg-button-success-bg text-button-success-text shadow hover:border-button-success-hover-border hover:bg-button-success-hover-bg hover:text-button-success-hover-text active:border-button-success-active-border active:bg-button-success-active-bg disabled:border-button-success-disabled-border disabled:bg-button-success-disabled-bg disabled:opacity-100",
        warning:
          "border border-button-warning-border bg-button-warning-bg text-button-warning-text shadow hover:border-button-warning-hover-border hover:bg-button-warning-hover-bg hover:text-button-warning-hover-text active:border-button-warning-active-border active:bg-button-warning-active-bg disabled:border-button-warning-disabled-border disabled:bg-button-warning-disabled-bg disabled:opacity-100",
      },
      size: {
        default: "h-10 px-6 w-28",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
