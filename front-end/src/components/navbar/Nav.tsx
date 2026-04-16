import { navbarValues } from "./utils";
import NavButton from "./NavButton";

function Nav() {
  return (
    <div className="flex flex-1 items-center justify-start">
      {navbarValues.map((m) => {
        return <NavButton key={m.route} {...m} />;
      })}
    </div>
  );
}

export default Nav;
