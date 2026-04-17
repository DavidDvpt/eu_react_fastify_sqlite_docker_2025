import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    ref={ref}
    {...props}
    className={cn(
      "peer inline-flex h-[20px] w-[44px] shrink-0 items-center rounded-full border-2 border-transparent p-[2px] transition-colors",
      "data-[state=checked]:bg-switch-bg-selected",
      "data-[state=unchecked]:bg-switch-bg-unselected",
      className,
    )}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "h-[16px] w-[16px] rounded-full bg-switch-btn transition-transform",
        "data-[state=checked]:translate-x-[20px]",
        "data-[state=unchecked]:translate-x-0",
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
