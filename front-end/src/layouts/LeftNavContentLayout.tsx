import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

type LeftNavLink = {
  label: string;
  to: string;
  Icon?: LucideIcon;
};

type LeftNavContentLayoutProps = {
  sectionLabel: string;
  links: LeftNavLink[];
  children: ReactNode;
};

function LeftNavContentLayout({
  sectionLabel,
  links,
  children,
}: LeftNavContentLayoutProps) {
  return (
    <section className="grid h-full min-h-0 grid-cols-[220px_minmax(0,1fr)] gap-3">
      <aside className="min-h-0 overflow-hidden rounded-md border border-border bg-card p-3">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {sectionLabel}
        </p>
        <nav className="space-y-2">
          {links.map(({ label, to, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  "flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "border-primary-500 bg-primary-500 text-white"
                    : "border-border bg-background text-foreground hover:bg-muted",
                ].join(" ")
              }
            >
              {Icon ? <Icon className="h-4 w-4" /> : null}
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <article className="h-full min-h-0 overflow-x-hidden overflow-y-auto rounded-md border border-border bg-card p-4 md:p-6">
        {children}
      </article>
    </section>
  );
}

export type { LeftNavLink };
export default LeftNavContentLayout;
