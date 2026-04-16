import type { PropsWithChildren, ReactNode } from "react";
import { VerticalNav } from "@/shared/components";
import { useLocation } from "react-router-dom";
import { MANAGE_NAV_LINKS } from "@/modules/manage";
import type { NavbarButtonType } from "@/@types/navbarTypes";

type LeftNavLink = {
  key?: string;
  label: ReactNode;
  to?: string;
  onClick?: () => void;
  isActive?: boolean;
  disabled?: boolean;
};

function LeftNavContentLayout({ children }: PropsWithChildren) {
  const { pathname } = useLocation();

  let links: NavbarButtonType[] = [];

  if (pathname.startsWith("/manage")) links = [...MANAGE_NAV_LINKS];

  return (
    <section className="grid h-full min-h-0 px-3 grid-cols-[220px_minmax(0,1fr)] gap-1">
      <VerticalNav
        items={links.map((link) => ({
          key: `left-nav-link-${link.key}`,
          content: link.content,
          route: link.route,
          variant: "navVertical",
        }))}
      />

      <article className="h-full min-h-0 overflow-x-hidden overflow-y-auto rounded-md p-4 pt-0 md:p-6">
        {children}
      </article>
    </section>
  );
}

export type { LeftNavLink };
export default LeftNavContentLayout;
