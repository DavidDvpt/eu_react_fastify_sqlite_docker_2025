import type { ReactNode } from "react";
import { VerticalNav } from "@/shared/components";

type LeftNavLink = {
  key?: string;
  label: ReactNode;
  to?: string;
  onClick?: () => void;
  isActive?: boolean;
  disabled?: boolean;
};

type LeftNavContentLayoutProps = {
  links: LeftNavLink[];
  children: ReactNode;
};

function LeftNavContentLayout({ links, children }: LeftNavContentLayoutProps) {
  return (
    <section className="grid h-full min-h-0 grid-cols-[220px_minmax(0,1fr)] gap-3">
      <aside className="min-h-0 bg-transparent p-3 pt-0">
        <VerticalNav
          items={links.map((link, index) => ({
            key: link.key ?? link.to ?? `left-nav-link-${index}`,
            content: link.label,
            to: link.to,
            onClick: link.onClick,
            isActive: link.isActive,
            disabled: link.disabled,
          }))}
        />
      </aside>

      <article className="h-full min-h-0 overflow-x-hidden overflow-y-auto rounded-md p-4 pt-0 md:p-6">
        {children}
      </article>
    </section>
  );
}

export type { LeftNavLink };
export default LeftNavContentLayout;
