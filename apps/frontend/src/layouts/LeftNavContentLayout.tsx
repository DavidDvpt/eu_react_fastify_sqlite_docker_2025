import type { PropsWithChildren, ReactNode } from 'react';

import { Panel } from '@/shared/components/Containers';

type LeftNavContentLayoutProps = PropsWithChildren<{
  leftNav: ReactNode;
}>;

function LeftNavContentLayout({
  children,
  leftNav,
}: LeftNavContentLayoutProps) {
  return (
    <div className="h-full min-h-0 p-2">
      <Panel className="grid h-full min-h-0 grid-cols-[220px_minmax(0,1fr)] gap-2 overflow-hidden m-0">
        <div className="flex h-full min-h-0 flex-col">{leftNav}</div>

        {children}
      </Panel>
    </div>
  );
}

export default LeftNavContentLayout;
