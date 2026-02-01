import { navbarValues } from "./navbar/utils";
import NavButton from "./navbar/NavButton";

function Nav() {
  return (
    <div className="flex w-full">
      {navbarValues.map((m) => {
        return <NavButton {...m} />;
      })}
    </div>
  );
}

export default Nav;
