import type { ReactNode } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { AppCardVariant } from "@/shared/types/global.type";

interface AppCardProps {
  title: ReactNode;
  description?: ReactNode;
  content: ReactNode;
  variant?: AppCardVariant;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

function AppCard({
  title,
  description,
  content,
  variant,
  className,
  headerClassName,
  contentClassName,
}: AppCardProps) {
  return (
    <Card variant={variant ?? "default"} className={className}>
      <CardHeader className={cn("items-center text-center", headerClassName)}>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className={contentClassName}>{content}</CardContent>
    </Card>
  );
}

export default AppCard;
