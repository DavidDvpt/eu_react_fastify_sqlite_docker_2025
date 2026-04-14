import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import type { LinkProps } from "react-router-dom";

export function AppLink({ className, ...props }: LinkProps) {
  return (
    <Link
      className={cn(
        "text-button-tertiary-text hover:text-button-tertiary-hover-text underline-offset-4 hover:underline",
        className,
      )}
      {...props}
    />
  );
}
