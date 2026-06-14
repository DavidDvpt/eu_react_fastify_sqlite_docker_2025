import NavButton from "./NavButton";
import { navbarValues } from "./utils";

function Nav() {
  return (
    <div className="flex flex-1 items-center justify-start">
      {navbarValues.map((m) => {
        return <NavButton key={m.route} {...m} variant="navHorizontal" />;
      })}
    </div>
  );
}

export default Nav;
