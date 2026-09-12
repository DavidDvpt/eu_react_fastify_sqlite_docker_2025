import * as React from "react";

import { cn } from "@/lib/utils";
import { formControlClassName } from "@/shared/components/form/form.styles";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          formControlClassName,
          "px-3 py-2 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-text placeholder:text-text-muted",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
