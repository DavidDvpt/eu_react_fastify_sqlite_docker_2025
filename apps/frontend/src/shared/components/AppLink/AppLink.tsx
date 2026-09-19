import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import type { LinkProps } from "react-router-dom";

export function AppLink({ className, ...props }: LinkProps) {
  return (
    <Link
      className={cn(
        "text-primary-700 hover:text-primary-900 underline-offset-4",
        className,
      )}
      {...props}
    />
  );
}
