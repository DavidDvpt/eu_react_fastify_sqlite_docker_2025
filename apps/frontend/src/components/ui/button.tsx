import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

import { cn } from "@/lib/utils";
import type { ButtonProps } from "./buttons.type";
import {
  baseClasses,
  buttonSizeClasses,
  buttonVariants,
} from "@/components/ui/buttons.variants";

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      icon: Icon,
      iconSize,
      iconClassName,
      children,
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
          // Tighten icon-to-label spacing only when there is label content.
          children ? "gap-1" : "gap-0",
          className,
        )}
        ref={ref}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <>
            {Icon ? (
              <Icon
                aria-hidden="true"
                size={iconSize ?? 16}
                style={iconSize ? { width: iconSize, height: iconSize } : undefined}
                className={iconClassName}
              />
            ) : null}
            {children}
          </>
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button };
