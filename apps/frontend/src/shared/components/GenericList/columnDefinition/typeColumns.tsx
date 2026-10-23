import { RefreshCw } from 'lucide-react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { GenericListColumn } from '@/shared/types';
import type { TypeViewModel } from '@zod-schemas';

type TypeColumnsOptions = {
  onNexusUpdate: (typeId: string) => void;
  nexusUpdatePending?: boolean;
};

const createTypeColumns = ({
  onNexusUpdate,
  nexusUpdatePending = false,
}: TypeColumnsOptions): GenericListColumn<TypeViewModel>[] => [
  {
    key: 'name',
    label: 'Nom',
    kind: 'text',
    accessor: 'name',
    fillRemainingSpace: true,
    minWidth: 320,
    bodyCellClassName: 'text-text',
  },
  {
    key: 'category',
    label: 'Categorie',
    kind: 'text',
    minWidth: 320,
    maxWidth: 320,
    bodyCellClassName: 'text-text',
    value: (row) => row.category?.name ?? 'unknown',
  },
  {
    key: 'nexus-update',
    label: '',
    kind: 'button',
    minWidth: 44,
    maxWidth: 44,
    align: 'center',
    render: (row) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              aria-label={`Mettre à jour ${row.name} depuis Nexus`}
              disabled={nexusUpdatePending}
              onClick={() => onNexusUpdate(row.id)}
              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-border bg-surface text-text-muted transition-colors hover:bg-surface-hover hover:text-text focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                className={
                  nexusUpdatePending ? 'h-4 w-4 animate-spin' : 'h-4 w-4'
                }
              />
            </button>
          </TooltipTrigger>
          <TooltipContent>Mettre à jour les données Nexus</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
];

export { createTypeColumns };
