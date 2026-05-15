import { cn } from "@/lib/utils";

import type { ContainerProps } from "@/shared/types";
import { containerVariants } from "./container.variants";

function Container({
  children,
  className,
  variant = "default",
}: ContainerProps) {
  return (
    <div className={cn(containerVariants({ variant }), className)}>
      {children}
    </div>
  );
}

export default Container;
