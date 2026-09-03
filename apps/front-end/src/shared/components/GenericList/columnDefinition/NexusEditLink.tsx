import { AppLink } from "@/shared/components/AppLink";
import type { NexusUpdateDto } from "@eu/types";
import { useLocation } from "react-router-dom";

type NexusEditLinkProps = {
  row: NexusUpdateDto;
  value: string | null | undefined;
};

export function NexusEditLink({ row, value }: NexusEditLinkProps) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  searchParams.set("nexusUpdateId", row.id);

  return (
    <AppLink
      to={{
        pathname: location.pathname,
        search: searchParams.toString(),
      }}
      className="font-medium text-table-head-text no-underline hover:no-underline"
    >
      {value}
    </AppLink>
  );
}
