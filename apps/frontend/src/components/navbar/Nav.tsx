import { selectIsAdmin } from "@/store";
import { useAppSelector } from "@/store/hooks";

import NavButton from "./NavButton";
import { navbarValues } from "./utils";

function Nav() {
  const role = useAppSelector(selectIsAdmin);

  return (
    <div className="flex flex-1 items-center justify-start">
      {navbarValues
        .filter((item) => !item.adminOnly || role === "ADMIN")
        .map((m) => {
        return <NavButton key={m.route} {...m} variant="navHorizontal" />;
        })}
    </div>
  );
}

export default Nav;
