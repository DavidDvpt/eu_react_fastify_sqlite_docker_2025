import { NavButton } from "@/components/navbar";
import type { NavbarButtonType } from "@/shared/types";

type VerticalNavProps = {
  items: NavbarButtonType[];
  className?: string;
};

function VerticalNav({ items }: VerticalNavProps) {
  return (
    <aside className={"flex flex-col space-y-2 m-2"}>
      {items.map((item) => {
        return (
          <NavButton
            key={item.key}
            variant={item.variant}
            content={item.content}
            route={item.route}
            isActive={item.isActive}
          ></NavButton>
        );
      })}
    </aside>
  );
}

export { VerticalNav };
export type { VerticalNavProps };
