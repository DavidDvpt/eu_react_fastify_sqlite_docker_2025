import { navbarValues } from "./navbar/utils";
import NavButton from "./navbar/NavButton";

function Nav() {
  return (
    <div className="flex h-full w-full items-center">
      {navbarValues.map((m) => {
        return <NavButton key={m.route} {...m} />;
      })}
    </div>
  );
}

export default Nav;
